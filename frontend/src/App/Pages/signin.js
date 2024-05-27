import React, { useState, useCallback } from 'react';
import './signin.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthApi } from '../APIs/AuthApi';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../../actions/userActions';
import { setAuthToken } from '../APIs/baseServiceApi';

function SignInPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Yükleme durumu için state

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = useCallback(async (userData) => {
        setIsLoading(true); // Yükleme başladığında
        try {
            const data = await AuthApi.login(userData);
            dispatch(setUser(data.user));
            dispatch(setToken(data.token));
            setAuthToken(data.token);
            navigate('/'); // Eğer login başarılıysa, kullanıcıyı yönlendir
            setIsLoading(false); // Yükleme bittiğinde
        } catch (error) {
            console.error('Error during login process:', error);
            setErrorMessage('Incorrect username or password. Please try again.'); // Hata mesajını set et
            setIsLoading(false); // Yükleme bittiğinde
        }
    }, [dispatch, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            username,
            password
        };
        await handleLogin(userData);
    };

    return (
        <div className="signin-container">
            <h2>Sign In</h2>
            <p>Enter your Username and Password</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {isLoading && <div>Loading...</div>} 
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button type="submit" className="btn" disabled={isLoading}>SIGN IN</button>
            </form>
            <p className="signup-link">
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
}

export default SignInPage;
