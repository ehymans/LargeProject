import React from 'react';

import PageTitle from '../components/LandingHeader';
import Landing from '../components/Landing';
import LandingHeader from '../components/LandingHeader';

const LandingPage = () => {
  return (
    <div>
      <LandingHeader />
      <Landing />
    </div>
  );
};

export default LandingPage;