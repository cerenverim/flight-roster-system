import React from "react";
import { useState, useEffect, useRef } from "react";
import { Table, Input, Button, Tag, Space, Row, Col, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import FlightMenu from "./flightMenu";


function ExtendedView() {
    const [flightSource, setFlightSource] = useState([
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
        {
            key: '4',
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
            key: '5',
            id: 'W77304D849',
            name: 'Siobhan Cantu',
            age: 29,
            gender: 'Female',
            nationality: 'Russian',
            languages: 'English,Russian',
            vehicleType: 'C',
            range: '400km',
            seniorityLevel: 'Trainee'
        },
    ]);
    const [cabinSource, setCabinSource] = useState([
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
        },
    ]);
    const [passengerSource, setPassengerSource] = useState([
        {
            key: '0',
            passengerId: 'A78534B219',
            flightId: 'X12345Y678',
            name: 'Marcus Giles',
            age: 25,
            gender: 'Male',
            nationality: 'French',
            seatType: 'Economy',
        },
        {
            key: '1',
            passengerId: 'J78214G911',
            flightId: 'M98765N432',
            name: 'Leyton Christensen',
            age: 30,
            gender: 'Male',
            nationality: 'English',
            seatType: 'Business',
        },
        {
            key: '2',
            passengerId: 'C71234F439',
            flightId: 'Q24680R135',
            name: 'Viktoria Atkins',
            age: 21,
            gender: 'Female',
            nationality: 'English',
            seatType: 'Business',
        },
        {
            key: '3',
            passengerId: 'K71284G243',
            flightId: 'S54321T987',
            name: 'Zubair Rodriguez',
            age: 35,
            gender: 'Male',
            nationality: 'German',
            seatType: 'Economy',
        },
        {
            key: '4',
            passengerId: 'Y74834B283',
            flightId: 'C98765D432',
            name: 'Rowan Barron',
            age: 26,
            gender: 'Male',
            nationality: 'French',
            seatType: 'Economy',
        },
        {
            key: '5',
            passengerId: 'W77304D849',
            flightId: 'G45678H901',
            name: 'Siobhan Cantu',
            age: 29,
            gender: 'Female',
            nationality: 'Russian',
            seatType: 'Economy',
        },
    ]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });
    const cabinColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            ...getColumnSearchProps('id'),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            ...getColumnSearchProps('age'),
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            ...getColumnSearchProps('gender'),

        },
        {
            title: 'Nationality',
            dataIndex: 'nationality',
            key: 'nationality',
            ...getColumnSearchProps('nationality')
        },
        {
            title: 'Languages',
            dataIndex: 'languages',
            key: 'languages',
            ...getColumnSearchProps('languages')
        },
        {
            title: 'Attendant Type',
            dataIndex: 'attendantType',
            key: 'attendantType',
            ...getColumnSearchProps('attendantType')
        },
        {
            title: 'Vehicle Type',
            dataIndex: 'vehicleType',
            key: 'vehicleType',
            ...getColumnSearchProps('vehicleType')
        },
        {
            title: 'Dishes',
            dataIndex: 'dishes',
            key: 'dishes',
            ...getColumnSearchProps('dishes')
        },
        {
            title: 'Seniority Level',
            dataIndex: 'seniorityLevel',
            key: 'seniorityLevel',
            ...getColumnSearchProps('seniorityLevel')
        },
    ];
    const flightColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            ...getColumnSearchProps('id'),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            ...getColumnSearchProps('age'),
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            ...getColumnSearchProps('gender'),

        },
        {
            title: 'Nationality',
            dataIndex: 'nationality',
            key: 'nationality',
            ...getColumnSearchProps('nationality')
        },
        {
            title: 'Languages',
            dataIndex: 'languages',
            key: 'languages',
            ...getColumnSearchProps('languages')
        },
        {
            title: 'Vehicle Type',
            dataIndex: 'vehicleType',
            key: 'vehicleType',
            ...getColumnSearchProps('vehicleType')
        },
        {
            title: 'Range',
            dataIndex: 'range',
            key: 'range',
            ...getColumnSearchProps('range')
        },
        {
            title: 'Seniority Level',
            dataIndex: 'seniorityLevel',
            key: 'seniorityLevel',
            ...getColumnSearchProps('seniorityLevel')
        }
    ];
    const passengerColumns = [
        {
            title: 'Passenger ID',
            dataIndex: 'passengerId',
            key: 'passengerId',
            ...getColumnSearchProps('passengerId'),
        },
        {
            title: 'Flight ID',
            dataIndex: 'flightId',
            key: 'flightId',
            ...getColumnSearchProps('flightId'),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            ...getColumnSearchProps('age'),
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            ...getColumnSearchProps('gender'),

        },
        {
            title: 'Nationality',
            dataIndex: 'nationality',
            key: 'nationality',
            ...getColumnSearchProps('nationality')
        },
        {
            title: 'Seat Type',
            dataIndex: 'seatType',
            key: 'seatType',
            ...getColumnSearchProps('seatType')
        }
    ];
    return (
        <>
            <Row>
                <Col span={24}>
                    <Typography.Title level={3}>Flight Crew</Typography.Title>
                    <Table
                        scroll={{ x: true }}
                        bordered
                        dataSource={flightSource}
                        columns={flightColumns}
                    />
                </Col>

            </Row>
            <Row>
                <Col span={24}>
                    <Typography.Title level={3}>Cabin Crew</Typography.Title>
                    <Table
                        scroll={{ x: true }}
                        bordered
                        dataSource={cabinSource}
                        columns={cabinColumns}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Typography.Title level={3}>Passengers</Typography.Title>
                    <Table
                        scroll={{ x: true }}
                        bordered
                        dataSource={passengerSource}
                        columns={passengerColumns}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <FlightMenu menu={menu} />
                </Col>
            </Row>
        </>
    );
}

export default ExtendedView;