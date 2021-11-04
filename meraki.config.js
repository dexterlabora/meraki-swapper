// to start application
// $ NUXT_ENV_API_KEY=<YOUR-KEY></YOUR-KEY> NUXT_ENV_API_URL="https://n143.meraki.com/api/v0" yarn dev

// Define your environment variables here

module.exports = {
  apiKey: process.env.NUXT_ENV_API_KEY || "", // 2394a4cf8c2dd79d45cab75b9eb1dfc676a05453
  apiUrl: process.env.NUXT_ENV_API_URL || "https://api-mp.meraki.com/api/v0"
};
