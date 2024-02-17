import React, { useContext, useState } from 'react';

import { Button, Col, Form, Row, Table } from 'react-bootstrap';

import { AppContext } from '../../Contexts/AppContext';
import { H2 } from '..';

import { API_URL } from '../..';

const defaultHeadcount: Headcount = {
  weight_room: 0,
  gym: 0,
  aerobics_room: 0,
  lobby: 0,
  weight_reserved: false,
  gym_reserved: false,
  aerobics_reserved: false
};

export const Headcount = () => {
  const context = useContext(AppContext)!;
  const [headcount, setHeadcount] = useState<Headcount>(defaultHeadcount);
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
  return (
    <>
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
    </>
  );
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
