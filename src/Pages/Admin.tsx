import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';
import { AppContext } from '../Contexts/AppContext';
import { API_URL } from '..';
import { CustomContainer, H2 } from './Home';
import { H1 } from './Employee';

const Admin = () => {
  const context = useContext(AppContext);

  const [equipment, setEquipment] = useState<string[]>([]);
  const [bikes, setBikes] = useState<number[]>([]);
  const [newbike, setNewbike] = useState<string>('');
  const [newEquipment, setNewE] = useState<string>('');
  const [bans, setBans] = useState<string[]>([]);
  const [newban, setNewban] = useState<string>('');
  const [bikeBans, setBikeBans] = useState<string[]>([]);
  const [newBikeban, setNewbikeban] = useState<string>('');
  const [staff, setStaff] = useState<string[]>([]);
  const [newStaff, setNewStaff] = useState<string>('');

  const navigate = useNavigate();
  useEffect(() => {
    if (!context || !context.state.isLoggedIn) return navigate('/login');

    document.title = 'LAC | Admin';
    fetchInfo();
  }, [navigate, context]);

  if (!context || !context.state.isLoggedIn) {
    return <p>You must be logged in to access this page.</p>;
  }

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

    setNewban('');
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

  async function fetchInfo() {
    const res = await fetch(`${API_URL}/admin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((x) => x.json());

    if (res.error) {
      return console.log(res.error);
    }

    setStaff(res.staff);
    setEquipment(res.equipment);
    setBikes(res.bikes);
    setBans(res.bans);
    setBikeBans(res.bikebans);
  }
  return (
    <CustomContainer>
      <H1>SUPS ONLY</H1>
      <Row className='justify-content-md-center'>
        <Col sm={12}>
          {/* Bikes Table */}
          <H2>Manage Equipment</H2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <td>Equipment Name</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {equipment &&
                equipment.map((x, i) => (
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
      <Row className='justify-content-md-center'>
        <Col sm={12}>
          {/* Bikes Table */}
          <H2>Manage Bikes</H2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <td>Bike Number</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {bikes &&
                bikes.map((x, i) => (
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
              {bans &&
                bans.map((ban, i) => (
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
      <Row className='justify-content-md-center'>
        <Col sm={12}>
          {/* Bikes Table */}
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
    </CustomContainer>
  );
};

export { Admin };
