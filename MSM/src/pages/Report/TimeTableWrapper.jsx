import { Button, DatePicker, Table } from 'antd';
import React from 'react'
import { ExportExcelWorkBook, SetDateRange, TableColumbTimeAsRow } from '../../DataRequest/LogDataRequestWrap';
import { GeneratePDFC3, TimeColumbPDF } from '../../utils/PdfGenerate';


const TimeTableWrapper = (props) => {

    const SetTimeRange = (value) => {
        const DateRange = SetDateRange(value)
        props.SetTimeRangeCallBack([], DateRange[0], DateRange[1], 'Polymerlink', props.site, props.page, props.BufferName, props.Model )
    }

    const generatePDF = () => {
        let headers = TimeColumbPDF()
        GeneratePDFC3(headers, props.LogValue, props.JobInfo)
    }

    return (
        <div style={{paddingTop:'10px'}}>
            <DatePicker onChange={SetTimeRange} />
            <Button onClick={() => ExportExcelWorkBook(props.LogValue, props.Model, 'A7', 'R7', 'ExtruderSheet.xlsx')} > Export C3 </Button>

            {/* <Button onClick={generatePDF}> export </Button> */}
            <Table columns={props.Columb} dataSource={props.LogValue} bordered scroll={{ x: 2000, y: 500 }} pagination={false} size="small" />
        </div>
    )
}

export default TimeTableWrapper
