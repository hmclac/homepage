import React, { useContext, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';

import { AppContext } from '../../Contexts/AppContext';
import { H2 } from '..';

import { API_URL } from '../..';

type StaffProps = {
  staff: string[];
  setStaff: React.Dispatch<React.SetStateAction<string[]>>;
};
export const Staff: React.FC<StaffProps> = ({ staff, setStaff }) => {
  const context = useContext(AppContext)!;
  const [newStaff, setNewStaff] = useState<string>('');

  const handleAddStaff = async () => {
    const res = await fetch(`${API_URL}/admin/staff`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        staff_name: context.state.username,
        staff: newStaff
      }),
      method: 'POST'
    }).then((x) => x.json());

    if (res.error) return alert(res.error);

    setNewStaff('');
    setStaff(res.staff);
  };

  const handleDeleteStaff = async (staff: string) => {
    const res = await fetch(`${API_URL}/admin/staff`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        staff_name: context.state.username,
        staff
      }),
      method: 'DELETE'
    }).then((x) => x.json());

    if (res.error) return alert(res.error);

    setStaff(res.staff);
  };
  return (
    <>
      <Row className='justify-content-md-center'>
        <Col sm={12}>
          <H2>Staff Members</H2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <td>Username</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {staff.map((staff, i) => (
                <tr key={i}>
                  <td>{staff}</td>
                  <td>
                    <Button
                      variant='warning'
                      onClick={() => handleDeleteStaff(staff)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <Form.Control
                    type='text'
                    value={newStaff || ''}
                    onChange={(e) => setNewStaff(e.target.value)}
                  />
                </td>
                <td>
                  <Button variant='success' onClick={() => handleAddStaff()}>
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
