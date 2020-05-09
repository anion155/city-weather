import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

import './index.css';
import './i18n';

const root = document.createElement('div');
root.id = 'react-root';
document.body.append(root);
ReactDOM.render(React.createElement(App), root);
