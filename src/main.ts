import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root not found');
}

app.innerHTML = `
  <main class="app-shell">
    <h1>Clima</h1>
    <p>Estrutura base do projeto inicializada.</p>
  </main>
`;
