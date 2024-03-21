import { render } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import MyApp from './App';
describe('MyApp Component', () => {
  it('renders without crashing', () => {
    render( /*#__PURE__*/React.createElement(MyApp, null));
  });
  it('renders the container div with correct class', () => {
    const {
      container
    } = render( /*#__PURE__*/React.createElement(MyApp, null));
    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toBeInTheDocument();
  });
});