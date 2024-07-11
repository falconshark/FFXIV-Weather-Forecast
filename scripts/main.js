/**
 * @author Kiku
 *
 * Script for rendering the UI
 */

// Selected language from the localStorage
let selectedLang = localStorage.getItem("selectedLang")
  ? localStorage.getItem("selectedLang")
  : "en";
let searchResults = [];

// Retrieves conditions from localStorage and performs data validation
const getSavedConditions = () => {
  let savedConditions;

  // Conditions must be an array
  try {
    savedConditions = JSON.parse(localStorage.getItem("savedConditions"));
  } catch (error) {
    savedConditions = [];
  }

  if (!savedConditions.constructor === Array) {
    savedConditions = [];
  }

  // Validation for missing fields generated by older versions of the app
  for (const condition of savedConditions) {
    if (condition.show === undefined) {
      condition.show = true;
    }
  }

  localStorage.setItem("savedConditions", JSON.stringify(savedConditions));

  return savedConditions;
};

/**
 * Creates various HTML elements and adds them to the page
 * @param {string} lang The language id
 */
const render = (lang) => {
  const rootElement = document.getElementById("root");
  const colourMode = localStorage.getItem("colourMode")
    ? localStorage.getItem("colourMode")
    : "dark";
  rootElement.setAttribute("data-bs-theme", colourMode);

  renderExpansionSelect(lang);
  renderAreaSelect(lang);
  renderLabels(lang);

  renderWeatherCheckboxes(
    "targetWeatherOptions",
    lang,
    document.getElementById("areaSelect").value
  );
  renderWeatherCheckboxes(
    "precedingWeatherOptions",
    lang,
    document.getElementById("areaSelect").value
  );

  // Restore saved settings from localStorage
  const savedConditions = getSavedConditions();

  renderConditions(savedConditions);

  const maximumNumberInput = document.getElementById("maximumNumber");
  maximumNumberInput.value = localStorage.getItem("maximumNumber")
    ? localStorage.getItem("maximumNumber")
    : 10;

  const maximumCyclesInput = document.getElementById("maximumCycles");
  maximumCyclesInput.value = localStorage.getItem("maximumCycles")
    ? localStorage.getItem("maximumCycles")
    : 100000;

  if (searchResults.length > 0) {
    renderResults(searchResults);
  }
};

/**
 * Adds text to the page based on the selected language
 * @param {string} lang The language id
 */
const renderLabels = (lang) => {
  document.title = langMap[lang].web.ffxivWeatherForecastLabel;

  document.getElementById("ffxivWeatherForecastLabel").innerHTML =
    langMap[lang].web.ffxivWeatherForecastLabel;
  document.getElementById("expansionLabel").innerHTML =
    langMap[lang].web.expansionLabel;
  document.getElementById("areaLabel").innerHTML = langMap[lang].web.areaLabel;
  document.getElementById("timeLabel").innerHTML = langMap[lang].web.timeLabel;
  document.getElementById("findWeatherButton").innerHTML =
    langMap[lang].web.findWeather;
  document.getElementById("addWeatherConditionsButton").innerHTML =
    langMap[lang].web.addWeatherConditions;

  document.getElementById("areaConditionsHeader").innerHTML =
    langMap[lang].web.areaConditionsHeader;
  document.getElementById("targetWeatherConditionsHeader").innerHTML =
    langMap[lang].web.targetWeatherConditionsHeader;
  document.getElementById("previousWeatherConditionsHeader").innerHTML =
    langMap[lang].web.previousWeatherConditionsHeader;
  document.getElementById("eorzeaTimeConditionsHeader").innerHTML =
    langMap[lang].web.eorzeaTimeConditionsHeader;

  document.getElementById("areaHeader").innerHTML =
    langMap[lang].web.areaHeader;
  document.getElementById("previousWeatherHeader").innerHTML =
    langMap[lang].web.previousWeatherHeader;
  document.getElementById("currentWeatherHeader").innerHTML =
    langMap[lang].web.currentWeatherHeader;
  document.getElementById("eorzeaTimeHeader").innerHTML =
    langMap[lang].web.eorzeaTimeHeader;
  document.getElementById("localTimeHeader").innerHTML =
    langMap[lang].web.localTimeHeader;

  document.getElementById("advancedOptionsButtonLabel").innerHTML =
    langMap[lang].web.advancedOptionsButtonLabel;
  document.getElementById("advancedOptionsLabel").innerHTML =
    langMap[lang].web.advancedOptionsLabel;
  document.getElementById("maximumNumberLabel").innerHTML =
    langMap[lang].web.maximumNumberLabel;
  document.getElementById("maximumCyclesLabel").innerHTML =
    langMap[lang].web.maximumCyclesLabel;
  document.getElementById("customStartDateLabel").innerHTML =
    langMap[lang].web.customStartDateLabel;
  document.getElementById("closeButtonLabel").innerHTML =
    langMap[lang].web.closeButtonLabel;

  if (document.getElementById("initialResultsTableLabel")) {
    document.getElementById("initialResultsTableLabel").innerHTML =
      langMap[lang].web.initialResultsTableLabel;
  }

  // Don't render these if the area hasn't been selected yet
  if (document.getElementById("areaSelect").value) {
    document.getElementById("targetWeatherLabel").innerHTML =
      langMap[lang].web.targetWeatherLabel;
    document.getElementById("precedingWeatherLabel").innerHTML =
      langMap[lang].web.precedingWeatherLabel;
  }
};

/**
 * Adds options to the expansion select dropdown based on the selected language
 * @param {*} lang The language id
 */
const renderExpansionSelect = (lang) => {
  // Reset the element before rendering it
  const selectElement = document.getElementById("expansionSelect");

  while (selectElement.hasChildNodes()) {
    selectElement.removeChild(selectElement.firstChild);
  }

  const selectedExpansion = localStorage.getItem("selectedExpansion")
    ? localStorage.getItem("selectedExpansion")
    : "aRealmReborn"; // Default to aRealmReborn
  let selectedIndex = 0; // For setting the option to display after rendering

  const optgroupElement = document.createElement("optgroup");
  optgroupElement.label = langMap[lang].web.selectAnExpansion;

  let index = 0;
  for (const expansion of Object.keys(langMap[lang].expansion)) {
    // Determine the index to set select target
    if (expansion === selectedExpansion) {
      selectedIndex = index;
    }

    const optionElement = document.createElement("option");

    optionElement.value = expansion;
    optionElement.innerHTML = langMap[lang].expansion[expansion];

    optgroupElement.appendChild(optionElement);
    index++;
  }

  selectElement.appendChild(optgroupElement);
  selectElement.options[selectedIndex].selected = true; // Set the first item as the default selected option
};

/**
 * Adds options to the area select dropdown based on the selected language
 * @param {*} lang The language id
 */
const renderAreaSelect = (lang) => {
  // Reset the element before rendering it
  const selectElement = document.getElementById("areaSelect");

  while (selectElement.hasChildNodes()) {
    selectElement.removeChild(selectElement.firstChild);
  }

  const selectedExpansion = localStorage.getItem("selectedExpansion")
    ? localStorage.getItem("selectedExpansion")
    : "aRealmReborn";
  const selectedArea = localStorage.getItem("selectedArea")
    ? localStorage.getItem("selectedArea")
    : expansionData[selectedExpansion][0];

  let selectedIndex = 0; // For setting the option to display after rendering

  const optgroupElement = document.createElement("optgroup");
  optgroupElement.label = langMap[lang].web.selectAnArea;

  let index = 0;

  for (const area of expansionData[selectedExpansion]) {
    if (area === selectedArea) {
      selectedIndex = index;
    }

    const optionElement = document.createElement("option");

    optionElement.value = area;
    optionElement.innerHTML = langMap[lang].area[area];

    optgroupElement.appendChild(optionElement);
    index++;
  }

  selectElement.appendChild(optgroupElement);
  selectElement.options[selectedIndex].selected = true; // Set the first item as the default selected option
};

/**
 * Looks up the weather patterns associated to an area and renders corresponding checkboxes
 * @param {*} id The id of the weather group
 * @param {*} lang The language id
 * @param {*} area The selected area
 */
const renderWeatherCheckboxes = (id, lang, area) => {
  // Reset the element before rendering it
  const divElement = document.getElementById(id);

  while (divElement.hasChildNodes()) {
    divElement.removeChild(divElement.firstChild);
  }

  // Add the weather options if an area has been selected
  if (area) {
    const seen = {}; // prevent duplicates

    for (const weather of weatherData[area]) {
      const weatherName = weather.name;
      const name = id + weatherName; // Unique identifier for the checkbox

      // Check if the weather has already appeared and skip it
      if (seen[weatherName]) {
        continue;
      } else {
        seen[weatherName] = true;
      }

      // Create the checkbox
      const checkboxContainer = document.createElement("div");
      checkboxContainer.classList.add("form-check", "default-margin-right");
      const checkboxElement = document.createElement("input");
      checkboxElement.type = "checkbox";
      checkboxElement.id = name;
      checkboxElement.name = name;
      checkboxElement.classList.add("form-check-input", id);

      // Grab the weather icon
      const imageElement = document.createElement("img");
      imageElement.src = `./images/${weatherName}.png`;
      imageElement.classList.add("small-margin-right");

      // Create the label
      const labelElement = document.createElement("label");
      labelElement.htmlFor = name;
      labelElement.classList.add("form-checkbox");
      labelElement.appendChild(imageElement);
      labelElement.innerHTML =
        labelElement.innerHTML + langMap[lang].weather[weatherName];

      // Add it to the page
      checkboxContainer.appendChild(checkboxElement);
      checkboxContainer.appendChild(labelElement);
      divElement.appendChild(checkboxContainer);
    }
  }
};

/**
 * Re-renders area dropdown and weather checkboxes after selecting a different area
 * @param {*} event The HTML element of the area select
 */
const onExpansionChangeHandler = (event) => {
  const selectedExpansion = event.value;
  const selectedArea = expansionData[selectedExpansion][0];
  localStorage.setItem("selectedExpansion", selectedExpansion); // Save this so that it will be selected by default on a fresh page load
  localStorage.setItem("selectedArea", selectedArea); // Save this so that it will be selected by default on a fresh page load
  renderAreaSelect(selectedLang);
  renderWeatherCheckboxes("targetWeatherOptions", selectedLang, selectedArea);
  renderWeatherCheckboxes(
    "precedingWeatherOptions",
    selectedLang,
    selectedArea
  );
};

/**
 * Re-renders weather checkboxes after selecting a different area
 * @param {*} event The HTML element of the area select
 */
const onAreaChangeHandler = (event) => {
  localStorage.setItem("selectedArea", event.value); // Save this so that it will be selected by default on a fresh page load
  renderWeatherCheckboxes("targetWeatherOptions", selectedLang, event.value);
  renderWeatherCheckboxes("precedingWeatherOptions", selectedLang, event.value);
};

/**
 * Changes the language of the web page and saves the change to localStorage
 * @param {string} lang The language id
 */
const langChangeHandler = (lang) => {
  if (lang !== selectedLang) {
    localStorage.setItem("selectedLang", lang);
    selectedLang = lang;

    render(lang);
  }
};

/**
 * Changes the colour mode of the web page
 * @param {string} colour Either "light" or "dark"
 */
const colourModeChangeHandler = (colourMode) => {
  const rootElement = document.getElementById("root");
  rootElement.setAttribute("data-bs-theme", colourMode);
  localStorage.setItem("colourMode", colourMode);
};

/**
 * Returns an array of weather strings that have been checked on the page
 * @param {*} collection A group of checkbox elements
 * @param {*} id The weather group
 */
const getWeatherList = (collection, id) => {
  const weatherList = [];
  const uncheckedList = [];

  for (const element of collection) {
    if (element.checked) {
      weatherList.push(element.id.replace(id, ""));
    } else {
      uncheckedList.push(element.id.replace(id, ""));
    }
  }

  return weatherList.length > 0 ? weatherList : uncheckedList;
};

/**
 * Returns an array of time interval start strings that have been checked on the page
 */
const getTargetTimeList = () => {
  const targetTimeList = [];
  const uncheckedList = [];

  document.getElementById("start00").checked
    ? targetTimeList.push("0:00")
    : uncheckedList.push("0:00");
  document.getElementById("start08").checked
    ? targetTimeList.push("8:00")
    : uncheckedList.push("8:00");
  document.getElementById("start16").checked
    ? targetTimeList.push("16:00")
    : uncheckedList.push("16:00");

  return targetTimeList.length > 0 ? targetTimeList : uncheckedList;
};

/**
 * Renders the search results into a table on the page
 * @param {*} results An array of objects with the following structure:
 * {
      previousWeather: string,
      currentWeather: string,
      eorzeaTime: string,
      localTime: Date
    }
 */
const renderResults = (results) => {
  // Reset the element before rendering it
  const resultBody = document.getElementById("resultBody");

  while (resultBody.hasChildNodes()) {
    resultBody.removeChild(resultBody.firstChild);
  }

  if (results.length > 0) {
    for (const entry of results) {
      const tableRow = document.createElement("tr");

      // Area
      const areaCell = document.createElement("td");
      const areaCellContents = document.createElement("div");
      const areaIconElement = document.createElement("img");
      areaIconElement.src = `./images/area_icons/${areaData[entry.area]}.png`;
      areaIconElement.height = 30;
      areaIconElement.width = 30;
      areaIconElement.classList.add(
        "default-margin-right",
        "area-icon-rounded"
      );
      areaCellContents.appendChild(areaIconElement);
      areaCellContents.innerHTML =
        areaCellContents.innerHTML + langMap[selectedLang].area[entry.area];
      areaCellContents.classList.add("d-flex", "flex-wrap");
      areaCell.appendChild(areaCellContents);

      // Previous Weather
      const previousWeatherCell = document.createElement("td");
      const previousWeatherImageElement = document.createElement("img");
      const previousWeatherCellContents = document.createElement("div");
      previousWeatherImageElement.src = `./images/${entry.previousWeather}.png`;
      previousWeatherImageElement.classList.add("small-margin-right");
      previousWeatherCellContents.appendChild(previousWeatherImageElement);
      previousWeatherCellContents.innerHTML =
        previousWeatherCellContents.innerHTML +
        langMap[selectedLang].weather[entry.previousWeather];
      previousWeatherCellContents.classList.add("d-flex", "flex-wrap");
      previousWeatherCell.appendChild(previousWeatherCellContents);

      // Current Weather
      const currentWeatherCell = document.createElement("td");
      const currentWeatherImageElement = document.createElement("img");
      const currentWeatherCellContents = document.createElement("div");
      currentWeatherImageElement.src = `./images/${entry.currentWeather}.png`;
      currentWeatherImageElement.classList.add("small-margin-right");
      currentWeatherCellContents.appendChild(currentWeatherImageElement);
      currentWeatherCellContents.innerHTML =
        currentWeatherCellContents.innerHTML +
        langMap[selectedLang].weather[entry.currentWeather];
      currentWeatherCellContents.classList.add("d-flex", "flex-wrap");
      currentWeatherCell.appendChild(currentWeatherCellContents);

      // Eorzea Time
      const eorzeaTimeCell = document.createElement("td");
      eorzeaTimeCell.innerHTML = entry.eorzeaTime;
      eorzeaTimeCell.classList.add("center-text");

      // Local Time
      const localTimeCell = document.createElement("td");
      localTimeCell.innerHTML = entry.localTime;

      tableRow.appendChild(areaCell);
      tableRow.appendChild(previousWeatherCell);
      tableRow.appendChild(currentWeatherCell);
      tableRow.appendChild(eorzeaTimeCell);
      tableRow.appendChild(localTimeCell);

      resultBody.appendChild(tableRow);
    }
  } else {
    // Put a message in the table if there weren't any entries in the result
    const tableRow = document.createElement("tr");
    const noResultsFound = document.createElement("td");
    noResultsFound.colSpan = 5;
    noResultsFound.classList.add("center-text");
    noResultsFound.innerHTML = langMap[selectedLang].web.noResultsFoundLabel;

    tableRow.appendChild(noResultsFound);
    resultBody.appendChild(tableRow);
  }
};

/**
 * Performs a search for weather patterns that match the conditions set by the user
 * and returns an array containing the results
 */
const findWeather = () => {
  const results = [];

  // Retrieve desired weather conditions
  const savedConditions = getSavedConditions();
  const filteredConditions = savedConditions.filter(
    (condition) => condition.show
  );

  // Generate the weather map for each specified area
  const weatherMap = generateWeatherMap(filteredConditions);

  // Perform the search
  const maximumNumber = document.getElementById("maximumNumber").value;
  const maximumCycles = document.getElementById("maximumCycles").value;
  const startDate = getStartDate();

  for (let i = 0; i < maximumCycles; i++) {
    const timestamp = startDate + i * EORZEA_8_HOUR;
    const windows = iterateConditions(
      filteredConditions,
      timestamp,
      weatherMap
    );

    for (const window of windows) {
      results.push(window);

      if (results.length >= maximumNumber) {
        return results;
      }
    }
  }

  return results;
};

/**
 * Creates an array of strings where the index of each item corresponds to the
 * FFXIV weather value
 */
const generateWeatherMap = (conditions) => {
  const output = {};

  for (const entry of conditions) {
    const data = weatherData[entry.area];
    let result = [];

    for (const weather of data) {
      result = result.concat(Array(weather.chance).fill(weather.name));
    }

    output[entry.area] = result;
  }

  return output;
};

// Checks each condition and area, returning an array of windows
const iterateConditions = (conditions, timestamp, weatherMap) => {
  const results = [];
  const seen = {};

  for (const entry of conditions) {
    // Skip checking this condition if the current window already satisfies
    // another condition with the same area (this prevents duplicate results)
    if (seen[entry.area]) {
      continue;
    }

    const window = {
      currentWeather: weatherMap[entry.area][calculateWeatherValue(timestamp)],
      previousWeather:
        weatherMap[entry.area][
          calculateWeatherValue(timestamp - EORZEA_8_HOUR)
        ],
      eorzeaTime: convertToNearestEorzeanIntervalStart(timestamp),
    };

    if (testWeather(entry, window)) {
      seen[entry.area] = true; // mark this window as already added to results

      results.push({
        area: entry.area,
        previousWeather: window.previousWeather,
        currentWeather: window.currentWeather,
        eorzeaTime: window.eorzeaTime,
        localTime: convertToNearestRealIntervalStart(timestamp),
      });
    }
  }

  return results;
};

/**
 * Checks if the window satisfies the conditions, returning true if all
 * conditions match
 * @param {*} conditions An object with the following structure:
 * {
      targetWeather: string,
      precedingWeather: string,
      targetTime: string
    }
    @param {*} window An object with the following structure:
 * {
      currentWeather: string,
      previousWeather: string,
      eorzeaTime: string
    }
 *  */
const testWeather = (conditions, window) => {
  return (
    conditions.targetWeather.includes(window.currentWeather) &&
    conditions.precedingWeather.includes(window.previousWeather) &&
    conditions.targetTime.includes(window.eorzeaTime)
  );
};

/**
 * Handler for the find weather button
 */
const findWeatherOnClickHandler = () => {
  searchResults = findWeather();
  renderResults(searchResults);
};

/**
 * Adds the conditions as entered in the forms to the list of conditions
 */
const addWeatherConditions = () => {
  let savedConditions = JSON.parse(localStorage.getItem("savedConditions"));

  if (!savedConditions) {
    savedConditions = [];
  }

  const conditions = {
    show: true,
    area: document.getElementById("areaSelect").value,
    targetWeather: getWeatherList(
      document.getElementsByClassName("targetWeatherOptions"),
      "targetWeatherOptions"
    ),
    precedingWeather: getWeatherList(
      document.getElementsByClassName("precedingWeatherOptions"),
      "precedingWeatherOptions"
    ),
    targetTime: getTargetTimeList(),
  };

  savedConditions.push(conditions);

  localStorage.setItem("savedConditions", JSON.stringify(savedConditions));

  renderConditions(savedConditions);
};

/**
 * Renders the desired weather conditions into a table on the page
 * @param {*} conditions An array of objects with the following structure:
 * {
      area: string,
      targetWeather: array,
      precedingWeather: array,
      targetTime: array
    }
 */
const renderConditions = (conditions) => {
  // Reset the element before rendering it
  const conditionsListBody = document.getElementById("conditionsListBody");

  while (conditionsListBody.hasChildNodes()) {
    conditionsListBody.removeChild(conditionsListBody.firstChild);
  }

  if (conditions.length > 0) {
    for (const [index, entry] of conditions.entries()) {
      const tableRow = document.createElement("tr");

      // Show/Hide Button
      const showCell = document.createElement("td");
      const showContainer = document.createElement("div");
      showContainer.classList.add("container");

      if (entry.show) {
        showContainer.appendChild(renderEyeIcon());
      } else {
        showContainer.appendChild(renderEyeSlashIcon());
      }

      showContainer.onclick = () => {
        conditions[index].show = !conditions[index].show;
        localStorage.setItem("savedConditions", JSON.stringify(conditions));
        renderConditions(conditions); // re-render component
      };
      showCell.appendChild(showContainer);

      // Area
      const areaCell = document.createElement("td");
      const areaCellContents = document.createElement("div");
      const areaIconElement = document.createElement("img");
      areaIconElement.src = `./images/area_icons/${areaData[entry.area]}.png`;
      areaIconElement.height = 30;
      areaIconElement.width = 30;
      areaIconElement.classList.add(
        "default-margin-right",
        "area-icon-rounded"
      );
      areaCellContents.appendChild(areaIconElement);
      areaCellContents.innerHTML =
        areaCellContents.innerHTML + langMap[selectedLang].area[entry.area];
      areaCellContents.classList.add("d-flex", "flex-wrap");
      areaCell.appendChild(areaCellContents);

      // Preceding Weather
      const precedingWeatherCell = document.createElement("td");
      precedingWeatherCell.classList.add("center-text");

      for (const weather of entry.precedingWeather) {
        const precedingWeatherImageElement = document.createElement("img");
        precedingWeatherImageElement.src = `./images/${weather}.png`;
        precedingWeatherImageElement.classList.add("small-margin-right");
        precedingWeatherImageElement.setAttribute(
          "title",
          langMap[selectedLang].weather[weather]
        );
        precedingWeatherCell.appendChild(precedingWeatherImageElement);
      }

      // Target Weather
      const targetWeatherCell = document.createElement("td");
      targetWeatherCell.classList.add("center-text");

      for (const weather of entry.targetWeather) {
        const targetWeatherImageElement = document.createElement("img");
        targetWeatherImageElement.src = `./images/${weather}.png`;
        targetWeatherImageElement.classList.add("small-margin-right");
        targetWeatherImageElement.setAttribute(
          "title",
          langMap[selectedLang].weather[weather]
        );
        targetWeatherCell.appendChild(targetWeatherImageElement);
      }

      // Eorzea Time
      const eorzeaTimeCell = document.createElement("td");
      const eorzeaTimeLabel = document.createElement("label");
      eorzeaTimeCell.classList.add("center-text");
      eorzeaTimeLabel.innerHTML = entry.targetTime.join(", ");
      eorzeaTimeCell.appendChild(eorzeaTimeLabel);

      // Delete Button
      const deleteCell = document.createElement("td");
      const deleteContainer = document.createElement("div");
      deleteContainer.classList.add("container");
      deleteContainer.appendChild(renderDeleteIcon());
      deleteContainer.onclick = () => {
        conditions.splice(index, 1);
        localStorage.setItem("savedConditions", JSON.stringify(conditions));
        renderConditions(conditions); // re-render component
      };
      deleteCell.appendChild(deleteContainer);

      // Add the elements to the table
      tableRow.appendChild(showCell);
      tableRow.appendChild(areaCell);
      tableRow.appendChild(precedingWeatherCell);
      tableRow.appendChild(targetWeatherCell);
      tableRow.appendChild(eorzeaTimeCell);
      tableRow.appendChild(deleteCell);

      conditionsListBody.appendChild(tableRow);
    }
  } else {
    // Put a message in the table to inform the user that one or more conditions should be added
    const tableRow = document.createElement("tr");
    const noConditionsMessage = document.createElement("td");
    const noConditionsMessageLabel = document.createElement("label");
    noConditionsMessage.colSpan = 6;
    noConditionsMessage.classList.add("center-text");
    noConditionsMessageLabel.innerHTML =
      langMap[selectedLang].web.noConditionsMessage;
    noConditionsMessage.appendChild(noConditionsMessageLabel);

    tableRow.appendChild(noConditionsMessage);
    conditionsListBody.appendChild(tableRow);
  }
};

/**
 * Renders an SVG icon
 * @param {*} data An object with the following structure:
 * {
      width: string,
      height: string,
      fill: string,
      viewBox: string,
      classList: array of string
      paths: array of string
    }
 */
const renderSvgIcon = (data) => {
  const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  iconSvg.setAttribute("width", data.width);
  iconSvg.setAttribute("height", data.height);
  iconSvg.setAttribute("fill", data.fill);
  iconSvg.setAttribute("viewBox", data.viewBox);

  for (const className of data.classList) {
    iconSvg.classList.add(className);
  }

  for (const path of data.paths) {
    const iconPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    iconPath.setAttribute("d", path);

    iconSvg.appendChild(iconPath);
  }

  return iconSvg;
};

/**
 * Renders the SVG icon for the delete button
 */
const renderDeleteIcon = () => {
  return renderSvgIcon({
    width: "16",
    height: "16",
    fill: "currentColor",
    viewBox: "0 0 16 16",
    classList: ["bi", "bi-x-lg"],
    paths: [
      "M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z",
    ],
  });
};

/**
 * Renders the SVG icon for an eye to depict visibility
 */
const renderEyeIcon = () => {
  return renderSvgIcon({
    width: "16",
    height: "16",
    fill: "currentColor",
    viewBox: "0 0 16 16",
    classList: ["bi", "bi-eye"],
    paths: [
      "M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z",
      "M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z",
    ],
  });
};

/**
 * Renders the SVG icon for a slashed eye to depict non-visibility
 */
const renderEyeSlashIcon = () => {
  return renderSvgIcon({
    width: "16",
    height: "16",
    fill: "currentColor",
    viewBox: "0 0 16 16",
    classList: ["bi", "bi-eye-slash"],
    paths: [
      "M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z",
      "M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z",
      "M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z",
    ],
  });
};

/**
 * Returns the unix timestamp of the current time, or on a specified date at
 * 00:00 in the user's local timezone.
 *  */
const getStartDate = () => {
  const isCustomStartDateEnabled = document.getElementById(
    "customStartDateCheckbox"
  ).checked;
  const customStartDateInput = document.getElementById("customStartDate");
  const customStartDateString = customStartDateInput.value;

  if (isCustomStartDateEnabled && customStartDateString) {
    const customStartDate = new Date(customStartDateString);
    const timestamp =
      customStartDate.getTime() +
      customStartDate.getTimezoneOffset() * 60 * 1000;

    return timestamp;
  } else {
    return Date.now();
  }
};

/**
 * For debugging at the start of an expansion.
 */
const printNextFourWeatherValues = () => {
  console.log(calculateWeatherValue(Date.now()));
  console.log(calculateWeatherValue(Date.now() + EORZEA_8_HOUR));
  console.log(calculateWeatherValue(Date.now() + EORZEA_8_HOUR * 2));
  console.log(calculateWeatherValue(Date.now() + EORZEA_8_HOUR * 3));
};

render(selectedLang);

// Attach handlers to inputs
const maximumNumberInput = document.getElementById("maximumNumber");
maximumNumberInput.onchange = (event) => {
  localStorage.setItem("maximumNumber", event.target.value);
};

const maximumCyclesInput = document.getElementById("maximumCycles");
maximumCyclesInput.onchange = (event) => {
  localStorage.setItem("maximumCycles", event.target.value);
};

// See you in 8.0!
// printNextFourWeatherValues();
