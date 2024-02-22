import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback
} from 'react';

import { Button, Col, Form, Row, Table } from 'react-bootstrap';

import { AppContext } from '../../Contexts/AppContext';
import { H2 } from '..';

import { API_URL } from '../..';

export const Bike = () => {
  const context = useContext(AppContext)!;
  const [bikes, setBikes] = useState<BikeData>({});
  const [bikeNotes, setBikeNotes] = useState<BikeNotes[]>([]);

  const fetchBikes = async (username: string) => {
    const res = await fetch(`${API_URL}/bikes`, {
      body: JSON.stringify({
        staff_name: username
      }),
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json'
      }
    }).then((x) => x.json());

    if (res.error) {
      return console.log(res.error);
    }

    setBikes(res);
  };

  const fetchBikeNotes = async (username: string) => {
    const res = await fetch(`${API_URL}/bikenotes?staff_name=${username}`).then(
      (x) => x.json()
    );

    if (res.error) {
      return console.log(res.error);
    }

    setBikeNotes(res);
  };

  const debounceTimeoutRef = useRef<Record<number, NodeJS.Timeout>>({});

  const debounceBikeNotesUpdate = (bike_number: number, notes: string) => {
    if (debounceTimeoutRef.current[bike_number]) {
      clearTimeout(debounceTimeoutRef.current[bike_number]);
    }

    debounceTimeoutRef.current[bike_number] = setTimeout(() => {
      handleUpdateBikenotes(bike_number.toString(), notes);
    }, 5000);
  };

  const handleBikeNotesChange = useCallback(
    (bike_number: number, notes: string) => {
      setBikeNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.bike_number === bike_number ? { ...note, notes } : note
        )
      );

      debounceBikeNotesUpdate(bike_number, notes);
    },
    [setBikeNotes, debounceBikeNotesUpdate, debounceTimeoutRef]
  );

  const handleUpdateBikenotes = async (bike_number: string, notes: string) => {
    const res = await fetch(`${API_URL}/bikenotes`, {
      method: 'POST',
      body: JSON.stringify({
        staff_name: context.state.username!,
        bike_number,
        notes
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((x) => x.json());

    if (res.error) {
      return alert(res.error);
    }

    setBikeNotes([
      ...bikeNotes.filter((x) => x.bike_number !== Number(bike_number)),
      res
    ]);
  };

  const handleBikeChange = (key: number, field: keyof Bike, value: any) => {
    setBikes((prev) => {
      const curr = prev[key];
      if (!curr) return prev;
      const up: Bike = { ...curr, [field]: value };

      return { ...prev, [key]: up };
    });
  };

  const handleCheckoutBike = async (key: number) => {
    const bike = bikes[key];
    if (
      !bike ||
      !bike.student_id ||
      !bike.email ||
      !bike.student_name ||
      !bike.lock
    ) {
      return alert(
        'Missing fields, please fill all the details before checking out'
      );
    }

    const { student_id, email, student_name, lock } = bike;
    const res = await fetch(`${API_URL}/bikes`, {
      method: 'POST',
      body: JSON.stringify({
        staff_name: context.state.username,
        student_id,
        email,
        student_name,
        update_type: 'rent',
        bike_number: key,
        lock
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((x) => x.json());

    if (res.error) {
      return alert(res.error);
    }

    setBikes({
      ...bikes,
      [key]: {
        rented: true,
        date_due: res.date_due,
        email,
        student_id,
        student_name,
        time_checked_out: res.time_checked_out,
        rented_staff: context.state.username!,
        renews: 0,
        lock
      }
    });
  };

  const handleReturnBike = async (key: any) => {
    const bike = bikes[key];
    if (!bike) {
      return alert(
        'Missing fields, please fill all the details before checking out'
      );
    }
    const res = await fetch(`${API_URL}/bikes`, {
      method: 'POST',
      body: JSON.stringify({
        staff_name: context.state.username,
        update_type: 'return',
        bike_number: key
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((x) => x.json());

    if (res.error) {
      return alert(res.error);
    }

    setBikes({
      ...bikes,
      [key]: {
        rented: false,
        date_due: '',
        email: '',
        student_id: '',
        student_name: '',
        time_checked_out: '',
        rented_staff: '',
        renews: 0,
        lock: ''
      }
    });
  };

  const handleRenewBike = async (key: any) => {
    const bike = bikes[key];
    if (!bike) {
      return alert(
        'Missing fields, please fill all the details before checking out'
      );
    }
    const res = await fetch(`${API_URL}/bikes`, {
      method: 'POST',
      body: JSON.stringify({
        staff_name: context.state.username,
        update_type: 'renew',
        bike_number: key
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((x) => x.json());

    if (res.error) {
      return alert(res.error);
    }
    setBikes({
      ...bikes,
      [key]: {
        ...bike,
        renews: bike.renews + 1,
        date_due: res.date_due
      }
    });
  };

  useEffect(() => {
    fetchBikes(context.state.username!);
    fetchBikeNotes(context.state.username!);
    setInterval(() => {
      fetchBikes(context.state.username!);
      fetchBikeNotes(context.state.username!);
    }, 60000);
  }, []);

  const BikeNotesInput = ({ bike_number }: { bike_number: number }) => {
    const [localNote, setLocalNote] = useState('');
    // Fetch the initial note from the global state
    useEffect(() => {
      const existingNote =
        bikeNotes.find((note) => note.bike_number === bike_number)?.notes || '';
      setLocalNote(existingNote);
    }, [bikeNotes, bike_number]);

    // Handle local changes and debounce the update to the global state
    const handleChange = (e: any) => {
      const newNote = e.target.value;
      setLocalNote(newNote);
      handleBikeNotesChange(bike_number, newNote);
    };

    return (
      <Form.Control type='text' value={localNote} onChange={handleChange} />
    );
  };

  return (
    <>
      <Row className='justify-content-md-center'>
        <Col sm={12}>
          {/* Bikes Table */}
          <H2>Bikes</H2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: '5px' }}>Bike Number</th>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Email</th>
                <th>Bike Lock</th>
                <th>Day Checked Out</th>
                <th>Date Due</th>
                <th>Rented By</th>
                <th>Renews</th>
                <th>Actions</th>
                <th>Bike Notes</th>
              </tr>
            </thead>
            <tbody>
              {bikes &&
                Object.entries(bikes).map(([key, bike]) =>
                  !bike.rented ? (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>
                        <Form.Control
                          type='text'
                          value={bike.student_name || ''}
                          onChange={(e) =>
                            handleBikeChange(
                              Number(key),
                              'student_name',
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type='text'
                          value={bike.student_id || ''}
                          onChange={(e) =>
                            handleBikeChange(
                              Number(key),
                              'student_id',
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type='text'
                          value={bike.email || ''}
                          onChange={(e) =>
                            handleBikeChange(
                              Number(key),
                              'email',
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type='text'
                          value={bike.lock || ''}
                          onChange={(e) =>
                            handleBikeChange(
                              Number(key),
                              'lock',
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>Now</td>

                      <td>
                        {new Date(Date.now() + 86400000).toLocaleDateString()}
                      </td>

                      <td>{context.state.username} (You)</td>
                      <td>{bike.renews}</td>
                      <td>
                        {/* Placeholder for action buttons (e.g., return bike) */}
                        <Button
                          variant='success'
                          onClick={() => handleCheckoutBike(Number(key))}>
                          Check Out
                        </Button>
                      </td>
                      <td>
                        <BikeNotesInput bike_number={Number(key)} />
                      </td>
                    </tr>
                  ) : (
                    <tr key={key}>
                      <td style={{ width: '5px' }}> {key}</td>
                      <td>{bike.student_name}</td>
                      <td>{bike.student_id}</td>
                      <td>{bike.email}</td>
                      <td>{bike.lock}</td>
                      <td>{bike.time_checked_out}</td>
                      <td>{bike.date_due}</td>
                      <td>{bike.rented_staff}</td>
                      <td>{bike.renews}</td>
                      <td>
                        <div className='d-flex justify-content-around'>
                          <Button
                            variant='warning'
                            onClick={() => handleReturnBike(Number(key))}
                            className='me-2'>
                            Return
                          </Button>
                          <Button
                            variant='info'
                            onClick={() => handleRenewBike(Number(key))}>
                            Renew
                          </Button>
                        </div>
                      </td>
                      <td>
                        <BikeNotesInput bike_number={Number(key)} />
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
};
type Bike = {
  rented: boolean;
  rented_staff: string;
  time_checked_out: string;
  student_name: string;
  student_id: string;
  email: string;
  date_due: string;
  renews: number;
  lock: string;
};
type BikeData = {
  [key: number]: Bike;
};

type BikeNotes = {
  bike_number: number;
  notes: string;
  staff_name: string;
};
