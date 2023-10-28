import React from 'react';

import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import HomeHeader from '../components/HomeHeader'


const HomePage = () =>
{
    return(
        <div>
            <HomeHeader />
            <LoggedInName />
        </div>
    );
}


export default HomePage;

