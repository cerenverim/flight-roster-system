import React, { useState } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthApi } from '../APIs/AuthApi';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../actions/userActions';


function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    
    const navigate = useNavigate();
    const user = useSelector(state => state.user.currentUser);
    const dispatch = useDispatch();

    const updateUser = (newUser) => {
        dispatch(setUser(newUser));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = {
                username: email,
                password: password
            };;
            const result = await AuthApi.signUp(userData);
            console.log('Sign Up Success:', result);
            updateUser(result.user);
            navigate('/userProfile');
            // Redirect or perform additional actions upon successful sign-up
        } catch (error) {
            // Handle sign-up errors, such as showing a notification to the user
            console.log('Sign Up Failed:', error);
        }
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
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit" className="btn">SIGN UP</button>
            </form>
            <p className="signin-link">
                Already have an account? <Link to="/signin">Login</Link>
            </p>
        </div>
    );
}

export default SignUpPage;