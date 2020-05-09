import React from 'react';

export enum Units {
  kelvin, metric, imperial
}
export const UnitsTemp = {
  [Units.kelvin]: '',
  [Units.metric]: '°',
  [Units.imperial]: '',
};

export const OpenWeatherService = new class OpenWeatherService {
  serviceOrigin = 'http://api.openweathermap.org';
  apiPath = '/data/2.5';
  iconsPath = '/img/w';
  appid = build.OPENWEATHER_APPID;

  async forecast(cityQuery: CityQuery, units?: Units, lang?: string, maxLinesCount?: number): Promise<OpenWeatherForecast> {
    const params = new URLSearchParams({ appid: this.appid });
    switch (cityQuery.type) {
    case 'query':
      if (cityQuery.state && cityQuery.countryCode) {
        params.append('q', `${cityQuery.city},${cityQuery.state},${cityQuery.countryCode}`);
      } else if (cityQuery.state) {
        params.append('q', `${cityQuery.city},${cityQuery.state}`);
      } else {
        params.append('q', cityQuery.city);
      }
      break;
    }
    if (units !== undefined) {
      switch (units) {
      case Units.metric: params.append('units', 'metric'); break;
      case Units.metric: params.append('units', 'metric'); break;
      }
    }
    if (lang !== undefined) {
      params.append('lang', lang);
    }
    if (maxLinesCount !== undefined) {
      params.append('cnt', `${maxLinesCount}`);
    }
    const url = new URL(`${this.apiPath}/forecast?${params.toString()}`, this.serviceOrigin);
    const resp = await fetch(url.href);
    if (!resp.ok) throw new Error((await resp.json()).message);
    return await resp.json();
  }

  icon(id: string) {
    const url = new URL(`${this.iconsPath}/${id}.png`, this.serviceOrigin);
    return url.href;
  }
}

interface OpenWeatherForecastOptions {
  units?: Units;
  lang?: string;
  maxLinesCount?: number;
}
export interface OpenWeatherResult {
  date: number;
  units: Units;
  forecast: OpenWeatherForecast;
}
export function useOpenWeatherForecast(query?: CityQuery, { units = Units.metric, lang, maxLinesCount }: OpenWeatherForecastOptions = { }) {
  const promiseRef = React.useRef<Promise<any>>();
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const [ result, setResult ] = React.useState<OpenWeatherResult>();
  const [ error, setError ] = React.useState<any>();

  React.useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError(undefined);
    const date = Date.now();
    const promise = OpenWeatherService.forecast(query, units, lang, maxLinesCount);
    promiseRef.current = promise;
    promise.then(forecast => {
      console.log(forecast);
      if (promise !== promiseRef.current) return;
      setLoading(false);
      setResult({ date, units, forecast });
    }).catch(error => {
      console.error(error);
      if (promise !== promiseRef.current) return;
      setLoading(false);
      setResult(undefined);
      setError(error);
    });
    return () => {
      promiseRef.current = undefined;
      setLoading(false);
    };
  }, [ query, units, lang, maxLinesCount ]);

  return React.useMemo(() => ({ loading, result, error }), [ loading, result, error ]);
}

export interface Coords {
  lat: number;
  lon: number;
}
export type CityQuery = (
  | { type: 'query'; city: string; state?: string; countryCode?: string }
  | { type: 'id'; cityId: string }
  | { type: 'coords' } & Coords
  | { type: 'zip'; zipcode: number; countryCode: string }
);
export interface OpenWeatherForecast {
  /** Internal parameter */
  code: number;
  /** Internal parameter */
  message: string;
  city: {
    /** City ID */
    id: string;
    /** City name */
    name: string;
    /** City geo location */
    coord: Coords;
    /** Country code (GB, JP etc.) */
    country: string;
    /** Shift in seconds from UTC */
    timezone: number;
    population: number;
    sunrise: number;
    sunset: number;
  };
  /** Number of lines returned by this API call */
  cnt: number;
  list: OpenWeatherForecastItem[];
}
export interface OpenWeatherForecastItem {
  /** Time of data forecasted, unix, UTC */
  dt: number;
  main: {
    /** Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit */
    temp: number;
    /** Temperature. This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit */
    feels_like: number;
    /** Minimum temperature at the moment of calculation. This is minimal forecasted temperature (within large megalopolises and urban areas), use this parameter optionally. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit */
    temp_min: string | void;
    /** Maximum temperature at the moment of calculation. This is maximal forecasted temperature (within large megalopolises and urban areas), use this parameter optionally. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit */
    temp_max: string | void;
    /** Atmospheric pressure on the sea level by default, hPa */
    pressure: number;
    /** Atmospheric pressure on the sea level, hPa */
    sea_level: number;
    /** Atmospheric pressure on the ground level, hPa */
    grnd_level: number;
    /** Humidity, % */
    humidity: number;
    /** Internal parameter */
    temp_kf: number;
  };
  /** (more info Weather condition codes) */
  weather: {
    /** Weather condition id */
    id: any;
    /** Group of weather parameters (Rain, Snow, Extreme etc.) */
    main: string;
    /** Weather condition within the group */
    description: string;
    /** Weather icon id */
    icon: string;
  }[];
  clouds: {
    /** Cloudiness, % */
    all: number;
  };
  wind: {
    /** Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour. */
    speed: number;
    /** Wind direction, degrees (meteorological) */
    deg: number;
  };
  rain: {
    /** Rain volume for last 3 hours, mm */
    '3h': number;
  };
  snow: {
    /** Snow volume for last 3 hours, mm */
    '3h': number;
  };
  /** Time of data forecasted, ISO, UTC */
  dt_txt: number;
}
