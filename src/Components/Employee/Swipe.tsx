import React, { useContext, useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';

import { AppContext } from '../../Contexts/AppContext';
import { H2 } from '../';

import { API_URL } from '../..';

type SwipeProps = {
  swipeInputRef: React.RefObject<HTMLInputElement>;
};

export const Swipe: React.FC<SwipeProps> = ({ swipeInputRef }) => {
  const context = useContext(AppContext)!;
  const [swipeData, setSwipeData] = useState<string>('');
  const [recentSwipe, setRecentSwipe] = useState<SwipeData | null>(null);
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

  return (
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
  );
};

type SwipeData = {
  id: string;
  time: string;
  banned: boolean;
};
