import {
    Form,
    Input,
    Button,
    DatePicker,
    Modal,
} from 'antd';

import React, { useState, useEffect } from 'react'

const { RangePicker } = DatePicker;

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
                initialValues={{
                    modifier: 'public',
                }}
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
                    <Input />
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
                    <RangePicker showTime />
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
                    <Input />
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
                    <Input />
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
                    <Input />
                </Form.Item>

                {/* <Form.Item
                    name="Actual Product"
                    label="Actual Product (kg)"
                    rules={[
                        {
                            required: false,
                            message: 'Please input the title of collection!',
                        },
                    ]}
                >
                        <Input disabled={true} />
                </Form.Item> */}
            </Form>
        </Modal>
    );
};

const ReportWrapper = (props) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        console.log('red');
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
        info.info5 = 0

        let StartTime   = DateTime[0].toISOString(false).split('.')[0] + "Z"
        let EndTime     = DateTime[1].toISOString(false).split('.')[0] + "Z"

        props.CreateJobCallBack(info, StartTime, EndTime, props.site, props.line)
        setVisible(false);
    }



    return (
        <div style={{paddingTop:'10px'}}>
            <Button
                type="primary"
                onClick={() => {
                    setVisible(true);
                }}
            >
                New Job
            </Button>
            <CollectionCreateForm
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
            />
        </div>
    );
}

export default ReportWrapper
