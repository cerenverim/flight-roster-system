import React from 'react';
import { useSelector } from 'react-redux';

function UserProfilePage() {
    const user = useSelector(state => state.user.currentUser);

    return (
        <div>
            <h1>User Profile</h1>
            {user && <p>{user.username}</p>}
        </div>
    );
}

export default UserProfilePage;
