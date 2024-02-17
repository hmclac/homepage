import React, { useContext, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';

import { AppContext } from '../../Contexts/AppContext';
import { H2 } from '..';

import { API_URL } from '../..';

type BikeProps = {
  bans: string[];
  setBans: React.Dispatch<React.SetStateAction<string[]>>;
};

export const Bans: React.FC<BikeProps> = ({ bans, setBans }) => {
  const context = useContext(AppContext)!;
  const [newban, setNewban] = useState<string>('');

  const handleAddBan = async () => {
    const res = await fetch(`${API_URL}/admin/bans`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        staff_name: context.state.username,
        ban: newban
      }),
      method: 'POST'
    }).then((x) => x.json());

    if (res.error) return alert(res.error);

    setNewban('');
    setBans(res.bans);
  };

  const handleDeleteBan = async (ban: string) => {
    const res = await fetch(`${API_URL}/admin/bans`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        staff_name: context.state.username,
        ban
      }),
      method: 'DELETE'
    }).then((x) => x.json());

    if (res.error) return alert(res.error);

    setBans(res.bans);
  };
  return (
    <>
      <Row className='justify-content-md-center'>
        <Col sm={12}>
          {/* Bikes Table */}
          <H2>Bans</H2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <td>Banned ID</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {bans.map((ban, i) => (
                <tr key={i}>
                  <td>{ban}</td>
                  <td>
                    <Button
                      variant='warning'
                      onClick={() => handleDeleteBan(ban)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <Form.Control
                    type='text'
                    value={newban || ''}
                    onChange={(e) => setNewban(e.target.value)}
                  />
                </td>
                <td>
                  <Button variant='success' onClick={() => handleAddBan()}>
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
