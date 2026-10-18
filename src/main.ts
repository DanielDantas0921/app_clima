import './style.css';
import sunIcon from './assets/sun.svg';
import moonIcon from './assets/moon.svg';
import { searchWeather } from './services/openMeteo.ts';
import type { CombinedWeatherData } from './types/weather';
import { getWeatherCodeDescription } from './utils/weatherCode.ts';
import { getWindDirection } from './utils/windDirection.ts';

type AppState = 'empty' | 'loading' | 'result';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root not found');
}

app.innerHTML = `
  <div class="weather-page">
    <form class="search-form" aria-label="Busca de cidade">
      <label class="sr-only" for="city-input">Digite o nome da cidade</label>
      <input
        id="city-input"
        type="text"
        name="city"
        placeholder="Digite o nome da cidade"
        autocomplete="off"
      />
      <button type="submit">Buscar</button>
    </form>

    <section class="weather-card is-empty" aria-live="polite">
      <aside class="weather-sidebar" aria-label="Dados principais do clima"></aside>
      <main class="weather-main" aria-label="Métricas do clima"></main>
    </section>
  </div>
`;

const cityInput = document.querySelector<HTMLInputElement>('#city-input');
const searchForm = document.querySelector<HTMLFormElement>('.search-form');
const weatherCard = document.querySelector<HTMLElement>('.weather-card');
const weatherSidebar = document.querySelector<HTMLElement>('.weather-sidebar');
const weatherMain = document.querySelector<HTMLElement>('.weather-main');

if (!cityInput || !searchForm || !weatherCard || !weatherSidebar || !weatherMain) {
  throw new Error('Weather app elements not found');
}

const buildDateLabel = (timezone: string): string => {
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: timezone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return formatter.format(new Date()).replace(/(^\w)/, (firstLetter) => firstLetter.toUpperCase());
};

const renderEmptyState = (): void => {
  weatherCard.className = 'weather-card is-empty';
  cityInput.disabled = false;
  const submitButton = searchForm.querySelector<HTMLButtonElement>('button');

  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = 'Buscar';
  }

  weatherSidebar.innerHTML = `
    <div class="empty-state-message">
      <p>Pesquise uma cidade para ver o clima</p>
    </div>
    <div class="sidebar-placeholder">
      <div class="placeholder-line placeholder-line--big"></div>
      <div class="placeholder-line placeholder-line--medium"></div>
      <div class="placeholder-line placeholder-line--short"></div>
      <div class="placeholder-line placeholder-line--small"></div>
    </div>
  `;

  weatherMain.innerHTML = `
    <div class="main-placeholder">
      <div class="placeholder-line placeholder-line--medium"></div>
      <div class="placeholder-line placeholder-line--short"></div>
      <div class="placeholder-line placeholder-line--medium"></div>
      <div class="placeholder-line placeholder-line--short"></div>
    </div>
  `;
};

const renderLoadingState = (): void => {
  weatherCard.className = 'weather-card is-loading';
  cityInput.disabled = true;
  const submitButton = searchForm.querySelector<HTMLButtonElement>('button');

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Buscando...';
  }

  weatherSidebar.innerHTML = `
    <div class="loading-state" role="status" aria-live="polite">
      <span class="spinner" aria-hidden="true"></span>
      <span>Carregando clima...</span>
    </div>
  `;

  weatherMain.innerHTML = `
    <div class="loading-state loading-state--main" role="status" aria-live="polite">
      <span class="spinner" aria-hidden="true"></span>
      <span>Buscando dados meteorológicos...</span>
    </div>
  `;
};

const renderResultState = (data: CombinedWeatherData): void => {
  weatherCard.className = 'weather-card is-result';
  cityInput.disabled = false;
  const submitButton = searchForm.querySelector<HTMLButtonElement>('button');

  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = 'Buscar';
  }

  const current = data.current;
  const units = data.current_units;
  const cityLabel = `${data.city.name}, ${data.city.country_code.toUpperCase()}`;
  const currentLabel = current.is_day === 1 ? 'Dia' : 'Noite';
  const weatherDescription = getWeatherCodeDescription(current.weather_code);
  const windDirection = getWindDirection(current.wind_direction_10m);
  const dateLabel = buildDateLabel(data.city.timezone);
  const iconSource = current.is_day === 1 ? sunIcon : moonIcon;

  weatherSidebar.innerHTML = `
    <div class="weather-sidebar-content">
      <div class="temperature-block">
        <p class="temperature-value">${current.temperature_2m}${units.temperature_2m}</p>
      </div>

      <div class="city-block">
        <p class="city-name">${cityLabel}</p>
      </div>

      <div class="date-block">
        <p class="date-value">${dateLabel}</p>
      </div>

      <div class="day-condition">
        <div class="condition-icon-wrap">
          <img
            src="${iconSource}"
            alt="${currentLabel}"
            class="condition-icon ${current.is_day === 1 ? 'condition-icon-sun' : 'condition-icon-moon'}"
          />
        </div>
        <span class="day-text">${currentLabel}</span>
      </div>

      <div class="condition-text">
        <p>${weatherDescription}</p>
      </div>
    </div>
  `;

  weatherMain.innerHTML = `
    <div class="weather-main-content">
      <div class="metric-list">
        <div class="metric-item">
          <span class="metric-label">Umidade</span>
          <span class="metric-value">${current.relative_humidity_2m}${units.relative_humidity_2m}</span>
        </div>

        <div class="metric-item">
          <span class="metric-label">Sensação térmica</span>
          <span class="metric-value">${current.apparent_temperature}${units.apparent_temperature}</span>
        </div>

        <div class="metric-item">
          <span class="metric-label">Precipitação</span>
          <span class="metric-value">${current.precipitation_probability}${units.precipitation_probability}</span>
        </div>

        <div class="metric-item">
          <span class="metric-label">Vento</span>
          <span class="metric-value">${current.wind_speed_10m}${units.wind_speed_10m} · ${current.wind_direction_10m}° (${windDirection})</span>
        </div>
      </div>
    </div>
  `;
};

const setState = (state: AppState, result?: CombinedWeatherData): void => {
  if (state === 'empty') {
    renderEmptyState();
    return;
  }

  if (state === 'loading') {
    renderLoadingState();
    return;
  }

  if (!result) {
    renderEmptyState();
    return;
  }

  renderResultState(result);
};

const handleSearch = async (event: SubmitEvent): Promise<void> => {
  event.preventDefault();

  const cityName = cityInput.value.trim();

  if (!cityName) {
    cityInput.value = '';
    setState('empty');
    return;
  }

  cityInput.value = cityName;
  setState('loading');

  try {
    const result = await searchWeather(cityName);

    if (!result) {
      setState('empty');
      return;
    }

    setState('result', result);
  } catch {
    setState('empty');
  }
};

searchForm.addEventListener('submit', handleSearch);
setState('empty');
