import React from 'react';
import { Container } from 'react-bootstrap';

import styled from 'styled-components';

import { Colors } from './App';

export const H1 = styled.h1`
  text-align: center;
  color: ${Colors.LIGHT};
`;

export const CustomContainer = styled(Container)`
  background-color: ${Colors.GRAY};
  padding: 2rem;
  margin-bottom: 20px;
  border-radius: 0.3rem;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  max-width: 100% !important;
`;

export const H2 = styled.h2`
  text-align: center;
`;

export const CC = styled(Container)`
  padding: 30px 1%;
`;

export const InputField = styled(Container)`
  padding: 2%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  max-width: 100% !important;
`;
