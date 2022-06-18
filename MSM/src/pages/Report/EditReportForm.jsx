import {
    Form,
    Input,
    Button,
    DatePicker,
    Modal,
} from 'antd';
import moment from 'moment';


import React, { useState, useEffect } from 'react'

const { RangePicker } = DatePicker;


const EditReportForm = (props) => {
    const [visible, setVisible] = useState(false);

    const InitialValue = {
        'Job'           : props.InfoData['Job No' ],
        'Job Period'    : [moment(props.InfoData['Start Time'], "DD-MM-yyyy HH:mm:ss"),moment(props.InfoData['End Time'], "DD-MM-yyyy HH:mm:ss")],
        'Color'         : props.InfoData['Color'],
        'Grade'         : props.InfoData['Grade'],
        'Actual Product': props.InfoData['Actual Product'],
        'Estimated Rate': props.InfoData['Estimated Rate']
    }


    const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
        const [form] = Form.useForm();
        return (
            <Modal
                visible={visible}
                title="New Job"
                okText="Create"
                cancelText="Cancel"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            onCreate(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={InitialValue}

                >
                    <Form.Item
                        name="Job"
                        label="Job No"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the title of collection!',
                            },
                        ]}
                    >
                        <Input defaultValue={props.InfoData['Job No']}/>
                    </Form.Item>
    
                    <Form.Item
                        name="Job Period"
                        label="Job Period"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the title of collection!',
                            },
                        ]}
                    >
                        <RangePicker showTime 
                            defaultValue={[moment(props.InfoData['Start Time'], "DD-MM-yyyy HH:mm:ss"),moment(props.InfoData['End Time'], "DD-MM-yyyy HH:mm:ss")]}
                            format={"DD-MM-yyyy HH:mm:ss"}
                        />
                    </Form.Item>
    
                    <Form.Item
                        name="Grade"
                        label="Grade"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the title of collection!',
                            },
                        ]}
                    >
                        <Input defaultValue={props.InfoData['Grade']}/>
                    </Form.Item>
    
                    <Form.Item
                        name="Color"
                        label="Color"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the title of collection!',
                            },
                        ]}
                    >
                        <Input defaultValue={props.InfoData['Color']}/>
                    </Form.Item>
    
                    <Form.Item
                        name="Estimated Rate"
                        label="Estimated Rate (Kg/hr)"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the title of collection!',
                            },
                        ]}
                    >
                        <Input defaultValue={props.InfoData['Estimated Rate']}/>
                    </Form.Item>
    
                    <Form.Item
                        name="Actual Product"
                        label="Actual Product (kg)"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the title of collection!',
                            },
                        ]}
                    >
                        <Input defaultValue={props.InfoData['Actual Product']} />
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    console.log('Repos');

    useEffect(() => {
        console.log('red');
        // setVisible(props.Visibility)

        return () => {
            
        }
    }, [])

    const onCreate = (values) => {
        console.log('Received values of form: ', values);
        let info = {}

        let DateTime = values['Job Period']
        info.info1 = values['Job']
        info.info2 = values['Grade']
        info.info3 = values['Color']
        info.info4 = values['Estimated Rate']
        info.info5 = values['Actual Product']

        let StartTime   = DateTime[0].toISOString(false).split('.')[0] + "Z"
        let EndTime     = DateTime[1].toISOString(false).split('.')[0] + "Z"

        console.log(values);

        props.CreateJobCallBack(info, StartTime, EndTime, props.site, props.line)
        onCancel()

        setVisible(false);
    }

    const onCancel = () =>{
        props.callbackClose()
    }

    const setVisibleHandler = () =>{
        setVisible(true);
    }

    return (
        <div style={{paddingTop:'10px'}}>
            <CollectionCreateForm
                visible={props.Visibility}
                onCreate={onCreate}
                onCancel={() => {
                    onCancel()
                }}
            />
        </div>
    );
}

export default EditReportForm

