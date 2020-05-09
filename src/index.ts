import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

const root = document.createElement('div');
root.id = 'react-root';
document.body.append(root);
ReactDOM.render(React.createElement(React.Fragment), root);
