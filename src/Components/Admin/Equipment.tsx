import React, { useContext, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';

import { AppContext } from '../../Contexts/AppContext';
import { H2 } from '..';

import { API_URL } from '../..';

type EquipmentProps = {
  equipment: string[];
  setEquipment: React.Dispatch<React.SetStateAction<string[]>>;
};

export const Equipment: React.FC<EquipmentProps> = ({
  equipment,
  setEquipment
}) => {
  const context = useContext(AppContext)!;
  const [newEquipment, setNewE] = useState<string>('');

  const handleAddEquipment = async () => {
    const res = await fetch(`${API_URL}/admin/equipment`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        staff_name: context.state.username,
        equipment: newEquipment
      }),
      method: 'POST'
    }).then((x) => x.json());

    if (res.error) return alert(res.error);

    setEquipment(res.equipment);
    setNewE('');
  };

  const handleDeleteEquipment = async (type: string) => {
    const res = await fetch(`${API_URL}/admin/equipment`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        staff_name: context.state.username,
        equipment: type
      }),
      method: 'DELETE'
    }).then((x) => x.json());

    if (res.error) return alert(res.error);

    setEquipment(res.equipment);
  };

  return (
    <>
      <Row className='justify-content-md-center'>
        <Col sm={12}>
          <H2>Manage Equipment</H2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <td>Equipment Name</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {equipment.map((x, i) => (
                <tr key={i}>
                  <td>{x}</td>
                  <td>
                    <Button
                      variant='warning'
                      onClick={() => handleDeleteEquipment(x)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <Form.Control
                    type='text'
                    value={newEquipment || ''}
                    onChange={(e) => setNewE(e.target.value)}
                  />
                </td>
                <td>
                  <Button
                    variant='success'
                    onClick={() => handleAddEquipment()}>
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
