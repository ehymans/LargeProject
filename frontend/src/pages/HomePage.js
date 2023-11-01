import React from 'react';

import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import HomeHeader from '../components/HomeHeader'
import DisplayTasks from '../components/DisplayTasks'


const HomePage = () =>
{
    return(
        <div>
            <HomeHeader />
            <LoggedInName />
            <DisplayTasks />
        </div>
    );
}


export default HomePage;

