import React, { useEffect, useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { Table, Typography, } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
function FlightMenu({ menu }) {
    const menuColumns = [{
        title: 'Dishes',
        dataIndex: 'dishes',
        key: 'dishes',
    }];
    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Typography.Title level={4}>Menu</Typography.Title>
            <Table
                scroll={{ x: true }}
                bordered
                dataSource={menu}
                columns={menuColumns}
            />
        </div>

    )
}
export default FlightMenu