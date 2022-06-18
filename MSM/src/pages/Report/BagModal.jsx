import {
    Form,
    Modal,
    InputNumber,
} from 'antd';

const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            visible={visible}
            title="Bag Input"
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
                    name="Bag"
                    label="Bag"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the title of collection!',
                        },
                    ]}
                >
                    <InputNumber/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const BagModal = (props) => {

    const onCreate = (values) => {
        props.onok(values)    
    }

    return (
        <div>
            <CollectionCreateForm
                visible={props.visible}
                onCreate={onCreate}
                onCancel={() => {
                    props.onCancle()
                }}
            />
        </div>
    );
}

export default BagModal

