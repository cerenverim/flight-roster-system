import { React, useState, useEffect, useRef } from "react";
import { Table, Input, Button, Tag, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import FlightMenu from "./flightMenu";
function TabularView() {
    const [dataSource, setDataSource] = useState([
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
    const defaultColumns = [
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
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (_, { type }) => {
                let color;
                if (type === 'passenger') {
                    color = '#899499';
                } else if (type === 'flight crew') {
                    color = 'geekblue';
                } else {
                    color = 'green';
                }
                return (
                    <Tag color={color} key={type}>
                        {type.toUpperCase()}
                    </Tag>
                );
            },
            ...getColumnSearchProps('type'),
        },
    ];
    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Table
                scroll={{ x: true }}
                bordered
                dataSource={dataSource}
                columns={defaultColumns}
            />
            <FlightMenu menu={menu} />
        </div>


    );
}

export default TabularView;