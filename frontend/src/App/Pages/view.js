import React, { useEffect, useState } from 'react';
import { Row, Col, Space, Button, Tabs, Layout } from 'antd';
import TabularView from '../Components/tabularView';
import ExtendedView from '../Components/extendedView';
import PlaneView from '../Components/planeView';
import AppHeader from '../Components/appHeader';
import FlightSummary from '../Components/flightSummary';
const { Header, Content } = Layout;



function ViewPage() {
    const items = [
        {
            key: '1',
            label: 'TABULAR VIEW',
            children: <TabularView />,
        },
        {
            key: '2',
            label: 'PLANE VIEW',
            children: <PlaneView />,
        },
        {
            key: '3',
            label: 'EXTENDED VIEW',
            children: <ExtendedView />,
        },
    ];

    return (
        <Layout>
            <Header style={{
                backgroundColor: '#ebebeb',
                paddingLeft: '15px',
                paddingRight: '15px',
                zIndex: 3,
                boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)"
            }}>
                <AppHeader />
            </Header>
            <Content>
                <FlightSummary />
                <Tabs style={{ padding: '0 50px' }} size='large' defaultActiveKey="1" items={items} />
                <Space style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 50px' }}>
                    <Button type="primary">CONFIRM</Button>
                    <Button type="primary">EXPORT</Button>
                </Space>
            </Content>
        </Layout >
    );
}
export default ViewPage