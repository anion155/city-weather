import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

import './index.css';

const root = document.createElement('div');
root.id = 'react-root';
document.body.append(root);
ReactDOM.render(React.createElement(App), root);
