import { Line } from '@antv/g2plot';
import { Button, Col, DatePicker, PageHeader, Row, Statistic, Table, Descriptions, Badge, Card } from 'antd';
import React, { useEffect } from 'react'
import { ExportExcelWorkBook, SetDateRange } from '../../DataRequest/LogDataRequestWrap';
import { GeneratePDFG2, NameColumbPDF } from '../../utils/PdfGenerate';
import './NameTableWrapper.css';

let line


const ReportGraph = (props) => {


    // const SetTimeRange = (value) => {
    //     const DateRange = SetDateRange(value)
    //     props.SetTimeRangeCallBack([], DateRange[0], DateRange[1], 'Polymerlink', props.site, props.page, props.BufferName, props.Model)
    // }

    // const generatePDF = () => {
    //     let headers = NameColumbPDF(props.Model)
    //     GeneratePDFG2(headers, props.LogValue, props.JobInfo)
    // }

    useEffect(() => {
        line = new Line('ReportAnalysis', {
            data: props.RunningStep,
            xField: 'Time',
            yField: 'State',
            seriesField: 'Parameter',
            xAxis: {
                range: [0, 1],
            },
        })
        line.render()
        return () => {
            line.destroy();
        }
    }, [])

    try{
        line.changeData(props.RunningStep)
    }
    catch{}

    return (
        <div style={{ paddingTop: '20px' }}>
            <Descriptions
                bordered
                size='big'
                column={3}
                style={{ background: 'white' }}
            >
                {/* <Descriptions.Item label="Job No.">Cloud Database</Descriptions.Item> */}
                <Descriptions.Item label="Job Period">{props.ReportAnalysis.TotalPeriod}</Descriptions.Item>
                <Descriptions.Item label="Expected Production Rate (Kg/Hour)" >{props.ReportAnalysis.ExpectedRate}</Descriptions.Item>
                <Descriptions.Item label="Estimate Product (Kg)">{props.ReportAnalysis.ExpectedProduct}</Descriptions.Item>

                <Descriptions.Item label="Running Period">{props.ReportAnalysis.RunPeriod}</Descriptions.Item>
                <Descriptions.Item label="Actual Production Rate (Kg/Hour)" >{props.ReportAnalysis.ActualRate}</Descriptions.Item>
                <Descriptions.Item label="Actual Product (Kg)">{props.ReportAnalysis.ActualProduct}</Descriptions.Item>

                <Descriptions.Item label="Effective Time (%)">{props.ReportAnalysis.EffectiveTime}</Descriptions.Item>
                <Descriptions.Item label="Production Rate Efficiency (%)" >{props.ReportAnalysis.RateEfficiency}</Descriptions.Item>
                <Descriptions.Item label="Product Effciency (%)">{props.ReportAnalysis.Effciency}</Descriptions.Item>

            </Descriptions>


            <Card title={'Timing Graph'} bordered={true} style={{
                width: '100%', borderRadius: 15,
                backgroundColor: '#ffffff', marginTop: '15px'
            }} hoverable={true}>
                <div id='ReportAnalysis'></div>
            </Card>




        </div >
    )
}

export default ReportGraph
