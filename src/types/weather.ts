export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  timezone: string;
}

export interface GeocodingApiResponse {
  results?: Array<{
    name?: string;
    latitude?: number;
    longitude?: number;
    country_code?: string;
    timezone?: string;
  }>;
}

export interface ForecastCurrent {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  precipitation_probability: number;
  precipitation: number;
  weather_code: number;
}

export interface ForecastUnits {
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  is_day: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
  precipitation_probability: string;
  precipitation: string;
  weather_code: string;
}

export interface WeatherResult {
  current: ForecastCurrent;
  current_units: ForecastUnits;
}

export interface WeatherApiResponse {
  current?: Partial<ForecastCurrent>;
  current_units?: Partial<ForecastUnits>;
}

export interface CombinedWeatherData {
  city: GeocodingResult;
  current: ForecastCurrent;
  current_units: ForecastUnits;
}
