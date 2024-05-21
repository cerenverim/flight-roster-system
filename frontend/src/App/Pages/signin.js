/*import React, { useEffect, useState } from 'react';
function SignInPage() {
    return (<div>Sign In Page</div>);
}
export default SignInPage
*/

import React, { useState } from 'react';
import './signin.css';
import { Link } from 'react-router-dom';

function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Form gönderim işlemleri burada yapılabilir
        console.log('Email:', email);
        console.log('Password:', password);
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