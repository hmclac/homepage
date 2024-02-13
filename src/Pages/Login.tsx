import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { AppContext } from '../Contexts/AppContext';
import { API_URL } from '..';

const StyledForm = styled(Form)`
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
export const Login = () => {
  const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');

  const context = useContext(AppContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (context) {
      document.title = 'LAC | Login';
    }
  });
  useEffect(() => {
    if (context && context.state.isLoggedIn) {
      navigate('/employee');
    }
  }, [context, context?.state.isLoggedIn, navigate]);

  // useEffect(() => {
  // Update local storage when isLoggedIn changes
  // if (context && context.state.isLoggedIn) {
  //   localStorage.setItem('state', JSON.stringify(context.state));
  // }
  // }, [context?.state.isLoggedIn]);
  if (!context) {
    return null;
  }

  const { state, setState } = context;

  const handleLogin = async (e: Event | any) => {
    e.preventDefault();

    try {
      const res: {
        error?: string;
        message?: string;
      } = await fetch(`${(API_URL as string) + '/login'}`, {
        method: 'POST',
        body: JSON.stringify({ staff_name: username }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      }).then((x) => x.json());
      if (res.error) {
        return alert(res.error);
      }
      if (res.message) {
        setState({ ...state, isLoggedIn: true, username });
        setTimeout(() => {
          setState({ ...state, isLoggedIn: false, username: '' });
          navigate('/login');
        }, 2 * 60 * 60 * 1000);
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <StyledForm onSubmit={handleLogin}>
      <Form.Group controlId='formUsername'>
        <Form.Label>Staff Username</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>

      {/* <Form.Group controlId='formPassword'>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group> */}

      <Button variant='primary' type='submit'>
        Login
      </Button>
    </StyledForm>
  );
};
