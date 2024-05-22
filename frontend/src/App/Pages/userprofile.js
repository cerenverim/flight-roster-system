import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../actions/userActions';

function UserProfilePage() {
    const user = useSelector(state => state.user.currentUser);
    const dispatch = useDispatch();

    const updateUser = (newUser) => {
        dispatch(setUser(newUser));
    };

    return (
        <div>
            <h1>User Profile</h1>
            {user && <p>{user.username}</p>}
            <button onClick={() => updateUser({ username: 'Jane Doe' })}>Update User</button>
        </div>
    );
}

export default UserProfilePage;
