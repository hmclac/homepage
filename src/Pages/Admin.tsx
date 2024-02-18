import React, { useContext, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { AppContext } from '../Contexts/AppContext';

import { Equipment } from '../Components/Admin/Equipment';
import { Bike } from '../Components/Admin/Bike';
import { Bans } from '../Components/Admin/Bans';
import { BikeBans } from '../Components/Admin/BikeBans';
import { Staff } from '../Components/Admin/Staff';

import { CC, CustomContainer, H1 } from '../Components';

import { API_URL } from '..';

const Admin = () => {
  const context = useContext(AppContext);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [bikes, setBikes] = useState<number[]>([]);
  const [bans, setBans] = useState<string[]>([]);
  const [bikeBans, setBikeBans] = useState<string[]>([]);
  const [staff, setStaff] = useState<string[]>([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (!context || !context.state.isLoggedIn) return navigate('/login');

    document.title = 'LAC | Admin';
    fetchInfo();
  }, [navigate, context]);

  if (!context || !context.state.isLoggedIn) {
    return <p>You must be logged in to access this page.</p>;
  }

  async function fetchInfo() {
    if (!context || !context.state.username) return;
    const res = await fetch(
      `${API_URL}/admin?staff_name=${encodeURIComponent(
        context.state.username
      )}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then((x) => x.json());

    if (res.error) {
      return <p>{res.error}</p>;
    }

    setStaff(res.staff);
    setEquipment(res.equipment);
    setBikes(res.bikes);
    setBans(res.bans);
    setBikeBans(res.bikebans);
  }
  return (
    <CC>
      <H1>SUPS ONLY</H1>
      <CustomContainer>
        <Equipment equipment={equipment} setEquipment={setEquipment} />
      </CustomContainer>
      <CustomContainer>
        <Bike bikes={bikes} setBikes={setBikes} />
      </CustomContainer>
      <CustomContainer>
        <Bans bans={bans} setBans={setBans} />
      </CustomContainer>
      <CustomContainer>
        <BikeBans bikeBans={bikeBans} setBikeBans={setBikeBans} />
      </CustomContainer>
      <CustomContainer>
        <Staff staff={staff} setStaff={setStaff} />
      </CustomContainer>
    </CC>
  );
};

export { Admin };
