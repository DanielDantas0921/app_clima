# Clima

Aplicação web para consultar as condições atuais do tempo por cidade. Os dados incluem temperatura, sensação térmica, umidade, probabilidade de precipitação e vento.

## Demonstração

https://danieldantas0921.github.io/app_clima/

## Tecnologias

- TypeScript
- Vite
- API de geocodificação e previsão do tempo da [Open-Meteo](https://open-meteo.com/)

## Executar localmente

Requisitos: Node.js 20.19 ou superior (ou 22.12 ou superior) e npm.

```bash
npm ci
npm run dev
```

O Vite mostrará no terminal o endereço local para abrir no navegador.

Para validar a versão de produção:

```bash
npm run build
npm run preview
```

Os arquivos compilados são gerados na pasta `dist`.

## Deploy

O workflow do GitHub Actions em `.github/workflows/deploy.yml` compila e publica o site no GitHub Pages em pushes para `main` ou `master`. Também é possível iniciar a execução manualmente pela aba **Actions** do GitHub.

Nas configurações do repositório, selecione **Settings → Pages → Build and deployment → Source → GitHub Actions**. A configuração do Vite usa o caminho `/app_clima/`, correspondente ao nome deste repositório no GitHub Pages.
