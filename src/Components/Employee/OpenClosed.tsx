import React, { useContext } from 'react';

import { Button } from 'react-bootstrap';

import styled from 'styled-components';

import { AppContext } from '../../Contexts/AppContext';

import { API_URL } from '../..';

const StyledStatus = styled.div`
  text-align: center;
  margin: 20px 0;

  .status-text {
    font-size: 1.25rem; // Larger text for status
    margin-bottom: 15px;
  }

  .toggle-button {
    background-color: #f8765f; // Example color, replace with your own
    border: none;

    &:hover {
      background-color: darken(#f8765f, 10%); // Darken the button on hover
    }
  }
`;

export const OpenClosed = () => {
  const context = useContext(AppContext)!;
  const { state, setState } = context;

  const setOpen = async () => {
    const res = await fetch(`${API_URL}`, {
      method: 'POST',
      body: JSON.stringify({
        staff_name: state.username
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((x) => x.json());

    if (res.error) return alert(res.error);

    setState({ ...state, isOpen: res.isOpen });
  };

  return (
    <StyledStatus>
      <div className='status-text'>
        Status: {state.isOpen ? 'Open' : 'Closed'}
      </div>

      <Button
        className={state.isOpen ? 'btn-success' : 'btn-danger'}
        onClick={setOpen}>
        Toggle the LAC: {!state.isOpen ? 'Open' : 'Closed'}
      </Button>
    </StyledStatus>
  );
};
