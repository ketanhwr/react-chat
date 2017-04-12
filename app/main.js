import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

var socket = io();

ReactDOM.render(<App />, document.getElementById('root'));
