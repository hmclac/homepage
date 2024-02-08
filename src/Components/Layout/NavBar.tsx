import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';

import styled from 'styled-components';

import { AppContext } from '../../Contexts/AppContext';

import { navbarLight } from '../App';
import { API_URL } from '../..';

const NavBar = () => {
  const context = useContext(AppContext);

  useEffect(() => {
    if (context) {
      // Any logic that depends on context
    }
  }, [context]);

  if (!context) {
    return null;
  }

  const { state, setState } = context;

  return (
    <Navbar expand='md' style={{ backgroundColor: navbarLight }}>
      <Navbar.Brand href='/'>
        <img src={''} alt='LAC' />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='mr-auto'>
          <Nav.Link as={Link} to='/'>
            Home
          </Nav.Link>

        </Nav>
        <Nav className='ml-auto'>
          {state.isLoggedIn ? (
            <>
            <Nav.Link as={Link} to='/employee'>
              Employee
            </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to='/login'>
                Login
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export { NavBar };