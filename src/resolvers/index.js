import Resolver from '@forge/resolver';
import { fetch } from '@forge/api'

const resolver = new Resolver();

resolver.define('getLocationCoordinates', async (req) => {

  if(req.payload.location != null){
    
    const url = "https://api.openweathermap.org/geo/1.0/direct?q=" + req.payload.location.city + "," + req.payload.location.country + "&limit=5&appid=" + process.env.OPENWEATHER_KEY;
    const response = await fetch(url)
    if(!response.ok) {
      const errmsg = `Error from Open Weather Map Geolocation API: ${response.status} ${await response.text()}`;
      console.error(errmsg)
      throw new Error(errmsg)
    }
    const locations = await response.json()

    console.log('location json')
    console.log(locations[0]);
    console.log('location response')
    console.log(response);

    return locations[0];
  } else {
    return null;
  }
});


resolver.define('getWeather', async (req) => {

  if(req.payload.coords != null){

  const lon = req.payload.coords.lon;
  const lat = req.payload.coords.lat;
  const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + process.env.OPENWEATHER_KEY;
  const response = await fetch(url)
  if(!response.ok) {
    const errmsg = `Error from Open Weather Map Weather API: ${response.status} ${await response.text()}`;
    console.error(errmsg)
    throw new Error(errmsg)
  }

  const weather = await response.json()

  console.log('getweather response')
  console.log(response);
  console.log('getweather json')
  console.log(weather);

  return weather;
  }
  else 
  {
    return null;
  }

})

export const handler = resolver.getDefinitions();
