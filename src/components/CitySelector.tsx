import React from 'react';
import { useTranslation } from 'react-i18next';
import Select, { Props, ValueType, ActionMeta } from 'react-select';

import { CityQuery } from '../OpenWeatherService';

interface CityOption {
  value: string;
  label: string;
  query: CityQuery;
}

export type CityValueType = ValueType<CityOption>;

export interface CitySelectorProps extends Props<CityOption> {
  onCityQueryChange?: (query: CityQuery | undefined) => void;
}
export function CitySelector({ onCityQueryChange, onChange: onChangeProp, ...props }: CitySelectorProps) {
  const { t } = useTranslation();
  const cityOptions = React.useMemo<CityOption[]>(() => [
    { value: 'predefined.Moscow', label: t('cities.Moscow'), query: { type: 'query', city: 'Moscow' } },
    { value: 'predefined.Saint Petersburg', label: t('cities.Saint Petersburg'), query: { type: 'query', city: 'Saint Petersburg' } },
    { value: 'predefined.New York', label: t('cities.New York'), query: { type: 'query', city: 'New York' } },
  ], [ t ]);

  const onChange = React.useCallback((value: ValueType<CityOption>, actionMeta: ActionMeta<CityOption>) => {
    if (typeof onChangeProp === 'function') {
      onChangeProp(value, actionMeta);
    }
    if (typeof onCityQueryChange === 'function') {
      const option: CityOption | undefined = !value ? undefined : Array.isArray(value) ? value[0] : value;
      onCityQueryChange(option?.query);
    }
  }, [ onCityQueryChange, onChangeProp ]);

  return (
    <Select {...props} options={cityOptions} onChange={onChange} />
  );
}
