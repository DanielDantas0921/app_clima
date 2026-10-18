import type {
  CombinedWeatherData,
  ForecastCurrent,
  ForecastUnits,
  GeocodingApiResponse,
  GeocodingResult,
  WeatherApiResponse,
  WeatherResult,
} from '../types/weather';

const requiredForecastFields: Array<keyof ForecastCurrent> = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'wind_speed_10m',
  'wind_direction_10m',
  'precipitation_probability',
];

const requiredForecastUnits: Array<keyof ForecastUnits> = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'wind_speed_10m',
  'wind_direction_10m',
  'precipitation_probability',
  'precipitation',
  'weather_code',
];

function hasValidNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function hasValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isForecastCurrent(value: unknown): value is ForecastCurrent {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return requiredForecastFields.every((field) => hasValidNumber(record[field]));
}

function isForecastUnits(value: unknown): value is ForecastUnits {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return requiredForecastUnits.every((field) => {
    const unitValue = record[field];

    return typeof unitValue === 'string' && (field === 'is_day' || unitValue !== '');
  });
}

export async function searchCity(cityName: string): Promise<GeocodingResult | null> {
  const query = cityName.trim();

  if (!hasValidString(query)) {
    return null;
  }

  try {
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
    url.searchParams.set('name', query);
    url.searchParams.set('count', '1');
    url.searchParams.set('language', 'pt');
    url.searchParams.set('format', 'json');

    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as GeocodingApiResponse;
    const firstResult = data.results?.[0];

    if (!firstResult) {
      return null;
    }

    const latitude = firstResult.latitude;
    const longitude = firstResult.longitude;
    const name = firstResult.name;
    const countryCode = firstResult.country_code;
    const timezone = firstResult.timezone;

    if (
      !hasValidString(name) ||
      !hasValidNumber(latitude) ||
      !hasValidNumber(longitude) ||
      !hasValidString(countryCode) ||
      !hasValidString(timezone)
    ) {
      return null;
    }

    return {
      name,
      latitude,
      longitude,
      country_code: countryCode,
      timezone,
    };
  } catch {
    return null;
  }
}

export async function getWeather(
  latitude: number,
  longitude: number,
  timezone: string,
): Promise<WeatherResult | null> {
  if (!hasValidNumber(latitude) || !hasValidNumber(longitude) || !hasValidString(timezone)) {
    return null;
  }

  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', String(latitude));
    url.searchParams.set('longitude', String(longitude));
    url.searchParams.set(
      'current',
      [
        'precipitation_probability',
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'wind_speed_10m',
        'wind_direction_10m',
        'precipitation',
        'weather_code',
      ].join(','),
    );
    url.searchParams.set('timezone', timezone.trim());

    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as WeatherApiResponse;

    if (!isForecastCurrent(data.current) || !isForecastUnits(data.current_units)) {
      return null;
    }

    return {
      current: data.current,
      current_units: data.current_units,
    };
  } catch {
    return null;
  }
}

export async function searchWeather(cityName: string): Promise<CombinedWeatherData | null> {
  const city = await searchCity(cityName);

  if (!city) {
    return null;
  }

  const weather = await getWeather(city.latitude, city.longitude, city.timezone);

  if (!weather) {
    return null;
  }

  return {
    city,
    current: weather.current,
    current_units: weather.current_units,
  };
}
