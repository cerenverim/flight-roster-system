import React from "react";
import { useState, useEffect, useRef } from "react";
import { Table, Input, Button, Tag, Space, Row, Col, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';



function ExtendedView() {
    const [flightSource, setFlightSource] = useState([
        {
            key: '0',
            id: 'A78534B219',
            name: 'Marcus Giles',
            type: 'passenger',
        },
        {
            key: '1',
            id: 'B92733H988',
            name: 'Leyton Christensen',
            type: 'flight crew',
        },
        {
            key: '2',
            id: 'Y92833G647',
            name: 'Victoria Atkinson',
            type: 'cabin crew',
        },
        {
            key: '3',
            id: 'L78534G844',
            name: 'Rowan Barron',
            type: 'cabin crew',
        },
        {
            key: '4',
            id: 'Q92733S988',
            name: 'Zubair Rodrigues',
            type: 'flight crew',
        },
        {
            key: '5',
            id: 'Z92833A647',
            name: 'Siobhan Cantu',
            type: 'cabin crew',
        },
    ]);
    const [cabinSource, setCabinSource] = useState([
        {
            key: '0',
            id: 'A78534B219',
            name: 'Marcus Giles',
            type: 'passenger',
        },
        {
            key: '1',
            id: 'B92733H988',
            name: 'Leyton Christensen',
            type: 'flight crew',
        },
        {
            key: '2',
            id: 'Y92833G647',
            name: 'Victoria Atkinson',
            type: 'cabin crew',
        },
        {
            key: '3',
            id: 'L78534G844',
            name: 'Rowan Barron',
            type: 'cabin crew',
        },
        {
            key: '4',
            id: 'Q92733S988',
            name: 'Zubair Rodrigues',
            type: 'flight crew',
        },
        {
            key: '5',
            id: 'Z92833A647',
            name: 'Siobhan Cantu',
            type: 'cabin crew',
        },
    ]);
    const [passengerSource, setPassengerSource] = useState([
        {
            key: '0',
            id: 'A78534B219',
            name: 'Marcus Giles',
            type: 'passenger',
        },
        {
            key: '1',
            id: 'B92733H988',
            name: 'Leyton Christensen',
            type: 'flight crew',
        },
        {
            key: '2',
            id: 'Y92833G647',
            name: 'Victoria Atkinson',
            type: 'cabin crew',
        },
        {
            key: '3',
            id: 'L78534G844',
            name: 'Rowan Barron',
            type: 'cabin crew',
        },
        {
            key: '4',
            id: 'Q92733S988',
            name: 'Zubair Rodrigues',
            type: 'flight crew',
        },
        {
            key: '5',
            id: 'Z92833A647',
            name: 'Siobhan Cantu',
            type: 'cabin crew',
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
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            ...getColumnSearchProps('type')
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
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            ...getColumnSearchProps('level')
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
            dataIndex: 'flightID',
            key: 'flightID',
            ...getColumnSearchProps('flightID'),
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
                        bordered
                        dataSource={passengerSource}
                        columns={passengerColumns}
                    />
                </Col>
            </Row>
        </>
    );
}

export default ExtendedView;