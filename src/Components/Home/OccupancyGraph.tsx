import React from 'react';
import { Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
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

import { H2, CustomContainer } from '../';

import { RoomData } from '../../Pages/Home';

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

type OccProps = {
  room: RoomData;
  room_name: string;
  headcount_labels: string[];
  last_updated: string;
};

export const OccupancyGraph: React.FC<OccProps> = ({
  room,
  room_name,
  headcount_labels,
  last_updated
}) => {
  const { data, reserved, count } = room;
  const getData = (): Data => {
    return {
      labels: headcount_labels,
      datasets: [
        {
          label: '',
          data: data,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
  };
  const reserve = `Currently reserved: ${reserved ? 'Yes' : 'No'}`;
  return (
    <Col sm={12} md={6}>
      <CustomContainer>
        <H2>
          {room_name} Occupancy - {count}
        </H2>
        {reserved !== undefined && <p>{reserve}</p>}
        <Line data={getData()} options={options} />{' '}
        <p>Last updated: {last_updated}</p>
      </CustomContainer>
    </Col>
  );
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
