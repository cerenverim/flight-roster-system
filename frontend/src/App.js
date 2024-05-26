import './App.css';
import { Route, Routes, Link } from 'react-router-dom';
import LandingPage from './App/Pages/landing';
import SignInPage from './App/Pages/signin';
import SignUpPage from './App/Pages/signup';
import ViewPage from './App/Pages/view';
import ManualSelectionPage from './App/Pages/manualSelection';
import FlightSelectionPage from './App/Pages/flightSelection';
import UserProfilePage from './App/Pages/userprofile';
import { Layout } from 'antd';
import AppHeader from './App/Components/appHeader';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setAuthToken } from './App/APIs/baseServiceApi';


const { Header} = Layout;
function App() {
  const currentUser = useSelector(state => state.user.currentUser)
  const dispatch = useDispatch();
  useEffect(() => {
      const token = localStorage.getItem('token');
      console.log(token);
      if (token) {
          dispatch({ type: 'SET_TOKEN', payload: token });
          setAuthToken(token);
      }
  }, [dispatch]);
  return (
    <div>
      <Layout>
        <Header style={{
          backgroundColor: '#ebebeb',
          paddingLeft: '15px',
          paddingRight: '15px',
          zIndex: 3,
          boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)"
        }}>
          <AppHeader username={currentUser ? currentUser.username: 'Sign In / Sign Up'} />
        </Header>
      </Layout>

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
