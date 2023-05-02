export function latLonToCart(inputLat, inputLng, radius) {
  const lat = inputLat * (Math.PI / 180);
  const lng = inputLng * (Math.PI / 180);

  const z = radius * Math.cos(lat) * Math.cos(lng);
  const x = radius * Math.cos(lat) * Math.sin(lng);
  const y = radius * Math.sin(lat);
  return [x, y, z];
}
