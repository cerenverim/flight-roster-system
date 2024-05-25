import './App.css';
import { Route, Routes, Link } from 'react-router-dom';
import LandingPage from './App/Pages/landing';
import SignInPage from './App/Pages/signin';
import SignUpPage from './App/Pages/signup';
import ViewPage from './App/Pages/view';
import ManualSelectionPage from './App/Pages/manualSelection';
import FlightSelectionPage from './App/Pages/flightSelection';
import UserProfilePage from './App/Pages/userprofile';

function App() {
  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="nav-item">Landing</Link>
        <Link to="/signIn" className="nav-item">Sign In</Link>
        <Link to="/signUp" className="nav-item">Sign Up</Link>
        <Link to="/view" className="nav-item">View</Link>
        <Link to="/manualSelection" className="nav-item">Manual Selection</Link>
        <Link to="/flightSelection" className="nav-item">Flight Selection</Link>
        <Link to="/userProfile" className="nav-item">User Profile</Link>
      </nav>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signIn" element={<SignInPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/view" element={<ViewPage />} />
        <Route path="/manualSelection" element={<ManualSelectionPage />} />
        <Route path="/flightSelection" element={<FlightSelectionPage />} />
        <Route path="/userProfile" element={<UserProfilePage />} />
        <Route path="*" element={<LandingPage />} />

      </Routes>
    </div>
  );
}

export default App;
