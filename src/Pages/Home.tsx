import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';

import { OccupancyGraph } from '../Components/Home/OccupancyGraph';
import { Table, TableContainer } from '../Components/Home/Table';
import { CC, CustomContainer } from '../Components';

import { API_URL } from '..';

const Home = () => {
  const [occupancy, setOccupancy] = useState<Occupancy | null>({
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
        if (res.error) {
          console.error(res.error);
          setOccupancy(null);
          return;
        }
        setOccupancy(res);
      } catch (e) {
        console.error('Server could not be reached');
        setOccupancy(null);
        return;
      }
    };
    updateData();
    setInterval(() => {
      updateData();
      console.log('Refreshed!');
    }, 60000);
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

  return (
    <CC>
      <Row>
        <OccupancyGraph
          room={weightRoom}
          room_name='Weight Room'
          headcount_labels={headcount_labels}
          last_updated={lastUpdated}
        />
        <OccupancyGraph
          room={gym}
          room_name='Gym'
          headcount_labels={headcount_labels}
          last_updated={lastUpdated}
        />
      </Row>
      <Row>
        <OccupancyGraph
          room={aerobics}
          room_name='Aerobics Room'
          headcount_labels={headcount_labels}
          last_updated={lastUpdated}
        />
        <OccupancyGraph
          room={lobby}
          room_name='Lobby'
          headcount_labels={headcount_labels}
          last_updated={lastUpdated}
        />
      </Row>

      <CustomContainer>
        <TableContainer>
          <h2>Equipment Availability</h2>
          <Table hover responsive='sm'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Checked Out For</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(checkout).map((key) => {
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
        </TableContainer>
      </CustomContainer>
      {/* Equipment Availability Table */}
      <CustomContainer>
        <h2>Mudderbike Availability</h2>
        <Table hover responsive='sm'>
          <thead>
            <tr>
              <th>Bike Number</th>
              <th>Checked Out Since</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(bikes).map((key: string) => {
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
    </CC>
  );
};

export { Home };

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

export type RoomData = {
  reserved?: boolean;
  count: number;
  data: number[];
};
