import React, { useContext, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import { AppContext } from '../Contexts/AppContext';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

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
      display: false, // Hide legend
    },
    title: {
      display: false, // Hide title
    },
  },
};

const CustomContainer = styled(Container)`
  background-color: #f8f9fa; // Mimic Jumbotron's light grey background
  padding: 2rem;
  margin-bottom: 20px;
  border-radius: 0.3rem;
`;

const Home = () => {
  const context = useContext(AppContext);

  useEffect(() => {
    if (context) {
      document.title = 'LAC | Home';
    }
  }, [context]);

  if (!context) {
    return null;
  }

  // Chart.js data setup remains the same
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: '',
        data: [65, 59, 80, 81, 56, 55, 40], // Adapt with your state data
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Container style={{ padding: '30px 1%' }}>
      {/* Weight Room Occupancy */}
      <CustomContainer>
        <h2>Weight Room Occupancy</h2>
        <p>
          Currently reserved:{' '}
          {context.state.occupancy?.weightRoom.reserved ? 'Yes' : 'No'}
        </p>
        <p>Number of people: {context.state.occupancy?.weightRoom.count}</p>
        <Line data={data} options={options} />{' '}
        {/* Adapt data for Weight Room */}
        <p>Last updated: {context.state.occupancy?.weightRoom.lastUpdated}</p>
      </CustomContainer>

      {/* Gym Occupancy */}
      <CustomContainer>
        <h2>Gym Occupancy</h2>
        <p>
          Currently reserved:{' '}
          {context.state.occupancy?.gym.reserved ? 'Yes' : 'No'}
        </p>
        <p>Number of people: {context.state.occupancy?.gym.count}</p>
        <Line data={data} options={options} /> {/* Adapt data for Weight Room */}
        <p>Last updated: {context.state.occupancy?.gym.lastUpdated}</p>
      </CustomContainer>

      {/* Aerobics Room Occupancy */}
      <CustomContainer>
        <h2>Aerobics Room Occupancy</h2>
        <p>
          Currently reserved:{' '}
          {context.state.occupancy?.aerobics.reserved ? 'Yes' : 'No'}
        </p>
        <p>Number of people: {context.state.occupancy?.aerobics.count}</p>
        <Line data={data} options={options} /> {/* Adapt data for Weight Room */}
        <p>Last updated: {context.state.occupancy?.aerobics.lastUpdated}</p>
      </CustomContainer>

      {/* Equipment Availability */}
      <CustomContainer>
        <h2>Equipment Availability</h2>
        <p>
          Pool 1: {context.state.occupancy?.equipment.pool1 ? 'Taken' : 'Free'}
        </p>
        <p>
          Pool 2: {context.state.occupancy?.equipment.pool2 ? 'Taken' : 'Free'}
        </p>
        <p>
          Ping Pong 1:{' '}
          {context.state.occupancy?.equipment.pingpong1 ? 'Taken' : 'Free'}
        </p>
        <p>
          Ping Pong 2:{' '}
          {context.state.occupancy?.equipment.pingpong2 ? 'Taken' : 'Free'}
        </p>
        <p>
          Basketballs - Free:{' '}
          {context.state.occupancy?.equipment.basketballs.available}, Taken:{' '}
          {context.state.occupancy?.equipment.basketballs.taken}
        </p>
        <p>Last updated: {context.state.occupancy?.equipment.lastUpdated}</p>
      </CustomContainer>
    </Container>
  );
};

export { Home };
