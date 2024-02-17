import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';

import { API_URL } from '../../index';

export const Leaderboard = () => {
  const [data, setData] = useState<DataType>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/stats/leaderboard`);
        const res = await response.json();
        if (res.error) {
          alert(res.error);
        } else {
          setData(res);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        alert('Could not fetch leaderboard data');
      }
    };
    fetchData();
  }, []);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Staff Name</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        {data
          .sort((a, b) => Number(b.count) - Number(a.count))
          .map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.staff_name}</td>
              <td>{item.count}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

type DataType = { staff_name: string; count: string }[];
