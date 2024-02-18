import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { CC } from '../Components';

export const NotFound = () => {
  return (
    <CC>
      <Row className='justify-content-center'>
        <Col md={6}>
          <Card className='text-center mt-5'>
            <Card.Header as='h5'>Page Not Found</Card.Header>
            <Card.Body>
              <Card.Text>
                Error 404: The page you are looking for does not exist.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </CC>
  );
};
