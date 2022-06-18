import { DatePicker, Table } from 'antd';
import React from 'react'
import { ConvertMonentToDateTime } from '../../DataRequest/LogDataRequestWrap';

const ReportListWrapper = (props) => {

    let DateTimeRange
    const { RangePicker } = DatePicker;

    const SetTimeHandler = (value) => {
        DateTimeRange = ConvertMonentToDateTime(value)
        props.ReportListCallBack([], DateTimeRange[0], DateTimeRange[1], props.site, props.line, props.BufferName)

    }

    return (
        <div style={{ paddingTop: '10px' }}>
            
            <div style={{ paddingBottom: '10px' }}>

                <RangePicker showTime
                    onOk={SetTimeHandler}
                    style={{ paddingTop: '10px' }}
                />

            </div>


            <Table columns={props.Columb} dataSource={props.ReportList} bordered scroll={{ x: 1000, y: 500 }} pagination={false} size="small" />

        </div>
    )
}

export default ReportListWrapper
