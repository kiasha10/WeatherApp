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

  export interface GeocodeResponse {
    results: {
      id: number;
      name: string;
      latitude: number;
      longitude: number;
      elevation: number;
      feature_code: string;
      country_code: string;
      admin1_id: number;
      admin2_id: number;
      admin3_id: number;
      admin4_id: number;
      timezone: string;
      population: number;
      postcodes: string[];
      country_id: number;
      country: string;
      admin1: string;
      admin2: string;
      admin3: string;
      admin4: string;
    }[];
    generationtime_ms: number;
  }