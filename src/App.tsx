import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';
import { FaCloudSun, FaHistory } from 'react-icons/fa';

import './App.css';

import { CitySelector } from './components/CitySelector';
import { CityQuery, useOpenWeatherForecast, Units, OpenWeatherResult } from './OpenWeatherService';
import { WeatherResult } from './components/WeatherResult';
import { History } from './components/History';

export function App() {
  const { t, i18n } = useTranslation();

  const [ results, setResults ] = React.useState<OpenWeatherResult[]>([ ]);
  const clean = React.useCallback(() => {
    setResults([ ]);
    localStorage.removeItem('weatherResults');
  }, [ ]);
  React.useEffect(() => {
    const stored = localStorage.getItem('weatherResults');
    if (!stored) return;
    setResults(JSON.parse(stored));
  }, [ ]);
  React.useEffect(() => {
    const handler = () => {
      localStorage.setItem('weatherResults', JSON.stringify(results));
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [ results ]);

  const [ cityQuery, setCityQuery ] = React.useState<CityQuery>();
  const { result } = useOpenWeatherForecast(cityQuery, {
    units: Units.metric,
    lang: i18n.language,
    maxLinesCount: 3,
  });

  React.useEffect(() => {
    if (result) {
      setResults(results => [ result, ...results ]);
    }
  }, [ result ]);

  return (
    <Router>
      <div className='App'>
        <div className='App-navigation'>
          <div className='App-navigation-content'>
            <NavLink className='App-navigation-button' to='/weather'>
              <FaCloudSun />
              <span>{t('Navigation.weather')}</span>
            </NavLink>
            <NavLink className='App-navigation-button' to='/history'>
              <FaHistory />
              <span>{t('Navigation.history')}</span>
            </NavLink>
          </div>
        </div>
        <div className='App-content'>
          <Switch>
            <Route path='/history'>
              <div className='App-panel'>
                <History results={results} clean={clean} />
              </div>
            </Route>
            <Route path={[ '/', '/weather' ]}>
              <div className='App-panel'>
                <CitySelector onCityQueryChange={setCityQuery} />
                {result ? (
                  <WeatherResult result={result} expand />
                ) : null}
              </div>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}
