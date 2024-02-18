import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

import { AppContext } from '../../Contexts/AppContext';

import { Colors } from '../App';

const NavBar = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (context) {
    }
  }, [context, navigate]);

  if (!context) {
    return null;
  }

  const { state, setState } = context;

  const handleLogout = () => {
    setState({ ...state, isLoggedIn: false, username: '' });
    navigate('/');
  };

  return (
    <Navbar expand='md' style={{ backgroundColor: Colors.LIGHT }}>
      <Navbar.Brand href='/'>
        <img src={''} alt='LAC' />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='mr-auto'>
          <Nav.Link as={Link} to='/'>
            Home
          </Nav.Link>
          <Nav.Link as={Link} to='/stats'>
            Stats
          </Nav.Link>
        </Nav>
        <Nav className='ml-auto'>
          {state.isLoggedIn ? (
            <>
              <Nav.Link as={Link} to='/employee'>
                Employee
              </Nav.Link>
              <Nav.Link as={Link} to='/admin'>
                Admin
              </Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
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
