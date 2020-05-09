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
  const formatter = useDateFormater(i18n.language);
  const date = React.useMemo(() => formatter(new Date(result.date)), [ result.date, formatter ]);
  const units = UnitsTemp[result.units];
  const item = result.forecast.list[1];

  return (
    <div className={'WeatherResult' + (expand ? ' expand' : '')} onClick={onClick}>
      <div className='WeatherResult-header'>
        <p className='WeatherResult-header-cityName'>{result.forecast.city.name}</p>
        <p className='WeatherResult-header-date'>{date}</p>
        <p className='WeatherResult-header-temp'>{item.main.temp}{units}</p>
        <img className='WeatherResult-header-weatherIcon' src={OpenWeatherService.icon(item.weather[0].icon)} />
      </div>
      <div className='WeatherResult-content'>
        <Item result={result} item={result.forecast.list[0]} />
        <Item result={result} item={result.forecast.list[1]} />
        <Item result={result} item={result.forecast.list[2]} />
      </div>
    </div>
  );
}

interface ItemProps {
  result: OpenWeatherResult;
  item: OpenWeatherForecastItem;
}
function Item({ result, item }: ItemProps) {
  const { t, i18n } = useTranslation();
  const formatter = useDateFormater(i18n.language);
  const date = React.useMemo(() => formatter(new Date(item.dt * 1000)), [ item.dt, formatter ]);
  const units = UnitsTemp[result.units];

  return (
    <div className='WeatherResult-item'>
      <div className='WeatherResult-item-date'>{date}</div>
      <div className='WeatherResult-item-weather'>
        <img className='WeatherResult-item-weatherIcon' src={OpenWeatherService.icon(item.weather[0].icon)} />
        <div className='WeatherResult-item-temp'>{item.main.temp}{units}</div>
      </div>
      <div className='WeatherResult-item-weatherDesc'>{item.weather[0].description}</div>
      {item.main.temp_min && item.main.temp_max ? (
        <div className='WeatherResult-item-row'>
          <div className='WeatherResult-item-min'>
            {item.main.temp_min}{units}
          </div>
          <div className='WeatherResult-item-max'>
            {item.main.temp_max}{units}
          </div>
        </div>
      ) : null}
      <p className='WeatherResult-item-title'>{t('WeatherResult.item.feels')}</p>
      <p className='WeatherResult-item-feels'>{item.main.feels_like}{units}</p>
      <p className='WeatherResult-item-title'>{t('WeatherResult.item.pressure')}</p>
      <p className='WeatherResult-item-pressure'>{t('WeatherResult.item.pressureValue', { value: item.main.pressure })}</p>
    </div>
  );
}

function useDateFormater(lang: string) {
  const formatter = React.useMemo(() => new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'short' }), [ lang ]);
  return React.useCallback((date: Date) => {
    let day, month, literal = ' ';
    for (const part of formatter.formatToParts(date)) {
      switch (part.type) {
      case 'day': day = part.value; break;
      case 'month': month = part.value; break;
      case 'literal': literal = part.value; break;
      }
    }
    return `${day}${literal}${month}`;
  }, [ formatter ]);
}
