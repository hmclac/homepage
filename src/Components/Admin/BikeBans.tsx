import React, { useContext, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';

import { AppContext } from '../../Contexts/AppContext';
import { H2 } from '..';

import { API_URL } from '../..';

type BikeBansProps = {
  bikeBans: string[];
  setBikeBans: React.Dispatch<React.SetStateAction<string[]>>;
};
export const BikeBans: React.FC<BikeBansProps> = ({
  bikeBans,
  setBikeBans
}) => {
  const context = useContext(AppContext)!;
  const [newBikeban, setNewbikeban] = useState<string>('');

  const handleAddBikeBan = async () => {
    const res = await fetch(`${API_URL}/admin/bikebans`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        staff_name: context.state.username,
        bikeban: newBikeban
      }),
      method: 'POST'
    }).then((x) => x.json());

    if (res.error) return alert(res.error);

    setNewbikeban('');
    setBikeBans(res.bikebans);
  };

  const handleDeleteBikeBan = async (bikeban: string) => {
    const res = await fetch(`${API_URL}/admin/bikebans`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        staff_name: context.state.username,
        bikeban
      }),
      method: 'DELETE'
    }).then((x) => x.json());

    if (res.error) return alert(res.error);

    setBikeBans(res.bikebans);
  };

  return (
    <>
      <Row className='justify-content-md-center'>
        <Col sm={12}>
          {/* Bikes Table */}
          <H2>Bike Bans</H2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <td>Banned ID</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {bikeBans &&
                bikeBans.map((ban, i) => (
                  <tr key={i}>
                    <td>{ban}</td>
                    <td>
                      <Button
                        variant='warning'
                        onClick={() => handleDeleteBikeBan(ban)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              <tr>
                <td>
                  <Form.Control
                    type='text'
                    value={newBikeban || ''}
                    onChange={(e) => setNewbikeban(e.target.value)}
                  />
                </td>
                <td>
                  <Button variant='success' onClick={() => handleAddBikeBan()}>
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
