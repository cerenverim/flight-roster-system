import React, { useEffect, useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { Row, Col, Space, Button, Tabs, Layout, Dropdown, Divider, } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
function FlightSummary() {
    return (
        <Row style={{ height: '80px', backgroundColor: '#ebebeb' }} justify='space-between'>
            <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} span={7}>
                <Space style={{ fontWeight: 'bold' }}>
                    Bengaluru (BLR) - New Delhi (Del)
                </Space>
            </Col>
            <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} span={1}><Divider type="vertical" style={{ height: '35px', borderInlineStart: '2px solid rgba(5, 5, 5, 0.17)' }} /></Col>
            <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} span={8}>
                <Space direction='vertical' >
                    <Space style={{ fontWeight: 'bold' }}>
                        <CalendarOutlined />
                        Departure
                    </Space>
                    <Space style={{ color: '#4285f4' }}>

                        Mon, 14 Jun 2021
                    </Space>
                </Space>
            </Col>

            <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }} span={1}><Divider type="vertical" style={{ height: '35px', borderInlineStart: '2px solid rgba(5, 5, 5, 0.17)' }} /></Col>
            <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} span={7}>
                <Space direction='vertical' >
                    <Space style={{ fontWeight: 'bold' }}>
                        <CalendarOutlined />
                        Return
                    </Space>
                    <Space style={{ color: '#4285f4' }}>

                        Fri, 18 Jun 2021
                    </Space>
                </Space>
            </Col>
        </Row>
    )
}
export default FlightSummary