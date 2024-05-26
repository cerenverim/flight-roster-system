import React, { useEffect, useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { Row, Col, Space, Button, Tabs, Layout, Dropdown, } from 'antd';
import { DownOutlined } from '@ant-design/icons';
function AppHeader(props) {
    const items = [
        {
            key: '1',
            label: (
                <>
                    Sign Out
                </>
            ),
        },
    ];
    return (
        <Space style={{
            width: '100%',
            display: 'flex', justifyContent: 'space-between', padding: '0px 37px 0px 33px'
        }}>
            <Link to="/" style={{ color: '#0958d9', fontWeight: 'bold', fontSize: '27px' }}>HOME</Link>
            <Dropdown
                menu={{
                    items,

                }} trigger={['click']}
            >
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        <DownOutlined />
                        <Button type="primary" style={{ backgroundColor: '#0958d9' }}>{props.username}</Button>
                    </Space>
                </a>
            </Dropdown>
        </Space>)
}
export default AppHeader