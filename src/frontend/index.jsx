import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Box, Heading, Image, Inline, Strong, Text, Textfield, xcss } from '@forge/react';
import { view, invoke } from '@forge/bridge';

const defaultConfig = {
  city: 'Sydney',
  country: 'Australia'
};

const containerStyles = xcss({
  padding: 'space.200'
});


const Config = () => {
  return (
    <>
      <Textfield name="city" label="Enter City" defaultValue={defaultConfig.city} />
      <Textfield name="country" label="Enter Country" defaultValue={defaultConfig.country} />
    </>
  );
};

const App = () => {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    invoke('getLocationCoordinates', {location: location}).then(setCoords);
  }, [location]);

  useEffect(() => {
    invoke('getWeather', {coords: coords}).then(setWeather);
  }, [coords]);
  

  useEffect(() => {
    const getTheme = async() => {
      const response = await view.getContext();
      console.log(response);
      setLocation(response.extension.config);
    }

    getTheme();
  }, []);

  console.log(coords);
  console.log(weather);
  console.log(location);

  //<Text><Em>Showing weather for {weather ? (weather.name + ", " + weather.sys.country) : 'Loading...'} {coords ? (`(${coords.lat} ${coords.lon})`) : 'Loading...'}</Em></Text>


  return (
      <Box xcss={containerStyles}>
          <Heading as="h2">The Weather</Heading>
          <Text><Strong>Location:</Strong> {location ? (`${location.city}, ${location.country}`) : `Please edit the macro to enter your location`}</Text>
          <Inline>
            <Box xcss={containerStyles}>
              <Image src={weather ? (`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`) : "https://openweathermap.org/img/wn/01d@2x.png"} alt={weather ? weather.weather[0].description : "Loading"} />
            </Box>
            <Box xcss={containerStyles}>
              <Text><Strong>Current Temperature</Strong> {weather ? weather.main.temp : 'Loading...'} degrees Celcius</Text>
              <Text><Strong>Feels like:</Strong> {weather ? weather.main.feels_like : 'Loading...'} degrees Celcius</Text>
              <Text><Strong>Humidity:</Strong> {weather ? weather.main.humidity : 'Loading...'}%</Text>
            </Box >
          </Inline>
      </Box>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ForgeReconciler.addConfig(<Config />);
