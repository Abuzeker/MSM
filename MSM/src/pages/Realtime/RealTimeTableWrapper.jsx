import { Card, Table, Typography } from 'antd';
import React from 'react'

const columns = [
    {
        title: 'Parameter',
        dataIndex: 'Label',
    },
    {
        title: 'PV',
        dataIndex: 'Value',
    },
    {
        title: 'SV',
        dataIndex: 'SV',
    },
    {
        title: 'Update Time',
        dataIndex: 'time',
    },
];

const { Title } = Typography;


const RealTimeTableWrapper = (props) => {

    let TableData = props.TableData

    //console.log(props.TableData);

    return (
        <div>

            <Title level={2} underline>
                {props.TableTitle}
            </Title>
            <Card title='RealTime' bordered={true}
                style={{ width: '100%', borderRadius: 15, }} hoverable={true}>
                <Table bordered columns={columns} dataSource={TableData} size="small" scroll={{ y: 500 }} pagination={false} />
            </Card>
        </div>
    )
}

export default RealTimeTableWrapper


// onRow={(record, rowIndex) => {
//     return {
//         onClick: event => {
//             RowClickhandler(record)
//         }, // click row
//     };
// }} 