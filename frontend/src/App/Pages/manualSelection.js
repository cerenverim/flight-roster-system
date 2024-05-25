import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Popconfirm, Form, Tag, Space, Layout, Typography } from 'antd';
import AppHeader from '../Components/appHeader';
import FlightSummary from '../Components/flightSummary';
import { PilotApi } from '../APIs/PilotApi';
import { CabinCrewApi } from '../APIs/CabinApi';
const { Header, Content } = Layout;
function ManualSelectionPage({ type }) {
    const [dataSourceSelectionFlight, setDataSourceSelectionFlight] = useState([

    ]);
    const [dataSourceFlight, setDataSourceFlight] = useState([]);
    const [dataSourceSelectionCabin, setDataSourceSelectionCabin] = useState([

    ]);
    const [dataSourceCabin, setDataSourceCabin] = useState([
    ]);
    useEffect(() => {
        let flightCrew;
        PilotApi.getFlightCrew(6).then((response) => {
            console.log(response.data);
            flightCrew = response.data.map((item) => ({
                "key": item.id,
                "id": item.id,
                "name": item.name,
                "nationality": item.nationality,
                "vehicleType": item.vehicle,
                "languages": (item.languages.map((language) => language)).join(', '),
                "age": item.age,
                "gender": item.gender,
                "seniorityLevel": item.seniority === 0 ? 'Trainee' : (item.seniority === 1 ? 'Junior' : 'Senior'),
                "range": item.max_range + ' km',
            }));
            setDataSourceSelectionFlight(flightCrew);
        });

        let cabinCrew;
        CabinCrewApi.getCabinCrew(6).then((response) => {
            cabinCrew = response.data.map((item) => ({
                "key": item.id,
                "id": item.id,
                "name": item.name,
                "nationality": item.nationality,
                "vehicleType": (item.vehicle.map((vehicles) => vehicles)).join(', '),
                "dishes": (item.dishes.map((dishes) => dishes.dish)).join(', '),
                "languages": (item.languages.map((language) => language)).join(', '),
                "age": item.age,
                "gender": item.gender,
                "seniorityLevel": item.seniority === 0 ? '' : (item.seniority === 1 ? 'Junior' : 'Senior'),
                "attendantType": item.seniority === 0 ? 'Chef' : (item.seniority === 1 ? 'Regular' : 'Chief'),
            }));
            setDataSourceSelectionCabin(cabinCrew);
        });

    }, []);
    function generateUniqueKey(dataSource) {
        // Generate a unique key based on current dataSource keys
        let newKey = 0;
        while (dataSource.some(item => item.key === newKey.toString())) {
            newKey++;
        }
        return newKey.toString();
    };
    const handleAddFlight = (key) => {
        const deletedData = dataSourceSelectionFlight.find((item) => item.key === key);
        const newData = dataSourceSelectionFlight.filter((item) => item.key !== key);
        const newKey = generateUniqueKey(dataSourceFlight);
        const addedData = { ...deletedData, key: newKey };
        setDataSourceFlight([...dataSourceFlight, addedData]);
        setDataSourceSelectionFlight(newData);
    };
    const handleDeleteFlight = (key) => {
        const deletedData = dataSourceFlight.find((item) => item.key === key);
        const newData = dataSourceFlight.filter((item) => item.key !== key);
        const newKey = generateUniqueKey(dataSourceSelectionFlight);
        const addedData = { ...deletedData, key: newKey };
        setDataSourceSelectionFlight([...dataSourceSelectionFlight, addedData]);
        setDataSourceFlight(newData);
    };
    const handleAddCabin = (key) => {
        const deletedData = dataSourceSelectionCabin.find((item) => item.key === key);
        const newData = dataSourceSelectionCabin.filter((item) => item.key !== key);
        const newKey = generateUniqueKey(dataSourceCabin);
        const addedData = { ...deletedData, key: newKey };
        setDataSourceCabin([...dataSourceCabin, addedData]);
        setDataSourceSelectionCabin(newData);
    };
    const handleDeleteCabin = (key) => {
        const deletedData = dataSourceCabin.find((item) => item.key === key);
        const newData = dataSourceCabin.filter((item) => item.key !== key);
        const newKey = generateUniqueKey(dataSourceSelectionCabin);
        const addedData = { ...deletedData, key: newKey };
        setDataSourceSelectionCabin([...dataSourceSelectionCabin, addedData]);
        setDataSourceCabin(newData);
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
                <AppHeader username='USER' />
            </Header>
            <Content >
                <FlightSummary departurePoint='Bengaluru (BLR)' departureDate='Mon, 14 Jun 2021' returnPoint='New Delhi (Del)' returnDate='Fri, 18 Jun 2021' />
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