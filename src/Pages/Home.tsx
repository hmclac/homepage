import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
// import 'chartjs-adapter-luxon';

import { API_URL } from '..';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const options: any = {
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
        // callback: (x: number) => Math.round(x)
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    }
  }
};

export const CustomContainer = styled(Container)`
  background-color: #f8f9fa; // Mimic Jumbotron's light grey background
  padding: 2rem;
  margin-bottom: 20px;
  border-radius: 0.3rem;
`;

export const H2 = styled.h2`
  text-align: center;
`;

const Home = () => {
  const [occupancy, setOccupancy] = useState<Occupancy>({
    headcount_labels: [],
    weightRoom: { reserved: false, count: 0, data: [] },
    gym: { reserved: false, count: 0, data: [] },
    aerobics: { reserved: false, count: 0, data: [] },
    lobby: { count: 0, data: [] },
    checkout: {},
    bikes: {},
    bikeUpdate: '',
    checkoutUpdate: ''
  });

  useEffect(() => {
    document.title = 'LAC | Home';
    const updateData = async () => {
      try {
        const res = await fetch(API_URL).then((x) => x.json());
        console.log(res);
        if (res.error) {
          console.error(res.error);
          return;
        }
        setOccupancy(res);
      } catch (e) {
        console.error('Server could not be reached');
      }
    };
    updateData();
  }, []);

  if (!occupancy) {
    return (
      <>
        <p>Loading...</p>
      </>
    );
  }

  const {
    headcount_labels,
    weightRoom,
    gym,
    aerobics,
    lobby,
    checkout,
    checkoutUpdate,
    bikes,
    bikeUpdate
  } = occupancy;

  const lastUpdated = headcount_labels[headcount_labels.length - 1];

  const getData = (occ: RoomData): Data => {
    return {
      labels: headcount_labels,
      datasets: [
        {
          label: '',
          data: occ.data,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
  };

  return (
    <>
      <Container style={{ padding: '30px 1%' }}>
        {/* Weight Room Occupancy */}
        <Row>
          <Col sm={12} md={6}>
            <CustomContainer>
              <H2>Weight Room Occupancy - {weightRoom.count}</H2>
              <p>Currently reserved: {weightRoom.reserved ? 'Yes' : 'No'}</p>
              <Line data={getData(weightRoom)} options={options} />{' '}
              {/* Adapt data for Weight Room */}
              <p>Last updated: {lastUpdated}</p>
            </CustomContainer>
          </Col>

          <Col sm={12} md={6}>
            {/* Gym Occupancy */}
            <CustomContainer>
              <H2>Gym Occupancy - {gym.count}</H2>
              <p>Currently reserved: {gym.reserved ? 'Yes' : 'No'}</p>
              <Line data={getData(gym)} options={options} />{' '}
              {/* Adapt data for Weight Room */}
              <p>Last updated: {lastUpdated}</p>
            </CustomContainer>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            {/* Aerobics Room Occupancy */}
            <CustomContainer>
              <H2>Aerobics Room Occupancy - {aerobics.count}</H2>
              <p>Currently reserved: {aerobics.reserved ? 'Yes' : 'No'}</p>
              <Line data={getData(aerobics)} options={options} />{' '}
              {/* Adapt data for Weight Room */}
              <p>Last updated: {lastUpdated}</p>
            </CustomContainer>
          </Col>
          <Col sm={12} md={6}>
            {/* Lobby Room Occupancy */}
            <CustomContainer>
              <H2>Lobby Occupancy - {lobby.count}</H2>
              <Line data={getData(lobby)} options={options} />{' '}
              {/* Adapt data for Weight Room */}
              <p>Last updated: {lastUpdated}</p>
            </CustomContainer>
          </Col>
        </Row>

        {/* Equipment Availability Table */}
        <CustomContainer>
          <h2>Equipment Availability</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Checked Out For</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {checkout &&
                Object.keys(checkout).map((key) => {
                  const item = checkout[key];
                  return (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{item ? item.checked_out_for : 'N/A'}</td>
                      <td>{item ? 'Unavailable' : 'Available'}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          <p>Last updated: {checkoutUpdate || 'N/A'}</p>
        </CustomContainer>
        {/* Equipment Availability Table */}
        <CustomContainer>
          <h2>Mudderbike Availability</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Bike Number</th>
                <th>Checked Out Since</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {bikes &&
                Object.keys(bikes).map((key: string) => {
                  const item = bikes[key];
                  return (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>
                        {item
                          ? new Date(
                              Number(item.checked_out_for)
                            ).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td>{item ? 'Unavailable' : 'Available'}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          <p>Last updated: {bikeUpdate || 'N/A'}</p>
        </CustomContainer>
      </Container>
    </>
  );
};

export { Home };

type Data = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    tension: number;
  }[];
};

type Occupancy = {
  headcount_labels: string[];
  weightRoom: RoomData;
  gym: RoomData;
  aerobics: RoomData;
  lobby: RoomData;
  checkout: {
    [key: string]: any;
  };
  bikes: {
    [key: string]: any;
  };
  bikeUpdate: string;
  checkoutUpdate: string;
};

type RoomData = {
  reserved?: boolean;
  count: number;
  data: number[];
};
