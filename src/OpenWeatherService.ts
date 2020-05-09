import React from 'react';

export enum Units {
  kelvin, metric, imperial
}

export const OpenWeatherService = new class OpenWeatherService {
  serviceOrigin = 'http://api.openweathermap.org';
  apiPath = '/data/2.5';
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
}

export function useOpenWeatherForecast(cityQuery?: CityQuery, units?: Units, lang?: string, maxLinesCount?: number) {
  const promiseRef = React.useRef<Promise<any>>();
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const [ forecast, setForecast ] = React.useState<OpenWeatherForecast>();
  const [ error, setError ] = React.useState<any>();

  React.useEffect(() => {
    if (!cityQuery) return;

    setLoading(true);
    setError(undefined);
    const promise = OpenWeatherService.forecast(cityQuery, units, lang, maxLinesCount);
    promiseRef.current = promise;
    promise.then(forecast => {
      console.log(forecast);
      if (promise !== promiseRef.current) return;
      setLoading(false);
      setForecast(forecast);
    }).catch(error => {
      console.error(error);
      if (promise !== promiseRef.current) return;
      setLoading(false);
      setForecast(undefined);
      setError(error);
    });
    return () => {
      promiseRef.current = undefined;
      setLoading(false);
    };
  }, [ cityQuery, units, lang, maxLinesCount ]);

  return React.useMemo(() => ({ loading, forecast, error }), [ loading, forecast, error ]);
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
  code: number; // Internal parameter
  message: string; // Internal parameter
  city: {
    id: string; // City ID
    name: string; // City name
    coord: Coords; // City geo location
    country: string; // Country code (GB, JP etc.)
    timezone: number; // Shift in seconds from UTC
    population: number;
    sunrise: number;
    sunset: number;
  };
  cnt: number; // Number of lines returned by this API call
  list: {
    dt: number; // Time of data forecasted, unix, UTC
    main: {
      temp: number; // Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
      feels_like: string; // Temperature. This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
      temp_min: string | void; // Minimum temperature at the moment of calculation. This is minimal forecasted temperature (within large megalopolises and urban areas), use this parameter optionally. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
      temp_max: string | void; // Maximum temperature at the moment of calculation. This is maximal forecasted temperature (within large megalopolises and urban areas), use this parameter optionally. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
      pressure: number; // Atmospheric pressure on the sea level by default, hPa
      sea_level: number; // Atmospheric pressure on the sea level, hPa
      grnd_level: number; // Atmospheric pressure on the ground level, hPa
      humidity: number; // Humidity, %
      temp_kf: number; // Internal parameter
    };
    weather: {
      id: any; // Weather condition id
      main: string; // Group of weather parameters (Rain, Snow, Extreme etc.)
      description: string; // Weather condition within the group
      icon: string; // Weather icon id
    }; // (more info Weather condition codes)
    clouds: {
      all: number; // Cloudiness, %
    };
    wind: {
      speed: number; // Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.
      deg: number; // Wind direction, degrees (meteorological)
    };
    rain: {
      '3h': number; // Rain volume for last 3 hours, mm
    };
    snow: {
      '3h': number; // Snow volume for last 3 hours, mm
    };
    dt_txt: number; // Time of data forecasted, ISO, UTC
  }[];
}
