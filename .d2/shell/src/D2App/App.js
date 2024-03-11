import React from "react";
// eslint-disable-next-line no-unused-vars
import { DataQuery } from '@dhis2/app-runtime';
import i18n from '@dhis2/d2-i18n';
// import React from 'react'
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", null, i18n.t('Hello {{name}}', {
    name: data.me.name
  })), /*#__PURE__*/React.createElement("h3", null, i18n.t('Welcome to DHIS2!')));
}));
export default MyApp;