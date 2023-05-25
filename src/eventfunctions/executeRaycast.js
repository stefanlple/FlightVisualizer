import * as THREE from "three";
import * as d3 from "d3";
import base64 from "base64-js";

import { findObjectByName } from "../utility/findObjectbyName";
import { removeObject3D } from "../utility/removeObject3D";

import { username, password } from "../../info";

import { latLonToCart } from "../utility/latLngToCartSystem";
import { removeTrack } from "../utility/removeTrack";

import Aircraft from "../objects/Aircraft";

window.raycaster = new THREE.Raycaster();

export async function executeRaycast() {
  //raycast
  window.raycaster.setFromCamera(window.mousePosition, window.camera);
  let intersects = window.raycaster.intersectObject(window.scene, true);

  if (intersects.length > 0) {
    let firstHit = intersects[0].object;

    const object = findObjectByName(firstHit, "aircraft");
    if (object?.icao24) {
      const icao24 = object.icao24;
      await Promise.all([
        fetchAircraftOnIcao(icao24),
        fetchTrackOnIcao(icao24),
      ]);
    }
  }
}

async function fetchAircraftOnIcao(icao24) {
  const credentials = `${username}:${password}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(credentials);
  const encodedCredentials = base64.fromByteArray(data);

  const url = "https://opensky-network.org/api/states/all?icao24=";
  const response = await fetch(url + icao24, {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  });
  const jsonData = await response.json();
  console.log("aircraft fetched", jsonData.states[0]);
  displayData(jsonData.states[0]);
}

const globeRadius = 102;

async function fetchTrackOnIcao(icao24) {
  removeTrack();

  const credentials = `${username}:${password}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(credentials);
  const encodedCredentials = base64.fromByteArray(data);

  const url = `https://opensky-network.org/api/tracks/all?icao24=${icao24}&time=0`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  });
  const jsonData = await response.json();

  const pathJson = jsonData.path;
  const pathPoints = [];
  pathJson.forEach((e) => {
    const [x, y, z] = latLonToCart(e[1], e[2], e[3], globeRadius);
    pathPoints.push(new THREE.Vector3(x, y, z));
  });

  const track = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pathPoints),
    new THREE.LineBasicMaterial({
      color: 0x00ff00,
      linewidth: 5,
    })
  );
  track.name = "track";
  window.scene.add(track);
  console.log(window.scene);
  drawGraphAndPlane(pathJson, track);
}

function drawGraphAndPlane(dataPoints, track) {
  // Sample data points
  const dataTrack = [];

  dataPoints.forEach((e) => {
    const timestamp = e[0];
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    dataTrack.push({
      time: date,
      altitude: e[3],
      position: {
        latitude: e[1],
        longitude: e[2],
        trueTrack: e[4],
      },
    });
  });
  //remove previous content
  d3.select("#graph").selectAll("*").remove();

  // Set up dimensions and margins for the graph
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 500 - margin.left - margin.right;
  const height = 250 - margin.top - margin.bottom;

  // Create an SVG container
  const svg = d3
    .select("#graph")
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${
        height + margin.top + margin.bottom
      }`
    )
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Define scales for x and y axes
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataTrack, (d) => d.time))
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataTrack, (d) => d.altitude)])
    .range([height, 0]);

  // Create x and y axes
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%H:%M"));
  const yAxis = d3.axisLeft(yScale);

  // Append x and y axes to the SVG container
  svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis);

  svg.append("g").call(yAxis);

  // Create a line generator for the altitude path
  const line = d3
    .line()
    .x((d) => xScale(d.time))
    .y((d) => yScale(d.altitude));

  // Draw the altitude path
  svg
    .append("path")
    .datum(dataTrack)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  // Add data points as circles
  svg
    .selectAll(".datapoint")
    .data(dataTrack)
    .enter()
    .append("circle")
    .attr("class", "datapoint")
    .attr("cx", (d) => xScale(d.time))
    .attr("cy", (d) => yScale(d.altitude))
    .attr("r", 3)
    .attr("fill", "steelblue")
    .on("mouseover", (event, d) => {
      // Show tooltip on mouseover
      tooltip
        .style("opacity", 1)
        .html(
          `Time: ${d.time.getHours()}:${d.time.getMinutes()}, Altitude: ${
            d.altitude
          }`
        )
        .style("left", `${event.pageX}px`)
        .style("top", `${event.pageY}px`);

      const [x, y, z] = latLonToCart(
        d.position.latitude,
        d.position.longitude,
        d.altitude,
        102.1
      );
      if (track.children.length === 0) {
        const aircraft = new Aircraft();
        aircraft.position.set(x, y, z);
        aircraft.lookAt(0, 0, 0);
        aircraft.rotateZ(THREE.MathUtils.degToRad(d.position.trueTrack));
        track.add(aircraft);
      }
    })
    .on("mouseout", () => {
      // Hide tooltip on mouseout
      if (track.children.length !== 0) {
        removeObject3D(track.children[0]);
      }
      tooltip.style("opacity", 0);
    });

  // Create a tooltip element
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  const trackBox = document.getElementById("altitude_box");
  trackBox.style.height = "250px";
}

function displayData(data) {
  const aircraftInfoBox = document.getElementById("aircraft_info_box");

  const icao = document.getElementById("icao");
  const callSign = document.getElementById("call-sign");
  const longitude = document.getElementById("longitude");
  const latitude = document.getElementById("latitude");
  const baromAltitude = document.getElementById("barom-altitude");
  const geoAltitude = document.getElementById("geo-altitude");
  const verticalRate = document.getElementById("vertical-rate");
  const velocity = document.getElementById("velocity");
  const trueTrack = document.getElementById("true-track");
  const source = document.getElementById("source");

  icao.innerHTML = data[0];
  callSign.innerHTML = data[1];
  longitude.innerHTML = data[5] + " &#176";
  latitude.innerHTML = data[6] + " &#176";
  baromAltitude.innerHTML =
    Math.round(data[7]) + " ft " + `(${Math.round(data[7] * 0.304)} m)`;
  geoAltitude.innerHTML =
    Math.round(data[13]) + " ft " + `(${Math.round(data[13] * 0.304)} m)`;
  verticalRate.innerHTML = !!data[11]
    ? data[11] * 196.85 + " ft/min " + `(${data[11]} m/s)`
    : "N/A";
  velocity.innerHTML = data[9] + " m/s";
  trueTrack.innerHTML = data[10] + " &#176";
  source.innerHTML = {
    0: "ADS-B",

    1: "ASTERIX",

    2: "MLAT",

    3: "FLARM",
  }[data[16]];

  aircraftInfoBox.style.width = "auto";
}
