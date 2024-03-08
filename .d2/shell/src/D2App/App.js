import React from 'react';
import { DataQuery } from '@dhis2/app-runtime';
import CheckIcon from '@mui/icons-material/Check';

// Roboto as default font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import classes from './App.module.scss';
const query = {
  me: {
    resource: 'me'
  }
};
const MyApp = () => /*#__PURE__*/React.createElement("div", {
  className: classes.container
}, /*#__PURE__*/React.createElement(DataQuery, {
  query: query
}, _ref => {
  let {
    error,
    loading,
    data
  } = _ref;
  if (error) {
    return /*#__PURE__*/React.createElement("span", null, "ERROR");
  }
  if (loading) {
    return /*#__PURE__*/React.createElement("span", null, "...");
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Alert, {
    icon: /*#__PURE__*/React.createElement(CheckIcon, {
      fontSize: "inherit"
    }),
    severity: "success"
  }, "Here is a gentle confirmation that your action was successful."), /*#__PURE__*/React.createElement(Button, {
    variant: "contained"
  }, "Hello world"));
}));
export default MyApp;