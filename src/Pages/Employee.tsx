import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';
import { AppContext } from '../Contexts/AppContext';
import { API_URL } from '..';
import { CustomContainer, H2 } from './Home';
import { styled } from 'styled-components';

export const H1 = styled.h1`
  text-align: center;
`;

const defaultHeadcount: Headcount = {
  weight_room: 0,
  gym: 0,
  aerobics_room: 0,
  lobby: 0,
  weight_reserved: false,
  gym_reserved: false,
  aerobics_reserved: false
};

const Employee = () => {
  const context = useContext(AppContext);
  const [swipeData, setSwipeData] = useState<string>('');
  const [recentSwipe, setRecentSwipe] = useState<SwipeData | null>(null);
  const [checkouts, setCheckouts] = useState<CheckoutData>({});
  const [bikes, setBikes] = useState<BikeData>({});
  const [headcount, setHeadcount] = useState<Headcount>(defaultHeadcount);

  const navigate = useNavigate();

  const swipeInputRef = useRef<HTMLInputElement>(null);

  const fetchCheckouts = async (username: string) => {
    const res: CheckoutData = await fetch(`${API_URL}/checkout`, {
      body: JSON.stringify({
        staff_name: username
      }),
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((x) => x.json());

    if (res.error) {
      return console.log(res.error);
    }

    for (const key in res) {
      if (!res[key]) {
        res[key] = {
          rented: !!res[key].rented_staff,
          email: '',
          student_id: '',
          student_name: '',
          time_checked_out: '',
          rented_staff: ''
        };
      } else {
        res[key] = {
          ...res[key],
          rented: true
        };
      }
    }
    setCheckouts({ ...(res as CheckoutData) });
  };

  const fetchBikes = async (username: string) => {
    const res = await fetch(`${API_URL}/bikes`, {
      body: JSON.stringify({
        staff_name: username
      }),
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json'
      }
    }).then((x) => x.json());

    if (res.error) {
      return console.log(res.error);
    }

    setBikes(res);
  };
  useEffect(() => {
    if (!context || !context.state.isLoggedIn || !context.state.username)
      return navigate('/login');
    document.title = 'LAC | Employee';

    swipeInputRef.current?.focus();

    fetchCheckouts(context.state.username);
    fetchBikes(context.state.username);
  }, [context, navigate, swipeInputRef]);

  useEffect(() => {
    const handleBodyClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).matches('input, select, textarea, button'))
        swipeInputRef.current?.focus();
    };

    swipeInputRef.current?.focus();

    document.body.addEventListener('click', handleBodyClick);

    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, []);

  if (!context || !context.state.isLoggedIn) {
    return <p>You must be logged in to access this page.</p>;
  }

  const handleSwipe = async (e: any) => {
    e.preventDefault();

    let rawSwipeData = swipeData.trim().replace(/^;?(\d{10})\D.*$/, '$1');

    let formattedSwipeData: string;

    if (/^\d{10}$/.test(rawSwipeData)) {
      formattedSwipeData = rawSwipeData;
    } else {
      formattedSwipeData = '0000000000';
    }
    const payload = {
      staff_name: context.state.username,
      student_id: formattedSwipeData
    };

    const data = await fetch(`${API_URL}/swipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then((response) => response.json());

    if (data.error) {
      alert(data.error);
      return;
    }
    setRecentSwipe({
      id:
        formattedSwipeData === '0000000000'
          ? 'Invalid Swipe'
          : formattedSwipeData,
      time: new Date().toLocaleTimeString(),
      banned: data.banned
    });

    setSwipeData('');
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleSwipe(e);
    }
  };

  const handleCheckoutChange = (
    key: string,
    field: keyof Checkout,
    value: any
  ) => {
    setCheckouts((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const handleBikeChange = (key: number, field: keyof Bike, value: any) => {
    setBikes((prev) => {
      const curr = prev[key];
      if (!curr) return prev;
      const up: Bike = { ...curr, [field]: value };

      return { ...prev, [key]: up };
    });
  };

  const handleHeadcountChange = (field: keyof Headcount, value: any) => {
    const numValue = Number(value);
    if (isNaN(numValue) && numValue < 0)
      setHeadcount({
        ...headcount,
        [field]: typeof field === 'boolean' ? false : 0
      });
    setHeadcount({ ...headcount, [field]: numValue });
  };

  const handleSubmitHeadcount = async () => {
    const res = await fetch(`${API_URL}/headcount`, {
      method: 'POST',
      body: JSON.stringify({
        staff_name: context.state.username,
        ...headcount
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((x) => x.json());

    if (res.error) {
      return alert(res.error);
    }

    setHeadcount(defaultHeadcount);
  };

  const handleCheckoutEquipment = async (key: string) => {
    const checkout = checkouts[key];
    if (
      !checkout ||
      !checkout.student_id ||
      !checkout.email ||
      !checkout.student_name
    ) {
      return alert(
        'Missing fields, please fill all the details before checking out'
      );
    }

    const { student_id, email, student_name } = checkout;
    const res = await fetch(`${API_URL}/checkout`, {
      method: 'POST',
      body: JSON.stringify({
        staff_name: context.state.username,
        equipment_type: key,
        student_id,
        email,
        student_name,
        update_type: 'rent'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((x) => x.json());

    if (res.error) {
      return alert(res.error);
    }

    setCheckouts({
      ...checkouts,
      [key]: {
        rented: true,
        email,
        student_id,
        student_name,
        time_checked_out: new Date(
          Number(res.time_checked_out)
        ).toLocaleTimeString(),
        rented_staff: context.state.username!
      }
    });
  };

  const handleReturnEquipment = async (key: any) => {
    if (!checkouts[key]) return;

    const res = await fetch(`${API_URL}/checkout`, {
      method: 'POST',
      body: JSON.stringify({
        staff_name: context.state.username,
        equipment_type: key,
        update_type: 'return'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((x) => x.json());

    if (res.error) {
      return alert(res.error);
    }
    setCheckouts({
      ...checkouts,
      [key]: {
        rented: false,
        email: '',
        student_id: '',
        student_name: '',
        time_checked_out: '',
        rented_staff: ''
      }
    });
  };

  const handleCheckoutBike = async (key: number) => {
    const bike = bikes[key];
    if (
      !bike ||
      !bike.student_id ||
      !bike.email ||
      !bike.student_name ||
      !bike.lock
    ) {
      return alert(
        'Missing fields, please fill all the details before checking out'
      );
    }

    const { student_id, email, student_name, lock } = bike;
    const res = await fetch(`${API_URL}/bikes`, {
      method: 'POST',
      body: JSON.stringify({
        staff_name: context.state.username,
        student_id,
        email,
        student_name,
        update_type: 'rent',
        bike_number: key,
        lock
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((x) => x.json());

    if (res.error) {
      return alert(res.error);
    }

    setBikes({
      ...bikes,
      [key]: {
        rented: true,
        date_due: res.date_due,
        email,
        student_id,
        student_name,
        time_checked_out: res.time_checked_out,
        rented_staff: context.state.username!,
        renews: 0,
        lock
      }
    });
  };

  const handleReturnBike = async (key: any) => {
    const bike = bikes[key];
    if (!bike) {
      return alert(
        'Missing fields, please fill all the details before checking out'
      );
    }
    const res = await fetch(`${API_URL}/bikes`, {
      method: 'POST',
      body: JSON.stringify({
        staff_name: context.state.username,
        update_type: 'return',
        bike_number: key
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((x) => x.json());

    if (res.error) {
      return alert(res.error);
    }

    setBikes({
      ...bikes,
      [key]: {
        rented: false,
        date_due: '',
        email: '',
        student_id: '',
        student_name: '',
        time_checked_out: '',
        rented_staff: '',
        renews: 0,
        lock: ''
      }
    });
  };

  const handleRenewBike = async (key: any) => {
    const bike = bikes[key];
    if (!bike) {
      return alert(
        'Missing fields, please fill all the details before checking out'
      );
    }
    const res = await fetch(`${API_URL}/bikes`, {
      method: 'POST',
      body: JSON.stringify({
        staff_name: context.state.username,
        update_type: 'renew',
        bike_number: key
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((x) => x.json());

    if (res.error) {
      return alert(res.error);
    }
    setBikes({
      ...bikes,
      [key]: {
        ...bike,
        renews: bike.renews + 1,
        date_due: res.date_due
      }
    });
  };

  return (
    <CustomContainer>
      <Row className='justify-content-md-center'>
        <Col sm={12}>
          <Container>
            <H2>Swipe In</H2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Most Recent Swipe ID</th>
                  <th>Time</th>
                  <th>Banned?</th>
                </tr>
              </thead>
              <tbody>
                {recentSwipe ? (
                  <tr>
                    <td>{recentSwipe.id}</td>
                    <td>{recentSwipe.time}</td>
                    <td>{recentSwipe.banned ? 'YES!' : 'No'}</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={2}>No recent swipes</td>
                  </tr>
                )}
                <tr>
                  <td colSpan={1}>
                    <Form onSubmit={handleSwipe}>
                      <Form.Group controlId='formSwipeInput' className='mb-2'>
                        <Form.Control
                          type='text'
                          placeholder='Enter Swipe ID and press Enter'
                          value={swipeData}
                          onChange={(e) => setSwipeData(e.currentTarget.value)}
                          onKeyDown={handleKeyPress}
                          ref={swipeInputRef}
                        />
                      </Form.Group>
                      <Button variant='primary' type='submit'>
                        Record Swipe
                      </Button>
                    </Form>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Container>
        </Col>
      </Row>
      <Row className='justify-content-md-center'>
        <Col sm={12}>
          {/* Equipment Checkouts Table */}
          <H2>Equipment Checkouts</H2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Email</th>
                <th>Time Checked Out</th>
                <th>Rented By</th>
                <th>Actions</th> {/* For modifications */}
              </tr>
            </thead>
            <tbody>
              {checkouts &&
                Object.entries(checkouts).map(([key, checkout]) =>
                  !checkout.rented ? (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>
                        <Form.Control
                          type='text'
                          value={checkout.student_name || ''}
                          onChange={(e) =>
                            handleCheckoutChange(
                              key,
                              'student_name',
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type='text'
                          value={checkout.student_id || ''}
                          onChange={(e) =>
                            handleCheckoutChange(
                              key,
                              'student_id',
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type='text'
                          value={checkout.email || ''}
                          onChange={(e) =>
                            handleCheckoutChange(key, 'email', e.target.value)
                          }
                        />
                      </td>
                      <td>Now</td>
                      <td>{context.state.username} (You)</td>
                      <td>
                        <Button
                          variant='success'
                          onClick={() => handleCheckoutEquipment(key)}>
                          Check Out
                        </Button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{checkout.student_name}</td>
                      <td>{checkout.student_id}</td>
                      <td>{checkout.email}</td>
                      <td>{checkout.time_checked_out}</td>
                      <td>{checkout.rented_staff}</td>

                      <td>
                        <Button
                          variant='warning'
                          onClick={() => handleReturnEquipment(key)}>
                          Return
                        </Button>
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className='justify-content-md-center'>
        <Col sm={12}>
          {/* Bikes Table */}
          <H2>Bikes</H2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: '5px' }}>Bike Number</th>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Email</th>
                <th>Bike Lock</th>
                <th>Day Checked Out</th>
                <th>Date Due</th>
                <th>Rented By</th>
                <th>Renews</th>
                <th>Actions</th> {/* For modifications */}
              </tr>
            </thead>
            <tbody>
              {bikes &&
                Object.entries(bikes).map(([key, bike]) =>
                  !bike.rented ? (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>
                        <Form.Control
                          type='text'
                          value={bike.student_name || ''}
                          onChange={(e) =>
                            handleBikeChange(
                              Number(key),
                              'student_name',
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type='text'
                          value={bike.student_id || ''}
                          onChange={(e) =>
                            handleBikeChange(
                              Number(key),
                              'student_id',
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type='text'
                          value={bike.email || ''}
                          onChange={(e) =>
                            handleBikeChange(
                              Number(key),
                              'email',
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type='text'
                          value={bike.lock || ''}
                          onChange={(e) =>
                            handleBikeChange(
                              Number(key),
                              'lock',
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>Now</td>

                      <td>
                        {new Date(Date.now() + 86400000).toLocaleDateString()}
                      </td>

                      <td>{context.state.username} (You)</td>
                      <td>{bike.renews}</td>
                      <td>
                        {/* Placeholder for action buttons (e.g., return bike) */}
                        <Button
                          variant='success'
                          onClick={() => handleCheckoutBike(Number(key))}>
                          Check Out
                        </Button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={key}>
                      <td style={{ width: '5px' }}> {key}</td>
                      <td>{bike.student_name}</td>
                      <td>{bike.student_id}</td>
                      <td>{bike.email}</td>
                      <td>{bike.lock}</td>
                      <td>{bike.time_checked_out}</td>
                      <td>{bike.date_due}</td>
                      <td>{bike.rented_staff}</td>
                      <td>{bike.renews}</td>
                      <td>
                        <div className='d-flex justify-content-around'>
                          <Button
                            variant='warning'
                            onClick={() => handleReturnBike(Number(key))}
                            className='me-2'>
                            Return
                          </Button>
                          <Button
                            variant='info'
                            onClick={() => handleRenewBike(Number(key))}>
                            Renew
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className='justify-content-md-center'>
        <Col sm={12}>
          {/* Bikes Table */}
          <H2>Headcount</H2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Room</th>
                <th>Count</th>
                <th>Reserved</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Weight Room</th>
                <th>
                  <Form.Control
                    type='text'
                    value={headcount.weight_room}
                    onChange={(e) =>
                      handleHeadcountChange('weight_room', e.target.value)
                    }
                  />
                </th>
                <th>
                  <Form.Check
                    type='checkbox'
                    checked={headcount.weight_reserved}
                    onChange={(e) =>
                      handleHeadcountChange('weight_reserved', e.target.checked)
                    }
                  />
                </th>
              </tr>
              <tr>
                <th>Gym</th>
                <th>
                  <Form.Control
                    type='text'
                    value={headcount.gym}
                    onChange={(e) =>
                      handleHeadcountChange('gym', e.target.value)
                    }
                  />
                </th>
                <th>
                  <Form.Check
                    type='checkbox'
                    checked={headcount.gym_reserved}
                    onChange={(e) =>
                      handleHeadcountChange('gym_reserved', e.target.checked)
                    }
                  />
                </th>
              </tr>
              <tr>
                <th>Aerobics Room</th>
                <th>
                  <Form.Control
                    type='text'
                    value={headcount.aerobics_room}
                    onChange={(e) =>
                      handleHeadcountChange('aerobics_room', e.target.value)
                    }
                  />
                </th>
                <th>
                  <Form.Check
                    type='checkbox'
                    checked={headcount.aerobics_reserved}
                    onChange={(e) =>
                      handleHeadcountChange(
                        'aerobics_reserved',
                        e.target.checked
                      )
                    }
                  />
                </th>
              </tr>
              <tr>
                <th>Lobby</th>
                <th>
                  <Form.Control
                    type='text'
                    value={headcount.lobby}
                    onChange={(e) =>
                      handleHeadcountChange('lobby', e.target.value)
                    }
                  />
                </th>
              </tr>
            </tbody>
          </Table>
          <Button variant='success' onClick={handleSubmitHeadcount}>
            Submit
          </Button>
        </Col>
      </Row>
    </CustomContainer>
  );
};

export { Employee };

type SwipeData = {
  id: string;
  time: string;
  banned: boolean;
};

type Checkout = {
  rented: boolean;
  student_name: string;
  student_id: string;
  email: string;
  time_checked_out: string;
  rented_staff: string;
};

type CheckoutData = {
  [key: string]: Checkout;
};

type Bike = {
  rented: boolean;
  rented_staff: string;
  time_checked_out: string;
  student_name: string;
  student_id: string;
  email: string;
  date_due: string;
  renews: number;
  lock: string;
};
type BikeData = {
  [key: number]: Bike;
};

type Headcount = {
  weight_room: number;
  gym: number;
  aerobics_room: number;
  lobby: number;
  weight_reserved: boolean;
  gym_reserved: boolean;
  aerobics_reserved: boolean;
};
