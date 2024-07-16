
export interface CurrentWeatherResponse {
  forecast: any;
  longitude: number;
  latitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    weather_code: string;
    cloud_cover: string;
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    weather_code: number;
    cloud_cover: number;
  };
}

export interface DailyWeatherResponse {
    current: any;
    longitude: number;
    latitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    current_units: {
      time: string;
      interval: string;
      temperature_2m: string;
      weather_code: string;
      cloud_cover: string;
    };
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        weather_code: number[];
    }
}

export interface Area {
  name: string;
  longitude: number;
  latitude: number;
}

export const areas: Area[] = [
  { name: "Johannesburg", longitude: 28.0436, latitude: -26.2023 },
  { name: "Pretoria", longitude: 28.1878, latitude: -25.7449 },
  { name: "Cape Town", longitude: 18.4232, latitude: -33.9258 },
  { name: "Margate", longitude: 30.3705, latitude: -30.8636 },
];

export async function fetchAreaWeather(area: Area): Promise<CurrentWeatherResponse> {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${area.latitude}&longitude=${area.longitude}&current=temperature_2m,weather_code&timezone=GMT&past_days=1`
  );
  const weatherDetails: CurrentWeatherResponse = await response.json();

  console.log(
    `The current temperature in ${area.name} is ${weatherDetails.current.temperature_2m}°C`
  );
  return weatherDetails;
}

export async function fetchArea7DayForecast(
    area: Area
  ): Promise<DailyWeatherResponse> {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${area.latitude}&longitude=${area.longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code`
    );
    const weatherData: DailyWeatherResponse = await response.json();
  
    console.log(`Your 7-Day Forecast for ${area.name} is:`);
    weatherData.daily.time.forEach((date, index) => {
      console.log(
        `Day: ${date}, Min Temp: ${weatherData.daily.temperature_2m_min[index]}°C, Max Temp: ${weatherData.daily.temperature_2m_max[index]}°C, Weather Code: ${weatherData.daily.weather_code[index]}`
      );
    });
  
    return weatherData;
}