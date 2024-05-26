import React from 'react';
import { Space, Button, Tabs, Layout } from 'antd';
import TabularView from '../Components/tabularView';
import ExtendedView from '../Components/extendedView';
import PlaneView from '../Components/planeView';
import FlightSummary from '../Components/flightSummary';
const { Content } = Layout;

function ViewPage({ type }) {
    const items = [
        {
            key: '1',
            label: 'TABULAR VIEW',
            children: <TabularView />,
        },
        {
            key: '2',
            label: 'PLANE VIEW',
            children: <PlaneView type={type} />,
        },
        {
            key: '3',
            label: 'EXTENDED VIEW',
            children: <ExtendedView />,
        },
    ];

    return (
        <Layout>
            <Content >
                <FlightSummary departurePoint='Bengaluru (BLR)' departureDate='Mon, 14 Jun 2021' returnPoint='New Delhi (Del)' returnDate='Fri, 18 Jun 2021' />
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