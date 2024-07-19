import L from "leaflet";
import { fetchAreaWeather } from "./api";
import { displayAreas, displayWeatherStats } from "./dom-manipulation";
import { Area } from "./types";

export function map() {
  const appDiv = document.querySelector<HTMLDivElement>("#app");
  const launchDiv = document.querySelector<HTMLDivElement>("#app > div");
  launchDiv?.remove();

  const mainMapDiv = document.createElement("div");
  mainMapDiv.className = "h-screen w-screen flex flex-col";

  const headerDiv = document.createElement("div");
  headerDiv.className = "flex items-center p-5 ";

  const backButtonDiv = document.createElement("div");
  backButtonDiv.className = "ml-2";

  const backButton = document.createElement("div");
  backButton.className = "flex justify-center";
  backButton.innerHTML = `
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 576 512"
          height="30px"
          width="30px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M401.4 224h-214l83-79.4c11.9-12.5 11.9-32.7 0-45.2s-31.2-12.5-43.2 0L89 233.4c-6 5.8-9 13.7-9 22.4v.4c0 8.7 3 16.6 9 22.4l138.1 134c12 12.5 31.3 12.5 43.2 0 11.9-12.5 11.9-32.7 0-45.2l-83-79.4h214c16.9 0 30.6-14.3 30.6-32 .1-18-13.6-32-30.5-32z"></path>
        </svg>`;
  backButton.addEventListener("click", () => {
    displayAreas();
  });
  backButtonDiv.append(backButton);

  const heading = document.createElement("h1");
  heading.className = "text-3xl font-bold mb-2 ml-2";
  heading.innerText = "Map";

  headerDiv.append(backButtonDiv);
  headerDiv.append(heading);

  mainMapDiv.append(headerDiv);

  const mapDiv = document.createElement("div");
  mapDiv.id = "mapid";
  mapDiv.className = "flex-grow rounded-lg shadow-lg m-5";
  mainMapDiv.appendChild(mapDiv);

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
    let viewed: Area[] = JSON.parse(sessionStorage.getItem("viewed") || "[]");
    viewed.unshift(area);
    sessionStorage.setItem("viewed", JSON.stringify(viewed));

    if (area) {
      const weatherData = await fetchAreaWeather(area);
      displayWeatherStats(area, weatherData);
    }
  });
}
