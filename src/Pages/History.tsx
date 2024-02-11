import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { API_URL } from '../';
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
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const History = () => {
  // Change the state to use Date objects
  const [data, setData] = useState<DataType>({ data: [], labels: [] });
  const [start, setStart] = useState<Date>(new Date(Date.now() - 86400000 * 7));
  const [end, setEnd] = useState<Date>(new Date());

  const options = {
    plugins: {
      legend: {
        display: false // Hide legend
      },
      title: {
        display: true, // Display title
        text: `Swipe Data`, // Chart title
        padding: {
          top: 10,
          bottom: 30
        },
        font: {
          size: 20
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Dates', // X axis label
          font: {
            size: 15
          },
          padding: { top: 20, bottom: 0 }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Swipes', // Y axis label
          font: {
            size: 15
          },
          padding: { top: 0, bottom: 10 }
        },
        beginAtZero: true // Optional: if you want the Y axis to begin at zero
      }
    }
  };

  useEffect(() => {
    document.title = 'LAC | History';
    const fetchData = async () => {
      // Use the Date objects to get timestamps or suitable format for your API
      const startTimestamp = start.getTime();
      const endTimestamp = end.getTime();

      try {
        const response = await fetch(
          `${API_URL}/history?date_start=${startTimestamp}&date_end=${endTimestamp}`
        );
        const res = await response.json();
        if (!res.error) {
          setData(res);
        } else {
          console.error(res.error);
        }
      } catch (e) {
        console.error('Server could not be reached');
      }
    };
    fetchData();
  }, [start, end]);

  return (
    <Container>
      <Row className='justify-content-center mb-3'>
        <Col md={3}>
          <ReactDatePicker
            selected={start}
            onChange={(date: Date | null) => date && setStart(date)} // Ensure date is not null before updating state
            selectsStart
            startDate={start}
            endDate={end}
            dateFormat='MMMM d, yyyy'
            isClearable
          />
        </Col>
        <Col md={3}>
          <ReactDatePicker
            selected={end}
            onChange={(date: Date | null) => date && setEnd(date)} // Ensure date is not null before updating state
            selectsEnd
            startDate={start}
            endDate={end}
            minDate={start}
            dateFormat='MMMM d, yyyy'
            isClearable
          />
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col md={6}>
          <Line
            data={{
              datasets: [
                {
                  label: '',
                  data: data.data,
                  fill: false,
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1
                }
              ],
              labels: data.labels
            }}
            options={options}></Line>
        </Col>
      </Row>
    </Container>
  );
};

type DataType = {
  data: number[];
  labels: string[];
};

// Adjust other necessary types and logic as before
