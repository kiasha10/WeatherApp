import { GeocodeResponse } from "./types.ts";
import { Area, CurrentWeatherResponse, DailyWeatherResponse } from "./types";


export async function fetchAreaWeather(area: Area): Promise<CurrentWeatherResponse> {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${area.latitude}&longitude=${area.longitude}&current=temperature_2m,weather_code&timezone=GMT&past_days=1`
  );
  const weatherDetails: CurrentWeatherResponse = await response.json();

  return weatherDetails;
}

export async function fetchArea7DayForecast(
    area: Area
  ): Promise<DailyWeatherResponse> {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${area.latitude}&longitude=${area.longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code`
    );
    const weatherData: DailyWeatherResponse = await response.json();
    
  
    return weatherData;
}

export async function geocodeArea(areaName: string): Promise<GeocodeResponse> {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${areaName}`
  );
  const geocodeData: GeocodeResponse = await response.json();
  return geocodeData;
}