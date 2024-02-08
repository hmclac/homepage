import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { AppContext } from '../Contexts/AppContext';

const Employee = () => {
  const context = useContext(AppContext);

  // useEffect should be placed at the top level
  useEffect(() => {
    if (context) {
      document.title = 'LAC | Employee';
    }
  }, [context]);

  // Early return if context is not available
  if (!context) {
    return null;
  }

  return (
    <Container style={{ padding: '30px 1%' }}>
      <p>Hi</p>
    </Container>
  );
};

export { Employee };