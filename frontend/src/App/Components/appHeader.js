import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Space, Button, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';

function AppHeader(props) {
    const currentUser = useSelector(state => state.user.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [dropdownItems, setDropdownItems] = useState([]);

    const logout = useCallback(() => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        dispatch({ type: 'LOGOUT' });
        navigate('/signIn'); // Redirect to the sign-in page
    }, [dispatch, navigate]);

    useEffect(() => {
        if (currentUser) {
            setDropdownItems([
                { key: '1', label: (<a onClick={logout}>Sign Out</a>) },
            ]);
        } else {
            setDropdownItems([
                { key: '1', label: (<Link to="/signIn">Sign In</Link>) },
                { key: '2', label: (<Link to="/signup">Sign Up</Link>) },
            ]);
        }
    }, [currentUser, logout]);

    return (
        <Space style={{
            width: '100%',
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '0px 37px 0px 33px'
        }}>
            <Link to="/" style={{ color: '#0958d9', fontWeight: 'bold', fontSize: '27px' }}>HOME</Link>
            <Dropdown overlay={
                <Menu items={dropdownItems} onClick={(e) => e.domEvent.stopPropagation()} />
            } trigger={['click']}>
                <a onClick={(e) => e.preventDefault()} style={{ display: 'flex', alignItems: 'center' }}>
                    <DownOutlined />
                    <Button type="primary" style={{ backgroundColor: '#0958d9', border: 'none' }}>
                        {props.username || 'Account'}
                    </Button>
                </a>
            </Dropdown>
        </Space>
    );
}

export default AppHeader;
