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

const options = {
  plugins: {
    legend: {
      display: false // Hide legend
    },
    title: {
      display: false // Hide title
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
    headcount_last_updated: '',
    weightRoom: { count: 0, data: [] },
    gym: { count: 0, data: [] },
    aerobics: { count: 0, data: [] },
    lobby: { count: 0, data: [] },
    checkout: {},
    bikes: {},
    bikeUpdate: '',
    checkoutUpdate: ''
  });
  const [data, setData] = useState<DataState>(defaultState);

  useEffect(() => {
    console.log(occupancy);
    if (!occupancy) return;
    setData({
      weight_room: {
        labels: occupancy?.weightRoom?.data.map((point) => point.time),
        datasets: [
          {
            label: '',
            data: occupancy?.weightRoom?.data.map((x) => x.count),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      },
      gym: {
        labels: occupancy?.gym.data.map((point) => point.time),
        datasets: [
          {
            label: '',
            data: occupancy?.gym.data.map((x) => x.count),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      },
      aerobics_room: {
        labels: occupancy?.aerobics.data.map((point) => point.time),
        datasets: [
          {
            label: '',
            data: occupancy?.aerobics.data.map((x) => x.count),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      },
      lobby: {
        labels: occupancy?.lobby.data.map((point) => point.time),
        datasets: [
          {
            label: '',
            data: occupancy?.lobby.data.map((x) => x.count),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      }
    });
  }, [occupancy]);

  useEffect(() => {
    document.title = 'LAC | Home';
    const updateData = async () => {
      try {
        var res = await fetch(API_URL).then((x) => x.json());
      } catch (e) {
        return <p>Server could not be reached</p>;
      }
      if (res.error) {
        return <p>{res.error}</p>;
      }
      setOccupancy(res as Res);
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
  return (
    <>
      <Container style={{ padding: '30px 1%' }}>
        {/* Weight Room Occupancy */}
        <Row>
          <Col sm={12} md={6}>
            <CustomContainer>
              <H2>Weight Room Occupancy - {occupancy?.weightRoom?.count}</H2>
              <p>
                Currently reserved:
                {occupancy?.weightRoom?.reserved ? 'Yes' : 'No'}
              </p>
              <Line data={data?.weight_room} options={options} />{' '}
              {/* Adapt data for Weight Room */}
              <p>Last updated: {occupancy?.headcount_last_updated}</p>
            </CustomContainer>
          </Col>

          <Col sm={12} md={6}>
            {/* Gym Occupancy */}
            <CustomContainer>
              <H2>Gym Occupancy - {occupancy?.gym.count}</H2>
              <p>
                Currently reserved: {occupancy?.gym.reserved ? 'Yes' : 'No'}
              </p>
              <Line data={data.gym} options={options} />{' '}
              {/* Adapt data for Weight Room */}
              <p>Last updated: {occupancy?.headcount_last_updated}</p>
            </CustomContainer>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            {/* Aerobics Room Occupancy */}
            <CustomContainer>
              <H2>Aerobics Room Occupancy - {occupancy?.aerobics.count}</H2>
              <p>
                Currently reserved:{' '}
                {occupancy?.aerobics.reserved ? 'Yes' : 'No'}
              </p>
              <Line data={data.aerobics_room} options={options} />{' '}
              {/* Adapt data for Weight Room */}
              <p>Last updated: {occupancy?.headcount_last_updated}</p>
            </CustomContainer>
          </Col>
          <Col sm={12} md={6}>
            {/* Lobby Room Occupancy */}
            <CustomContainer>
              <H2>Lobby Occupancy - {occupancy?.lobby.count}</H2>
              <Line data={data.aerobics_room} options={options} />{' '}
              {/* Adapt data for Weight Room */}
              <p>Last updated: {occupancy?.headcount_last_updated}</p>
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
              {occupancy?.checkout &&
                Object.keys(occupancy?.checkout).map((key) => {
                  const item = occupancy!.checkout[key];
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
          <p>Last updated: {occupancy?.checkoutUpdate || 'N/A'}</p>
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
              {occupancy?.bikes &&
                Object.keys(occupancy?.bikes).map((key: string) => {
                  const item = occupancy!.bikes[key];
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
          <p>Last updated: {occupancy?.bikeUpdate || 'N/A'}</p>
        </CustomContainer>
      </Container>
    </>
  );
};

export { Home };

const defaultState = {
  weight_room: {
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  },
  gym: {
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  },
  aerobics_room: {
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  },
  lobby: {
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }
};

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

type DataState = {
  weight_room: Data;
  gym: Data;
  aerobics_room: Data;
  lobby: Data;
};

type Occupancy = Res;

type Res = {
  headcount_last_updated: string;
  weightRoom: Room;
  gym: Room;
  aerobics: Room;
  lobby: Room;
  checkout: {
    // [key: string]: { number: number; checked_out_for: string } | false;
    [key: string]: any;
  };
  bikes: {
    [key: string]: any;
  };
  bikeUpdate: string;
  checkoutUpdate: string;
};
type Room = { reserved?: boolean; count: number; data: Occ[] };

type Occ = { time: string; count: number };
