import React, { createContext, useState, useEffect, ReactNode } from 'react';
// import { API_URL } from '..';

// Context with the correct type
export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Define the default state
  const defaultState: AppState = {
    username: undefined,
    isLoggedIn: false,
    occupancy: {
      weightRoom: {
        reserved: false,
        count: 0,
        graphData: [],
        lastUpdated: 0,
      },
      gym: {
        reserved: false,
        count: 0,
        graphData: [],
        lastUpdated: 0,
      },
      aerobics: {
        reserved: false,
        count: 0,
        graphData: [],
        lastUpdated: 0,
      },
      equipment: {
        pool1: false,
        pool2: false,
        pingpong1: false,
        pingpong2: false,
        basketballs: { taken: 0, available: 0 },
        volleyballs: { taken: 0, available: 0 },
        lastUpdated: 0,
      },
    },
  };

  const [state, setState] = useState<AppState>(() => {
    const storedState = localStorage.getItem('state');
    return storedState ? JSON.parse(storedState) : defaultState;
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
  graphData: { time: string; count: number }[];
  lastUpdated: number;
}

export interface Occupancy {
  weightRoom: RoomOccupancy;
  gym: RoomOccupancy;
  aerobics: RoomOccupancy;
  equipment: {
    pool1: boolean;
    pool2: boolean;
    pingpong1: boolean;
    pingpong2: boolean;
    basketballs: { taken: number; available: number };
    volleyballs: { taken: number; available: number };
    lastUpdated: number;
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
