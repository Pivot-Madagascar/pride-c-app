import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import classes from './App.module.scss';
import RouterComponent from './routes/sections';
import ThemeProvider from './theme/index';
const MyApp = () => /*#__PURE__*/React.createElement("div", {
  className: classes.container
}, /*#__PURE__*/React.createElement(ThemeProvider, null, /*#__PURE__*/React.createElement(Router, null, /*#__PURE__*/React.createElement(Routes, null, /*#__PURE__*/React.createElement(Route, {
  path: "/*",
  element: /*#__PURE__*/React.createElement(RouterComponent, null)
})))));
export default MyApp;