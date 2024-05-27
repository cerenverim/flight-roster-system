import React, { useEffect, useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { Table, Typography, Space } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
function FlightMenu({ menu }) {
    const menuColumns = [{
        id: 'id',
        title: 'Dishes',
        dataIndex: 'dish',
        key: 'dish',
    }];
    return (
        <Space direction='vertical' style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 50px' }}>
            <Typography.Title level={4}>Menu</Typography.Title>
            <Table
                scroll={{ x: true }}
                bordered
                dataSource={menu}
                columns={menuColumns}
            />
        </Space>

    )
}
export default FlightMenu