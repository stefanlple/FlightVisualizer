export const clusterButton = document.getElementById("cluster-button");
const clusterList = document.getElementById("cluster-list");
export const byContinentDiv = document.getElementById("group-by-continent");
const subClusterButton = document.getElementById("sub-cluster-button");
export const subClusterList = document.getElementById("sub-cluster-list");

function toggleClusterList() {
  clusterList.style.display =
    clusterList.style.display === "block" ? "none" : "block";
}

function toggleSubClusterList() {
  subClusterList.style.display =
    subClusterList.style.display === "block" ? "none" : "block";
}

clusterButton.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleClusterList();
  if (clusterButton.innerHTML !== "Group") {
    clusterButton.innerHTML = "Group";
  }
});

subClusterButton.addEventListener("mouseenter", () => {
  toggleSubClusterList();
});

subClusterList.addEventListener("mouseleave", () => {
  toggleSubClusterList();
});

document.addEventListener("click", () => {
  clusterList.style.display = "none";
});

// Function to generate dynamic list items for sub-cluster list

export const generateSubClusterListItems = (input) => {
  subClusterList.innerHTML = "";
  Array.from(input)
    .sort()
    .forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      li.addEventListener("click", () => {
        // Add your logic here when clicking on each sub-cluster item
        clusterButton.innerHTML = item;
      });
      subClusterList.appendChild(li);
    });

  byContinentDiv.addEventListener("click", () => {
    clusterButton.innerHTML = byContinentDiv.innerHTML;
  });
};

document.getElementById("help").addEventListener("mouseover", () => {
  document.getElementById("legend").style.visibility = "visible";
});

document.getElementById("help").addEventListener("mouseout", () => {
  document.getElementById("legend").style.visibility = "hidden";
});
