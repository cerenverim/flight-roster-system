import React, { useState, useCallback } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../../actions/userActions';
import { setAuthToken } from '../APIs/baseServiceApi';
import { AuthApi } from '../APIs/AuthApi';

function SignUpPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Hata mesajları için state

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSignUp = useCallback(async (userData) => {
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }
        try {
            const data = await AuthApi.signUp(userData);
            dispatch(setUser(data.user));
            dispatch(setToken(data.token));
            setAuthToken(data.token);
            navigate('/'); // Eğer login başarılıysa, kullanıcıyı yönlendir
        } catch (error) {
            console.error('Error during sign up process:', error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || "User already exists.");
            } else {
                setErrorMessage("User already exists.");
            }
        }
    }, [dispatch, navigate, password, confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
             username,
             password
        };
        await handleSignUp(userData);
    };
        
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <p>First create your account</p>
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
                    <div className="password-container">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span onClick={togglePasswordVisibility}>
                            {passwordVisible ? "🙈" : "👁️"}
                        </span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm your password</label>
                    <div className="password-container">
                        <input
                            type={confirmPasswordVisible ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span onClick={toggleConfirmPasswordVisibility}>
                            {confirmPasswordVisible ? "🙈" : "👁️"}
                        </span>
                    </div>
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button type="submit" className="btn">SIGN UP</button>
            </form>
            <p className="signin-link">
                Already have an account? <Link to="/signin">Login</Link>
            </p>
        </div>
    );
}

export default SignUpPage;
