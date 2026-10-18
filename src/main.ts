import './style.css';

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
      <aside class="weather-sidebar" aria-label="Dados principais do clima">
        <div class="sidebar-placeholder">
          <div class="placeholder-line placeholder-line--big"></div>
          <div class="placeholder-line placeholder-line--medium"></div>
          <div class="placeholder-line placeholder-line--short"></div>
          <div class="placeholder-line placeholder-line--small"></div>
        </div>
      </aside>

      <main class="weather-main" aria-label="Métricas do clima">
        <div class="main-placeholder">
          <div class="placeholder-line placeholder-line--medium"></div>
          <div class="placeholder-line placeholder-line--short"></div>
          <div class="placeholder-line placeholder-line--medium"></div>
          <div class="placeholder-line placeholder-line--short"></div>
        </div>
      </main>
    </section>
  </div>
`;
