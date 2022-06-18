import React, { useEffect, useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Switch, Button } from 'antd';
import { RealtimeData_Request, write_setting } from '../../../api';
import { DataSortRT, DataSortST } from '../../../DataRequest/RealTimeRequestWrap';

const originData = [];
let RT_tablebuf = {}

let ValueSetting = []
let Blankpage = 1


const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {

    const inputNode = inputType === 'number' ? <InputNumber /> : <Switch defaultChecked={!record} />;
    return (
        <td {...restProps}>
            {editing ? (

                inputType === 'number' ?
                    (<Form.Item

                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>) :
                    (<Form.Item
                        valuePropName="checked"
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>)
            ) : (
                children
            )}
        </td>
    );
};

const NotificationC3 = () => {
    const [form] = Form.useForm()
    const [data, setData] = useState(originData)
    const [editingKey, setEditingKey] = useState('')

    const [state, setState] = useState({ count: 0, count2: 100 });


    const isEditing = (record) => record.key === editingKey;


    const edit = (record) => {
        console.log(record)
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...ValueSetting];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                // setData(newData);
                ValueSetting = newData
                setEditingKey('');
            } else {
                newData.push(row);
                ValueSetting = newData
                setEditingKey('');
            }
            console.log(data)
            setState(({ count }) => ({ count: count + 1 }));

        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'Site',
            dataIndex: 'Line',
            width: '15%',
            align: 'center',
            editable: false,
        },
        {
            title: 'Parameter',
            dataIndex: 'Parameter',
            width: '25%',
            align: 'center',
            editable: false,
        },

        {
            title: 'Upper Threshold',
            dataIndex: 'HighThreshold',
            width: '15%',
            align: 'center',
            editable: true,
        },
        {
            title: 'Activation',
            dataIndex: 'HighThreshold_active',
            width: '10%',
            align: 'center',
            editable: true,
            render: (record) => {
                return (
                    <Switch checked={record} disabled={isEditing} />
                )
            }
        },

        {
            title: 'Lower Threshold',
            dataIndex: 'LowThreshold',
            width: '15%',
            align: 'center',
            editable: true,
        },
        {
            title: 'Activation',
            dataIndex: 'LowThreshold_active',
            width: '10%',
            align: 'center',
            editable: true,
            render: (record) => {
                return (
                    // SelectorHandler(record)
                    <Switch checked={record} disabled={isEditing} />
                )
            }
        },

        {
            title: 'Operation',
            dataIndex: 'operation',
            width: '20%',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <a
                            href="javascript:;"
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </a>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.title === 'Activation' ? 'checked' : 'number',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const GetSetting = async() =>{

    }

    const DataRequest = async (label, site, page, line) => {
        const response = await RealtimeData_Request(label, site, page, line)
        ValueSetting = DataSortST(response)

        ValueSetting.forEach(element => {
            element.Parameter = element.label
        });


        console.log(ValueSetting);
        setState(({ count }) => ({ count: count + 1 }));

    }


    const RenderNewData = () => {
        DataRequest([], 'Polymerlink', Blankpage, 'C3')
    }

    useEffect(() => {
        RenderNewData()
        console.log('sdsd');
        return () => {
            console.log("unmount");
        }

    }, []);

    const SettingSavehandler = async () => {
        console.log(ValueSetting);

        const WriteStatus = await write_setting(ValueSetting, 'C3', Blankpage)

        console.log(WriteStatus)
        if (WriteStatus["success"] === true) {
            console.log('success')
            RenderNewData()        }

        else { 
            console.log('fail')
            RenderNewData() 
         }

        console.log(ValueSetting)
    }


    return (
        <div style={{marginTop:'20px'}}>
            <Card title='C3 Notification Setting' bordered={true} style={{ width: '100%', borderRadius: 15, backgroundColor: '#c4c4c4' }}
                bodyStyle={{ backgroundColor: '#575757', borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }} hoverable={true}>

                <Button onClick={SettingSavehandler} style={{ marginBottom: '8px' }}> Save </Button>

                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        scroll={{ x: 500, y: 800 }}
                        dataSource={ValueSetting}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        pagination={false}


                    />
                </Form>
            </Card>
        </div>
    )
}

export default NotificationC3
