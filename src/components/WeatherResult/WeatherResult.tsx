import React from 'react';
import { useTranslation } from 'react-i18next';

import './WeatherResult.css';

import { OpenWeatherForecastItem, OpenWeatherService, OpenWeatherResult, UnitsTemp } from '../../OpenWeatherService';

export interface WeatherResultProps {
  result: OpenWeatherResult;
  expand: boolean;
  onClick?: () => void;
}
export function WeatherResult({ result, expand, onClick }: WeatherResultProps) {
  const { i18n } = useTranslation();
  const date = React.useMemo(() => new Date(result.date), [ result.date ]);

  return (
    <div className='WeatherResult' onClick={onClick}>
      <div className='WeatherResult-row'>
        <p className='WeatherResult-cityName'>{result.forecast.city.name}</p>
        <p className='WeatherResult-date'>{date.toLocaleDateString(i18n.language)}</p>
      </div>
      {expand ? <>
        <div className='WeatherResult-row'>
          {result.forecast.list.map(item => <Item key={item.dt} result={result} item={item} />)}
        </div>
      </> : null}
    </div>
  );
}

interface ItemProps {
  result: OpenWeatherResult;
  item: OpenWeatherForecastItem;
}
function Item({ result, item }: ItemProps) {
  const { t, i18n } = useTranslation();
  const date = React.useMemo(() => new Date(item.dt * 1000), [ item.dt ]);
  const units = UnitsTemp[result.units];
  return (
    <div className='WeatherResult-item'>
      <div className='WeatherResult-item-date'>{date.toLocaleDateString(i18n.language)}</div>
      <div className='WeatherResult-item-temp'>{item.main.temp}{units}</div>
      {item.main.temp_min && item.main.temp_max ? (
        <div className='WeatherResult-row'>
          <div className='WeatherResult-item-value'>
            <p className='WeatherResult-item-title'>{t('WeatherResult.item.min')}</p>
            <p className='WeatherResult-item-min'>{item.main.temp_min}{units}</p>
          </div>
          <div className='WeatherResult-item-value'>
            <p className='WeatherResult-item-title'>{t('WeatherResult.item.max')}</p>
            <p className='WeatherResult-item-max'>{item.main.temp_max}{units}</p>
          </div>
        </div>
      ) : null}
      <div className='WeatherResult-row'>
        <div className='WeatherResult-item-value'>
          <p className='WeatherResult-item-title'>{t('WeatherResult.item.feels')}</p>
          <p className='WeatherResult-item-feels'>{item.main.feels_like}{units}</p>
        </div>
        <div className='WeatherResult-item-value'>
          <p className='WeatherResult-item-title'>{t('WeatherResult.item.pressure')}</p>
          <p className='WeatherResult-item-pressure'>{t('WeatherResult.item.pressureValue', { value: item.main.pressure })}</p>
        </div>
      </div>
      <img className='WeatherResult-item-weatherIcon' src={OpenWeatherService.icon(item.weather[0].icon)} />
      <div className='WeatherResult-item-weatherDesc'>{item.weather[0].description}</div>
    </div>
  );
}
