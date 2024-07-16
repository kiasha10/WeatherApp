import { Area, CurrentWeatherResponse } from "./api.ts";
import { areas, fetchArea7DayForecast, fetchAreaWeather } from "./api";
import { WEATHER_SYMBOLS, WeatherCodes } from "./constants";
import L from "leaflet";

export async function displayAreas() {
  const removeDiv = document.querySelector("#app > div");
  removeDiv?.remove();
  const appDiv = document.querySelector<HTMLDivElement>("#app");

  const launchDiv = document.createElement("div");
  launchDiv.id = "launch";
  launchDiv.className = "flex flex-col items-center py-4";

  const outerDiv = document.createElement("div");
  outerDiv.className = "w-full max-w-md px-4";

  const heading = document.createElement("h1");
  heading.className = "text-3xl font-bold mb-4";

  heading.innerText = "Weather";
  outerDiv.append(heading);

  for (const area of areas) {
    const areaData = await fetchAreaWeather(area);

    const areaOuter = document.createElement("div");
    areaOuter.className = "bg-gray-800 bg-opacity-60 rounded-lg p-4 mb-4";

    const areaContent = document.createElement("div");
    areaContent.className = "flex justify-between items-center gap-4";

    const areaName = document.createElement("div");
    areaName.className = "text-xl font-semibold";

    const areaTemperature = document.createElement("div");
    areaTemperature.className = "text-4xl font-bold";

    const areaCondition = document.createElement("div");
    areaCondition.className = "text-gray-400";

    areaName.innerText = area.name;

    areaTemperature.innerText = `${areaData.current.temperature_2m.toFixed(
      0
    )}°`;

    areaCondition.innerText = WeatherCodes[areaData.current.weather_code];

    const areaContentInnerDiv = document.createElement("div");
    areaContentInnerDiv.className = "flex justify-start gap-1 items-center";

    const weatherIconDiv = document.createElement("div");
    weatherIconDiv.className = "items-center";
    weatherIconDiv.innerHTML = `
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 24 24"
          height="40px"
          width="40px"
          xmlns="http://www.w3.org/2000/svg"
        >
          
           ${WEATHER_SYMBOLS[areaData.current.weather_code]}
        </svg>`;

    areaContent.append(areaName);
    areaContentInnerDiv.append(weatherIconDiv);
    areaContentInnerDiv.append(areaTemperature);
    areaContent.append(areaContentInnerDiv);

    areaOuter.append(areaContent);
    areaOuter.append(areaCondition);

    areaOuter.addEventListener("click", () =>
      displayWeatherStats(area, areaData)
    );
    outerDiv.append(areaOuter);
  }

  const buttonDiv = document.createElement("div");
  buttonDiv.className = "flex justify-end w-10/12";

  const mapButton = document.createElement("div");
  mapButton.className =
    "flex justify-center bg-gray-800 bg-opacity-60 p-3 rounded-full item-center";
  mapButton.innerHTML = `
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 288 512"
        height="20px"
        width="20px"
        xmlns="http://www.w3.org/2000/svg"
      >
      <path d="M112 316.94v156.69l22.02 33.02c4.75 7.12 15.22 7.12 19.97 0L176 473.63V316.94c-10.39 1.92-21.06 3.06-32 3.06s-21.61-1.14-32-3.06zM144 0C64.47 0 0 64.47 0 144s64.47 144 144 144 144-64.47 144-144S223.53 0 144 0zm0 76c-37.5 0-68 30.5-68 68 0 6.62-5.38 12-12 12s-12-5.38-12-12c0-50.73 41.28-92 92-92 6.62 0 12 5.38 12 12s-5.38 12-12 12z"></path>
       </svg>`;
  mapButton.addEventListener("click", () => {
    map();
  });
  buttonDiv.append(mapButton);

  launchDiv?.append(outerDiv);
  launchDiv?.append(buttonDiv);
  appDiv?.append(launchDiv);
}

export async function displayWeatherStats(
  area: Area,
  areaData: CurrentWeatherResponse
) {
  const launchDiv = document.querySelector("#app > div");
  launchDiv?.remove();

  const appDiv = document.querySelector<HTMLDivElement>("#app");

  if (!appDiv) {
    console.error("App div not found");
    return;
  }

  const mainContainer = document.createElement("div");
  mainContainer.className = "max-w-sm w-full mx-auto p-5";

  const backButtonDiv = document.createElement("div");
  backButtonDiv.className = "flex justify-start w-0.75";

  const backButton = document.createElement("div");
  backButton.className = "flex justify-center";
  backButton.innerHTML = `
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 576 512"
        height="50px"
        width="50px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M401.4 224h-214l83-79.4c11.9-12.5 11.9-32.7 0-45.2s-31.2-12.5-43.2 0L89 233.4c-6 5.8-9 13.7-9 22.4v.4c0 8.7 3 16.6 9 22.4l138.1 134c12 12.5 31.3 12.5 43.2 0 11.9-12.5 11.9-32.7 0-45.2l-83-79.4h214c16.9 0 30.6-14.3 30.6-32 .1-18-13.6-32-30.5-32z"></path>
      </svg>`;
  backButton.addEventListener("click", () => {
    displayAreas();
  });
  backButtonDiv.append(backButton);

  mainContainer.append(backButtonDiv);
  const areaDetailsContainer = document.createElement("div");
  areaDetailsContainer.className = "text-center mb-6";

  const areaNameHeading = document.createElement("h1");
  areaNameHeading.className = "text-4xl font-semibold";
  areaNameHeading.innerText = `${area.name}`;
  areaDetailsContainer.appendChild(areaNameHeading);

  const currentTemperature = document.createElement("p");
  currentTemperature.className = "text-6xl font-light";
  areaDetailsContainer.appendChild(currentTemperature);

  const currentCondition = document.createElement("p");
  currentCondition.className = "text-2xl";
  areaDetailsContainer.appendChild(currentCondition);

  const temperatureRange = document.createElement("p");
  temperatureRange.className = "text-lg";
  areaDetailsContainer.appendChild(temperatureRange);

  const forecastDiv = document.createElement("div");
  forecastDiv.className = "bg-gray-800 bg-opacity-60 rounded-lg p-4 mb-6 mt-10";

  const forecastHeading = document.createElement("h2");
  forecastHeading.className = "text-xl font-semibold mb-4";
  forecastHeading.innerText = "10-DAY FORECAST";
  forecastDiv.appendChild(forecastHeading);

  const forecastList = document.createElement("div");
  forecastList.className = "space-y-4";
  forecastDiv.appendChild(forecastList);

  const areaWeatherData = await fetchArea7DayForecast(area);
  console.log(areaWeatherData);

  currentTemperature.innerText = `${areaData.current.temperature_2m.toFixed(
    0
  )}°`;
  currentCondition.innerText = WeatherCodes[areaData.current.weather_code];
  temperatureRange.innerText = `H:${areaWeatherData.daily.temperature_2m_max[0]}° L:${areaWeatherData.daily.temperature_2m_min[0]}°`;

  areaWeatherData.daily.time.forEach((date: string, index: number) => {
    const forecastItem = document.createElement("div");
    forecastItem.className = "flex justify-between items-center";

    const dayName = document.createElement("span");
    dayName.innerText = date;
    forecastItem.appendChild(dayName);

    const weatherIcon = document.createElement("svg");
    weatherIcon.className = "w-5 h-5 text-yellow-500";
    weatherIcon.setAttribute("stroke", "currentColor");
    weatherIcon.setAttribute("fill", "currentColor");
    weatherIcon.setAttribute("stroke-width", "0");
    weatherIcon.setAttribute("viewBox", "0 0 512 512");
    weatherIcon.innerHTML = `<path d="${areaWeatherData.daily.weather_code[index]}"></path>`;
    forecastItem.appendChild(weatherIcon);

    const temperatureRange = document.createElement("div");
    temperatureRange.className = "flex items-center space-x-2";

    const minTemp = document.createElement("span");
    minTemp.innerText = `${areaWeatherData.daily.temperature_2m_min[index]}°`;
    temperatureRange.appendChild(minTemp);

    const temperatureBar = document.createElement("div");
    temperatureBar.className =
      "w-24 h-2 bg-gray-200 rounded-full overflow-hidden";
    const temperatureFill = document.createElement("div");
    temperatureFill.className = "h-full bg-blue-400";
    temperatureFill.style.width = `${index * 10}%`;
    temperatureBar.appendChild(temperatureFill);
    temperatureRange.appendChild(temperatureBar);

    const maxTemp = document.createElement("span");
    maxTemp.innerText = `${areaWeatherData.daily.temperature_2m_max[index]}°`;
    temperatureRange.appendChild(maxTemp);

    forecastItem.appendChild(temperatureRange);
    forecastList.appendChild(forecastItem);
  });

  mainContainer.appendChild(areaDetailsContainer);
  mainContainer.appendChild(forecastDiv);
  appDiv.appendChild(mainContainer);
}

export function map() {
  const appDiv = document.querySelector<HTMLDivElement>("#app");
  const launchDiv = document.querySelector<HTMLDivElement>("#app > div");
  launchDiv?.remove();

  const mainMapDiv = document.createElement("div");

  const heading = document.createElement("h1");
  heading.className = "text-3xl font-bold mb-4 p-5";
  heading.innerText = "Map";
  mainMapDiv?.append(heading);

  const mapDiv = document.createElement("div");
  mapDiv.id = "mapid";
  mapDiv.style.height = "600px";
  mainMapDiv?.appendChild(mapDiv);
  const backButtonDiv = document.createElement("div");
  backButtonDiv.className = "flex justify-start w-0.75";

  const backButton = document.createElement("div");
  backButton.className = "flex justify-center";
  backButton.innerHTML = `
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 576 512"
        height="50px"
        width="50px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M401.4 224h-214l83-79.4c11.9-12.5 11.9-32.7 0-45.2s-31.2-12.5-43.2 0L89 233.4c-6 5.8-9 13.7-9 22.4v.4c0 8.7 3 16.6 9 22.4l138.1 134c12 12.5 31.3 12.5 43.2 0 11.9-12.5 11.9-32.7 0-45.2l-83-79.4h214c16.9 0 30.6-14.3 30.6-32 .1-18-13.6-32-30.5-32z"></path>
      </svg>`;
  backButton.addEventListener("click", () => {
    displayAreas();
  });
  backButtonDiv.append(backButton);

  mainMapDiv.append(backButtonDiv);

  appDiv?.append(mainMapDiv);

  const map = L.map("mapid").setView([-26.2, 28.03], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  map.on("click", async (e) => {
    const { lat, lng } = e.latlng;
    const area: Area = {
      name: `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`,
      latitude: lat,
      longitude: lng,
    };
    if (area) {
      const weatherData = await fetchAreaWeather(area);
      displayWeatherStats(area, weatherData);
    }
  });
}