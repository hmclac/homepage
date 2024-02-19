import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';

import { AppContext } from '../../Contexts/AppContext';
import { H2 } from '..';

import { API_URL } from '../..';

export const Equipment = () => {
  const context = useContext(AppContext)!;
  const [checkouts, setCheckouts] = useState<CheckoutData>({});

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

  useEffect(() => {
    fetchCheckouts(context.state.username!);
    setInterval(() => {
      fetchCheckouts(context.state.username!);
    }, 60000);
  }, []);

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
  return (
    <>
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
    </>
  );
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
