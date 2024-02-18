import React from 'react';
import { Outlet } from 'react-router';
import styled, { createGlobalStyle } from 'styled-components';

import { NavBar } from './Layout/NavBar';

export enum Colors {
  LIGHT = '#EFEFEF',
  DARK = '#3d4040',
  GRAY = '#d8d9d9'
}

const GlobalStyles = createGlobalStyle`
  :root {
    --bs-body-bg: ${Colors.GRAY};
    // --bs-table-bg: ${Colors.LIGHT}; Light grey background
    --bs-table-color: ${Colors.GRAY};
    --bs-table-hover-bg: ${Colors.DARK};
    --bs-table-hover-color: ${Colors.DARK};
  }

  .react-datepicker {
    background-color:${Colors.GRAY});
    color: ${Colors.GRAY};
  }

  .react-datepicker__header {
    background-color:${Colors.GRAY};
  }
`;

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; // Ensure it takes at least the full viewport height
  background-color: #3d4040;
`;

// Styles for the main content area
const MainContent = styled.div`
  flex-grow: 1; // Allows this element to grow and take up available space
`;

const App = () => {
  return (
    <StyledApp>
      <GlobalStyles />
      <NavBar />
      <MainContent>
        <Outlet />
      </MainContent>
    </StyledApp>
  );
};

export { App };
