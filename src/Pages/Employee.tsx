import React, { useContext, useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import { AppContext } from '../Contexts/AppContext';

import { Swipe } from '../Components/Employee/Swipe';
import { Equipment } from '../Components/Employee/Equipment';
import { Bike } from '../Components/Employee/Bike';
import { Headcount } from '../Components/Employee/Headcount';

import { CC, CustomContainer } from '../Components';

const Employee = () => {
  const context = useContext(AppContext);

  const navigate = useNavigate();

  const swipeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!context || !context.state.isLoggedIn || !context.state.username)
      return navigate('/login');
    document.title = 'LAC | Employee';

    swipeInputRef.current?.focus();
  }, [context, navigate, swipeInputRef]);

  useEffect(() => {
    const handleBodyClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).matches('input, select, textarea, button'))
        swipeInputRef.current?.focus();
    };

    swipeInputRef.current?.focus();

    document.body.addEventListener('click', handleBodyClick);

    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, []);

  if (!context || !context.state.isLoggedIn) {
    return <p>You must be logged in to access this page.</p>;
  }

  return (
    <CC>
      <CustomContainer>
        <Swipe swipeInputRef={swipeInputRef} />
      </CustomContainer>
      <CustomContainer>
        <Equipment />
      </CustomContainer>
      <CustomContainer>
        <Bike />
      </CustomContainer>

      <CustomContainer>
        <Headcount />
      </CustomContainer>
    </CC>
  );
};

export { Employee };
