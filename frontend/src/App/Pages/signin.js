/*import React, { useEffect, useState } from 'react';
function SignInPage() {
    return (<div>Sign In Page</div>);
}
export default SignInPage
*/

import React, { useState } from 'react';
import './signin.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthApi } from '../APIs/AuthApi';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../actions/userActions';

function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
            const result = await AuthApi.login(userData);
            console.log('Login Success:', result);
            updateUser(result.user);
            navigate('/userProfile');
            // Redirect or perform additional actions upon successful login
        } catch (error) {
            // Handle login errors, such as showing a notification to the user
            console.log('Login Failed:', error);
        }
    };

    return (
        <div className="signin-container">
            <h2>Sign In</h2>
            <p>Enter your Email and Password</p>
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
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn">SIGN IN</button>
            </form>
            <p className="signup-link">
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
}

export default SignInPage;