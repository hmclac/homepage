import React, { useContext, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';

import { AppContext } from '../../Contexts/AppContext';
import { H2 } from '..';

import { API_URL } from '../..';

type BikeProps = {
  bikes: number[];
  setBikes: React.Dispatch<React.SetStateAction<number[]>>;
};

export const Bike: React.FC<BikeProps> = ({ bikes, setBikes }) => {
  const context = useContext(AppContext)!;

  const [newbike, setNewbike] = useState<string>('');

  const handleAddBike = async () => {
    const res = await fetch(`${API_URL}/admin/bikes`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        staff_name: context.state.username,
        bike: newbike
      }),
      method: 'POST'
    }).then((x) => x.json());

    if (res.error) return alert(res.error);

    setBikes(res.bikes);
    setNewbike('');
  };

  const handleDeleteBike = async (key: number) => {
    const res = await fetch(`${API_URL}/admin/bikes`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ staff_name: context.state.username, bike: key }),
      method: 'DELETE'
    }).then((x) => x.json());

    if (res.error) return alert(res.error);

    setBikes(res.bikes);
  };
  return (
    <>
      <Row className='justify-content-md-center'>
        <Col sm={12}>
          <H2>Manage Bikes</H2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <td>Bike Number</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {bikes.map((x, i) => (
                <tr key={i}>
                  <td>{x}</td>
                  <td>
                    <Button
                      variant='warning'
                      onClick={() => handleDeleteBike(Number(x))}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <Form.Control
                    type='text'
                    value={newbike || ''}
                    onChange={(e) => setNewbike(e.target.value)}
                  />
                </td>
                <td>
                  <Button variant='success' onClick={() => handleAddBike()}>
                    Add
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
};
