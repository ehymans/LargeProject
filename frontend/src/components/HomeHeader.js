import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './PageTitle.css';

function LoggedInName() {
    const [user, setUser] = useState({});
  
    useEffect(() => {
      let _ud = localStorage.getItem('user_data');
      if (_ud) {
        let ud = JSON.parse(_ud);
        setUser(ud);
      }
    }, []);
  
    const doLogout = event => {
      event.preventDefault();
      localStorage.removeItem('user_data'); // Clear the user data upon logout
      window.location.href = '/'; // Redirect to the login page
      alert('Logged out successfully');
    };

function HomeHeader() {
  return (
    <div className="page-title">
      <h1 id="title">Productivity Dashboard</h1>
      <span id="userName">Logged In As {user.firstName} {user.lastName}</span><br />
      <div className="page-buttons">
        
          <button>onClick={doLogout}Login</button>
      </div>
    </div>
  );
}
}

export default HomeHeader;