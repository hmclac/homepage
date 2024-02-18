import React, { useEffect } from 'react';

import { Swipe } from '../Components/Stats/Swipe';
import { Leaderboard } from '../Components/Stats/Leaderboard';
import { CustomContainer, CC } from '../Components';

export const Stats = () => {
  useEffect(() => {
    document.title = 'LAC | Stats';
  }, []);

  return (
    <CC>
      <CustomContainer>
        <Swipe />
      </CustomContainer>
      <CustomContainer>
        <Leaderboard />
      </CustomContainer>
    </CC>
  );
};
