import React from 'react';
import { createRoot } from 'react-dom/client';

import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

import { AppProvider } from './Contexts/AppContext';
import { App } from './Components/App';
import { Home } from './Pages/Home';
import { Login } from './Pages/Login';
import { NotFound } from './Pages/404';
import { Employee } from './Pages/Employee';

// process.env.URL = 'http://localhost:3000';
// export const API_URL = 'https://hmc-lac.mooo.com';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App is now a layout component for your routes
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/employee', element: <Employee /> },
    ],
  },
]);

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
);

reportWebVitals();
