import React, { useEffect, useState } from 'react';

import { Row, Col, Form } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
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

import { styled } from 'styled-components';

import { DateTime } from 'luxon';

import 'react-datepicker/dist/react-datepicker.css';

import { Colors } from '../App';

import { API_URL } from '../..';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const Swipe = () => {
  const [data, setData] = useState<DataType>({ data: [], labels: [] });
  const [startDate, setStartDate] = useState<DateTime>(
    // DateTime.now().minus({ days: 7 }).startOf('day')
    DateTime.now().startOf('day')
  );
  const [endDate, setEndDate] = useState<DateTime>(DateTime.now().endOf('day'));
  const [range, setRange] = useState<boolean>(false);

  const options = {
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `Swipe Data`,
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
          text: 'Dates',
          font: {
            size: 15
          },
          padding: { top: 20, bottom: 0 }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Swipes',
          font: {
            size: 15
          },
          padding: { top: 0, bottom: 10 }
        },
        beginAtZero: true
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const startTimestamp = startDate.toJSDate().getTime();
      const endTimestamp = endDate.toJSDate().getTime();

      try {
        const endTime = range ? `&date_end=${endTimestamp}` : '';
        const response = await fetch(
          `${API_URL}/stats/swipes?date_start=${startTimestamp}&range=${range}${endTime}`
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
  }, [startDate, endDate, range]);

  const handleDateChange = (newDate: Date | null, isStartDate: boolean) => {
    if (newDate) {
      const luxonDate = DateTime.fromJSDate(newDate);
      if (isStartDate) {
        setStartDate(luxonDate.startOf('day'));
      } else {
        setEndDate(luxonDate.endOf('day'));
      }
    }
  };
  return (
    <>
      <Row className='justify-content-center mb-3'>
        <Col md={3}>
          <Form.Select
            aria-label='Select range'
            value={range ? 'range' : 'day'}
            style={{ backgroundColor: Colors.LIGHT, color: Colors.DARK }}
            onChange={(e) => {
              setRange(e.target.value === 'range');
            }}>
            <option value='range'>Range</option>
            <option value='day'>Day</option>
          </Form.Select>
        </Col>

        <Col md={3}>
          <ReactDatePicker
            selected={startDate.toJSDate()}
            onChange={(date: Date) => handleDateChange(date, true)}
            selectsStart
            startDate={startDate.toJSDate()}
            endDate={endDate.toJSDate()}
            dateFormat='MMMM d, yyyy'
            isClearable
          />
        </Col>
        {range && (
          <Col md={3}>
            <ReactDatePicker
              selected={endDate.toJSDate()}
              onChange={(date: Date) => handleDateChange(date, false)}
              selectsEnd
              startDate={startDate.toJSDate()}
              endDate={endDate.toJSDate()}
              minDate={startDate.toJSDate()}
              dateFormat='MMMM d, yyyy'
              isClearable
            />
          </Col>
        )}
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
            options={options}
          />
        </Col>
      </Row>
    </>
  );
};
type DataType = {
  data: number[];
  labels: string[];
};
