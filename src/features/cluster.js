const clusterButton = document.getElementById("cluster-button");
const clusterList = document.getElementById("cluster-list");
const subClusterButton = document.getElementById("sub-cluster-button");
const subClusterList = document.getElementById("sub-cluster-list");

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
        console.log(`Clicked on ${item}`);
      });
      subClusterList.appendChild(li);
    });
};

/* generateSubClusterListItems(new Set(["A", "B", "C", "D", "F"])); */
