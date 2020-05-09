import React from 'react';
import { useTranslation } from 'react-i18next';

import { CitySelector } from './components/CitySelector';
import { CityQuery, useOpenWeatherForecast, Units } from './OpenWeatherService';

import './i18n';
import './App.css';

export function App() {
  const { i18n } = useTranslation();

  const [ cityQuery, setCityQuery ] = React.useState<CityQuery>();
  const { forecast } = useOpenWeatherForecast(cityQuery, Units.metric, i18n.language);

  return (
    <div className='App'>
      <CitySelector onCityQueryChange={setCityQuery} />
      {forecast ? JSON.stringify(forecast) : null}
    </div>
  );
}
