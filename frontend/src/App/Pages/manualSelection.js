import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Popconfirm, Form, Tag, Space, Layout, Typography } from 'antd';
import AppHeader from '../Components/appHeader';
import FlightSummary from '../Components/flightSummary';
const { Header, Content } = Layout;
function ManualSelectionPage() {
    const [dataSourceSelectionFlight, setDataSourceSelectionFlight] = useState([
        {
            key: '0',
            id: 'A78534B219',
            name: 'Marcus Giles',
            age: 25,
            gender: 'Male',
            nationality: 'French',
            languages: 'English',
            vehicleType: 'A',
            range: '1000km',
            seniorityLevel: 'Junior'
        },
        {
            key: '1',
            id: 'J78214G911',
            name: 'Leyton Christensen',
            age: 30,
            gender: 'Male',
            nationality: 'English',
            languages: 'English',
            vehicleType: 'A',
            range: '600km',
            seniorityLevel: 'Senior'
        },
        {
            key: '2',
            id: 'C71234F439',
            name: 'Viktoria Atkins',
            age: 21,
            gender: 'Female',
            nationality: 'English',
            languages: 'English, French',
            vehicleType: 'A',
            range: '1000km',
            seniorityLevel: 'Trainee'
        },
        {
            key: '3',
            id: 'K71284G243',
            name: 'Zubair Rodriguez',
            age: 35,
            gender: 'Male',
            nationality: 'German',
            languages: 'English, German',
            vehicleType: 'A',
            range: '1000km',
            seniorityLevel: 'Senior'
        },

    ]);
    const [dataSourceFlight, setDataSourceFlight] = useState([
        {
            key: '1',
            id: 'Y74834B283',
            name: 'Rowan Barron',
            age: 26,
            gender: 'Male',
            nationality: 'French',
            languages: 'English, French',
            vehicleType: 'A,B',
            range: '1000km',
            seniorityLevel: 'Trainee'
        },
        {
            key: '2',
            id: 'W77304D849',
            name: 'Siobhan Cantu',
            age: 29,
            gender: 'Female',
            nationality: 'Russian',
            languages: 'English,Russian',
            vehicleType: 'C',
            range: '400km',
            seniorityLevel: 'Trainee'
        }
    ]);
    const [dataSourceSelectionCabin, setDataSourceSelectionCabin] = useState([
        {
            key: '0',
            id: 'A78534B219',
            name: 'Marcus Giles',
            age: 25,
            gender: 'Male',
            nationality: 'French',
            languages: 'English',
            attendantType: 'Regular',
            vehicleType: 'A',
            dishes: '',
            seniorityLevel: 'Junior'
        },
        {
            key: '1',
            id: 'J78214G911',
            name: 'Leyton Christensen',
            age: 30,
            gender: 'Male',
            nationality: 'English',
            languages: 'English',
            attendantType: 'Regular',
            vehicleType: 'A',
            dishes: '',
            seniorityLevel: 'Senior'
        },
        {
            key: '2',
            id: 'C71234F439',
            name: 'Viktoria Atkins',
            age: 21,
            gender: 'Female',
            nationality: 'English',
            languages: 'English, French',
            attendantType: 'Regular',
            vehicleType: 'A',
            dishes: '',
            seniorityLevel: 'Junior'
        },
        {
            key: '3',
            id: 'K71284G243',
            name: 'Zubair Rodriguez',
            age: 35,
            gender: 'Male',
            nationality: 'German',
            languages: 'English, German',
            attendantType: 'Chief',
            vehicleType: 'A',
            dishes: '',
            seniorityLevel: 'Senior'
        },

    ]);
    const [dataSourceCabin, setDataSourceCabin] = useState([
        {
            key: '4',
            id: 'Y74834B283',
            name: 'Rowan Barron',
            age: 26,
            gender: 'Male',
            nationality: 'French',
            languages: 'English, French',
            attendantType: 'Chef',
            vehicleType: 'A,B',
            dishes: 'Creme Brulee',
            seniorityLevel: 'Trainee'
        },
        {
            key: '5',
            id: 'W77304D849',
            name: 'Siobhan Cantu',
            age: 29,
            gender: 'Female',
            nationality: 'Russian',
            languages: 'English,Russian',
            attendantType: 'Chef',
            vehicleType: 'C',
            dishes: 'Lava Cake',
            seniorityLevel: 'Senior'
        }
    ]);
    function generateUniqueKey(dataSource) {
        // Generate a unique key based on current dataSource keys
        let newKey = 0;
        while (dataSource.some(item => item.key === newKey.toString())) {
            newKey++;
        }
        return newKey.toString();
    };
    const [countSelectionFlight, setCountSelectionFlight] = useState(2);
    const [countFlight, setCountFlight] = useState(2);
    const [countSelectionCabin, setCountSelectionCabin] = useState(2);
    const [countCabin, setCountCabin] = useState(2);
    const handleAddFlight = (key) => {
        const deletedData = dataSourceSelectionFlight.find((item) => item.key === key);
        const newData = dataSourceSelectionFlight.filter((item) => item.key !== key);
        const newKey = generateUniqueKey(dataSourceFlight);
        const addedData = { ...deletedData, key: newKey };
        setDataSourceFlight([...dataSourceFlight, addedData]);
        setDataSourceSelectionFlight(newData);
        setCountFlight(countFlight + 1);
    };
    const handleDeleteFlight = (key) => {
        const deletedData = dataSourceFlight.find((item) => item.key === key);
        const newData = dataSourceFlight.filter((item) => item.key !== key);
        const newKey = generateUniqueKey(dataSourceSelectionFlight);
        const addedData = { ...deletedData, key: newKey };
        setDataSourceSelectionFlight([...dataSourceSelectionFlight, addedData]);
        setDataSourceFlight(newData);
        setCountSelectionFlight(countSelectionFlight + 1);
    };
    const handleAddCabin = (key) => {
        const deletedData = dataSourceSelectionCabin.find((item) => item.key === key);
        const newData = dataSourceSelectionCabin.filter((item) => item.key !== key);
        const newKey = generateUniqueKey(dataSourceCabin);
        const addedData = { ...deletedData, key: newKey };
        setDataSourceCabin([...dataSourceCabin, addedData]);
        setDataSourceSelectionCabin(newData);
        setCountCabin(countCabin + 1);
    };
    const handleDeleteCabin = (key) => {
        const deletedData = dataSourceCabin.find((item) => item.key === key);
        const newData = dataSourceCabin.filter((item) => item.key !== key);
        const newKey = generateUniqueKey(dataSourceSelectionCabin);
        const addedData = { ...deletedData, key: newKey };
        setDataSourceSelectionCabin([...dataSourceSelectionCabin, addedData]);
        setDataSourceCabin(newData);
        setCountSelectionCabin(countSelectionCabin + 1);
    };
    const FlightSelectionColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',

        },
        {
            title: 'Nationality',
            dataIndex: 'nationality',
            key: 'nationality',
        },
        {
            title: 'Languages',
            dataIndex: 'languages',
            key: 'languages',
        },
        {
            title: 'Vehicle Type',
            dataIndex: 'vehicleType',
            key: 'vehicleType',
        },
        {
            title: 'Range',
            dataIndex: 'range',
            key: 'range',
        },
        {
            title: 'Seniority Level',
            dataIndex: 'seniorityLevel',
            key: 'seniorityLevel',
        },
        {
            title: '',
            dataIndex: 'operation',
            width: '10%',
            render: (_, record) =>
                dataSourceSelectionFlight.length >= 1 ? (
                    <Popconfirm title="Sure to add?" onConfirm={() => handleAddFlight(record.key)}>
                        <Button type='link'> Add </Button>
                    </Popconfirm>
                ) : null,
        },
    ];
    const FlightCrewColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',

        },
        {
            title: 'Nationality',
            dataIndex: 'nationality',
            key: 'nationality',
        },
        {
            title: 'Languages',
            dataIndex: 'languages',
            key: 'languages',
        },
        {
            title: 'Vehicle Type',
            dataIndex: 'vehicleType',
            key: 'vehicleType',
        },
        {
            title: 'Range',
            dataIndex: 'range',
            key: 'range',
        },
        {
            title: 'Seniority Level',
            dataIndex: 'seniorityLevel',
            key: 'seniorityLevel',
        },
        {
            title: '',
            dataIndex: 'operation',
            width: '10%',
            render: (_, record) =>
                dataSourceFlight.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteFlight(record.key)}>
                        <Button type='link' danger> Delete </Button>
                    </Popconfirm>
                ) : null,
        },
    ];
    const CabinSelectionColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',

        },
        {
            title: 'Nationality',
            dataIndex: 'nationality',
            key: 'nationality',
        },
        {
            title: 'Languages',
            dataIndex: 'languages',
            key: 'languages',
        },
        {
            title: 'Attendant Type',
            dataIndex: 'attendantType',
            key: 'attendantType',
        },
        {
            title: 'Vehicle Type',
            dataIndex: 'vehicleType',
            key: 'vehicleType',
        },
        {
            title: 'Dishes',
            dataIndex: 'dishes',
            key: 'dishes',
        },
        {
            title: 'Seniority Level',
            dataIndex: 'seniorityLevel',
            key: 'seniorityLevel',
        },
        {
            title: '',
            dataIndex: 'operation',
            width: '10%',
            render: (_, record) =>
                dataSourceSelectionCabin.length >= 1 ? (
                    <Popconfirm title="Sure to add?" onConfirm={() => handleAddCabin(record.key)}>
                        <Button type='link'> Add </Button>
                    </Popconfirm>
                ) : null,
        },
    ];
    const CabinCrewColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',

        },
        {
            title: 'Nationality',
            dataIndex: 'nationality',
            key: 'nationality',
        },
        {
            title: 'Languages',
            dataIndex: 'languages',
            key: 'languages',
        },
        {
            title: 'Attendant Type',
            dataIndex: 'attendantType',
            key: 'attendantType',
        },
        {
            title: 'Vehicle Type',
            dataIndex: 'vehicleType',
            key: 'vehicleType',
        },
        {
            title: 'Dishes',
            dataIndex: 'dishes',
            key: 'dishes',
        },
        {
            title: 'Seniority Level',
            dataIndex: 'seniorityLevel',
            key: 'seniorityLevel',
        },
        {
            title: '',
            dataIndex: 'operation',
            width: '10%',
            render: (_, record) =>
                dataSourceCabin.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteCabin(record.key)}>
                        <Button type='link' danger> Delete </Button>
                    </Popconfirm>
                ) : null,
        },
    ];
    return (
        <Layout >
            <Header style={{
                backgroundColor: '#ebebeb',
                paddingLeft: '15px',
                paddingRight: '15px',
                zIndex: 3,
                boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)"
            }}>
                <AppHeader />
            </Header>
            <Content >
                <FlightSummary />
                <Space direction='vertical' style={{ display: 'flex', padding: '20px 50px 0px 50px' }}>

                    <Typography.Title level={4}>Flight Crew Selection</Typography.Title>
                    <Table
                        rowClassName={() => 'editable-row'}
                        scroll={{ x: true }}
                        bordered
                        dataSource={dataSourceSelectionFlight}
                        columns={FlightSelectionColumns}
                    />
                    <Typography.Title level={4}>Current Flight Crew</Typography.Title>
                    <Table
                        rowClassName={() => 'editable-row'}
                        scroll={{ x: true }}
                        bordered
                        dataSource={dataSourceFlight}
                        columns={FlightCrewColumns}
                    />
                    <Typography.Title level={4}>Cabin Crew Selection</Typography.Title>
                    <Table
                        rowClassName={() => 'editable-row'}
                        scroll={{ x: true }}
                        bordered
                        dataSource={dataSourceSelectionCabin}
                        columns={CabinSelectionColumns}
                    />
                    <Typography.Title level={4}>Current Cabin Crew</Typography.Title>
                    <Table
                        rowClassName={() => 'editable-row'}
                        scroll={{ x: true }}
                        bordered
                        dataSource={dataSourceCabin}
                        columns={CabinCrewColumns}
                    />
                </Space>
                <Space style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 50px' }}>
                    <Button type="primary">CONFIRM</Button>
                    <Button type="primary">EXPORT</Button>
                </Space>
            </Content>
        </Layout >

    );
}
export default ManualSelectionPage