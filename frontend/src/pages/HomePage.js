import React from 'react';

// Importing your components
import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import HomeHeader from '../components/HomeHeader';

// Importing the CSS file
import '../components/HomePage.css';

const HomePage = () => {
    return(
        <div id="loggedInDiv"> {/* Use an ID or className here if you want to style this specific div */}
            <HomeHeader />
            <LoggedInName />
        </div>
    );
}

export default HomePage;

