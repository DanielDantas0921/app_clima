import './style.css';
import { searchWeather } from './services/openMeteo.ts';

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

const renderEmptyState = (): void => {
  weatherCard.className = 'weather-card is-empty';
  cityInput.disabled = false;
  searchForm.querySelector<HTMLButtonElement>('button')!.disabled = false;
  searchForm.querySelector<HTMLButtonElement>('button')!.textContent = 'Buscar';

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

const renderResultState = (): void => {
  weatherCard.className = 'weather-card is-result';
  cityInput.disabled = false;
  const submitButton = searchForm.querySelector<HTMLButtonElement>('button');

  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = 'Buscar';
  }

  weatherSidebar.innerHTML = `
    <div class="result-placeholder">
      <div class="placeholder-line placeholder-line--big"></div>
      <div class="placeholder-line placeholder-line--medium"></div>
      <div class="placeholder-line placeholder-line--short"></div>
      <div class="placeholder-line placeholder-line--small"></div>
    </div>
  `;

  weatherMain.innerHTML = `
    <div class="result-placeholder">
      <div class="placeholder-line placeholder-line--medium"></div>
      <div class="placeholder-line placeholder-line--short"></div>
      <div class="placeholder-line placeholder-line--medium"></div>
      <div class="placeholder-line placeholder-line--short"></div>
    </div>
  `;
};

const setState = (state: AppState): void => {
  if (state === 'empty') {
    renderEmptyState();
    return;
  }

  if (state === 'loading') {
    renderLoadingState();
    return;
  }

  renderResultState();
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

    setState('result');
  } catch {
    setState('empty');
  }
};

searchForm.addEventListener('submit', handleSearch);
setState('empty');
