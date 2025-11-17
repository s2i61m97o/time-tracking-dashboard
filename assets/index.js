const container = document.getElementById("time-tracker-container");
const timeTrackDataContainer = document.querySelector(".time-track-data");
const timeScales = document.querySelectorAll(".time");

// Starting Variables
let activeTimeString = "daily";
let prevTxt = "Yesterday";

// Fetch the data from the file
fetch("./data.json")
  .then((response) => {
    if (!response.ok) return console.log("Something went wrong fetching JSON");

    return response.json();
  })
  .then((data) => {
    // Pass the Data & hide the unselected data
    populateDOM(data);
    hideUnselected();
  });

//   Timeframe Event Listener
timeScales.forEach((time) => {
  time.addEventListener("click", (time) => {
    activeTime = time.target;
    activeTime.classList.add("active");
    activeTimeString = activeTime.innerText.toLowerCase();
    timeScales.forEach((time) => {
      if (time.innerText != activeTime.innerText) {
        time.classList.remove("active");
      }
    });
    hideUnselected();
  });
  return activeTimeString;
});

// Create the HTML content for the data
function appendItem(item) {
  let typeTitle = item.title;
  let type = typeTitle.replace(/\s+/g, "-").toLowerCase();
  Object.entries(item["timeframes"]).forEach(([timeframe, timeframeData]) => {
    // Set the previous time text
    let prevTxt;
    if (timeframe === "daily") {
      prevTxt = "Yesterday - ";
    } else if (timeframe === "weekly") {
      prevTxt = "Last Week - ";
    } else {
      prevTxt = "Last Month -";
    }

    const timeTracker = document.createElement("div");
    timeTracker.className = `activity ${type} ${timeframe}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = `content`;

    const titleDiv = document.createElement("div");
    titleDiv.className = `title`;

    const timeframeTypePara = document.createElement("p");
    timeframeTypePara.className = `type`;
    timeframeTypePara.textContent = typeTitle;
    const ellpssImgHtml = document.createElement("img");
    ellpssImgHtml.src = "./assets/images/icon-ellipsis.svg";

    titleDiv.append(timeframeTypePara, ellpssImgHtml);

    const dataDiv = document.createElement("div");
    dataDiv.className = `data`;

    const hoursPara = document.createElement("p");
    hoursPara.className = `hours`;
    hoursPara.textContent = `${timeframeData.current}hrs`;
    const prevHoursPara = document.createElement("p");
    prevHoursPara.className = `prev-hours`;
    prevHoursPara.textContent = `${prevTxt} ${timeframeData.previous}hrs`;

    dataDiv.append(hoursPara, prevHoursPara);

    contentDiv.append(titleDiv, dataDiv);
    timeTracker.appendChild(contentDiv);
    timeTrackDataContainer.appendChild(timeTracker);
  });
}

// Insert the data via the DOM
function populateDOM(data) {
  data.forEach(appendItem);
}

// Function to hide unselected timeframe data
function hideUnselected() {
  const activities = document.querySelectorAll(".activity");

  activities.forEach((activity) => {
    if (!activity.classList.contains(activeTimeString)) {
      activity.classList.add("hidden");
    } else {
      activity.classList.remove("hidden");
    }
  });
}
