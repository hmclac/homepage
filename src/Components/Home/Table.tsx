import React from 'react';

import { Table as Tab } from 'react-bootstrap';

import styled from 'styled-components';

export const Table = styled(Tab)`
  border: 0 !important;
  thead th,
  tbody td {
    border: 0 !important;
  }
  box-shadow: 0 !important;
`;

export const TableContainer = styled.div`
  .table-responsive {
    border: 0 !important;
    box-shadow: none !important;
  }
`;
