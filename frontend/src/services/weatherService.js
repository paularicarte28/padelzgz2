// API externa: Open-Meteo (sin key, gratuita)
const ZARAGOZA_LAT = 41.6488;
const ZARAGOZA_LON = -0.8891;

export const weatherService = {
  async getZaragozaWeather() {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${ZARAGOZA_LAT}&longitude=${ZARAGOZA_LON}&current=temperature_2m,weathercode,windspeed_10m&wind_speed_unit=ms&timezone=Europe%2FMadrid`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al obtener el tiempo');
    const data = await response.json();
    const { temperature_2m, weathercode, windspeed_10m } = data.current;

    // Condiciones buenas para jugar: sin lluvia, viento < 10 m/s, temp > 5°C
    const isGoodForPadel =
      weathercode < 45 && windspeed_10m < 10 && temperature_2m > 5;

    return {
      temperature: Math.round(temperature_2m),
      windspeed: Math.round(windspeed_10m),
      weathercode,
      isGoodForPadel,
      description: getWeatherDescription(weathercode),
    };
  },
};

function getWeatherDescription(code) {
  if (code === 0) return 'Despejado';
  if (code <= 3) return 'Parcialmente nublado';
  if (code <= 48) return 'Niebla';
  if (code <= 67) return 'Lluvia';
  if (code <= 77) return 'Nieve';
  if (code <= 82) return 'Chubascos';
  if (code <= 99) return 'Tormenta';
  return 'Variable';
}
