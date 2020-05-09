import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronUp, FaChevronDown, FaTrashAlt } from 'react-icons/fa';

import './History.css';

import { OpenWeatherResult } from '../../OpenWeatherService';
import { WeatherResult } from '../WeatherResult';

export interface HistoryProps {
  results: OpenWeatherResult[];
  clean: () => void;
}
export function History({ results, clean }: HistoryProps) {
  const { t } = useTranslation();

  const [ order, setOrder ] = React.useState<'asc' | 'des'>('des');
  const sorted = React.useMemo(() => {
    if (order === 'asc') {
      return results.sort((a, b) => a.date - b.date);
    } else {
      return results.sort((a, b) => b.date - a.date);
    }
  }, [ order, results ]);

  const [ expanded, setExpanded ] = React.useState<number>();
  const toggleExpanded = React.useCallback((value: number) => {
    setExpanded(expanded => expanded !== value ? value : undefined);
  }, [ ]);

  React.useEffect(() => {
    if (!sorted.length) return;
    setExpanded(sorted[0].date);
  }, [ sorted ]);

  return (
    <div className='History'>
      <div className='History-header'>
        <a className='History-header-button' onClick={React.useCallback(() => setOrder('asc'), [ ])}>
          <FaChevronUp />
        </a>
        <a className='History-header-button' onClick={React.useCallback(() => setOrder('des'), [ ])}>
          <FaChevronDown />
        </a>
        <span className='History-header-filler' />
        <a className='History-header-button' onClick={clean}>
          <FaTrashAlt />
        </a>
      </div>
      <div className='History-items'>
        {sorted.map(result => (
          <WeatherResult key={result.date} result={result} expand={expanded === result.date} onClick={() => toggleExpanded(result.date)} />
        ))}
      </div>
    </div>
  );
}
