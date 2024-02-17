import React, { useEffect } from 'react';

import { Swipe } from '../Components/Stats/Swipe';
import { Leaderboard } from '../Components/Stats/Leaderboard';
import { CC } from '../Components';

export const Stats = () => {
  useEffect(() => {
    document.title = 'LAC | Stats';
  }, []);

  return (
    <>
      <CC>
        <Swipe />
      </CC>
      <CC>
        <Leaderboard />
      </CC>
    </>
  );
};
