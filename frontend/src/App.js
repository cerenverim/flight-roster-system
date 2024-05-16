import logo from './logo.svg';
import './App.css';
import { Route, Routes, Link } from 'react-router-dom';
import LandingPage from './App/Pages/landing';
import SignInPage from './App/Pages/signin';
import SignUpPage from './App/Pages/signup';
import ViewPage from './App/Pages/view';
import SearchPage from './App/Pages/search';
import ManualSelectionPage from './App/Pages/manualSelection';
import FlightSelectionPage from './App/Pages/flightSelection';


function App() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <nav>
        <ul>
          <li>
            <Link to="/">Landing</Link>
          </li>
          <li>
            <Link to="/signIn">Sign In</Link>
          </li>
          <li>
            <Link to="/signUp">Sign Up</Link>
          </li>
          <li>
            <Link to="/view">View</Link>
          </li>
          <li>
            <Link to="/search">Search</Link>
          </li>
          <li>
            <Link to="/manualSelection">Manual Selection</Link>
          </li>
          <li>
            <Link to="/flightSelection">Flight Selection</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signIn" element={<SignInPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/view" element={<ViewPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/manualSelection" element={<ManualSelectionPage />} />
        <Route path="/flightSelection" element={<FlightSelectionPage />} />
      </Routes>
    </div>
  );
}

export default App;
