import React, { createContext, useState, useEffect, ReactNode } from 'react';
// import { API_URL } from '..';

// Context with the correct type
export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  // Define the default state
  const defaultState: AppState = {
    username: undefined,
    isLoggedIn: false,
    occupancy: {
      headcount_last_update: '00:00',
      weightRoom: {
        reserved: false,
        count: 0,
        data: []
      },
      gym: {
        reserved: false,
        count: 0,
        data: []
      },
      aerobics: {
        reserved: false,
        count: 0,
        data: []
      },
      lobby: {
        reserved: false,
        count: 0,
        data: []
      },
      bikes: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        11: false,
        12: false,
        69: false
      },
      equipment: {
        pool1: false,
        pool2: false,
        pingpong1: false,
        pingpong2: false,
        basketballs: { taken: 0, available: 0 },
        volleyballs: { taken: 0, available: 0 },
        lastUpdated: 0
      }
    }
  };

  const [state, setState] = useState<AppState>(() => {
    // const storedState = localStorage.getItem('state');
    return defaultState;

    // return storedState ? JSON.parse(storedState) : defaultState;
  });

  useEffect(() => {}, []);

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export interface RoomOccupancy {
  reserved: boolean;
  count: number;
  data: { time: string; count: number }[];
}

export interface Occupancy {
  headcount_last_update: string;
  weightRoom: RoomOccupancy;
  gym: RoomOccupancy;
  aerobics: RoomOccupancy;
  lobby: RoomOccupancy;
  equipment: any;
  bikes: {
    [key: number]: boolean;
  };
}

export interface AppState {
  username?: string;
  occupancy?: Occupancy;
  isLoggedIn: boolean;
}

// Define the shape of your context
interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}
