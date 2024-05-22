import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Popconfirm, Form, Tag, Space } from 'antd';
function ManualSelectionPage() {
    const [dataSource, setDataSource] = useState([
        {
            key: '0',
            id: 'asdfasdf',
            name: 'asdasdf',
            type: 'flight crew',
        },
        {
            key: '1',
            id: 'asdfasdf',
            name: 'asdasdf',
            type: 'cabin crew',
        },
    ]);
    const [count, setCount] = useState(2);
    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };
    const defaultColumns = [
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
            }
        },
        {
            title: '',
            dataIndex: 'operation',
            width: '10%',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                        Delete
                    </Popconfirm>
                ) : null,
        },
    ];
    const handleAdd = () => {
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: '32',
            address: `London, Park Lane no. ${count}`,
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };
    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };
    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });
    return (
        <div>
            <Space style={{ display: 'flex', justifyContent: 'end' }}>
                <Button
                    onClick={handleAdd}
                    type="primary"
                    style={{
                        marginBottom: 16,
                    }}
                >
                    Add a row
                </Button>
            </Space>
            <Table
                rowClassName={() => 'editable-row'}
                scroll={{ x: true }}
                bordered
                dataSource={dataSource}
                columns={columns}
            />
        </div>
    );
}
export default ManualSelectionPage