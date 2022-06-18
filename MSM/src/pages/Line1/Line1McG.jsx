import { Button, Col, Divider, Row, DatePicker, Card, Table, Select, Typography, Statistic, PageHeader } from 'antd'
import React, { useState, useEffect } from 'react'
import { logdata_request, RealtimeData_Request } from '../../api'
import { McGuire } from '../../DataRequest/DataModel'
import { ConvertMonentToDateTimeSingle, ConvertMonentToDateTime, DataSortTime, DataSortTimeMcG, GetDateTime, LogDataMappingName, LogDataMappingNameRT, LogDataMappingTimeMcG } from '../../DataRequest/LogDataRequestWrap'
import { Line } from '@antv/g2plot';
import moment from 'moment';
import { DataSortRT } from '../../DataRequest/RealTimeRequestWrap'

const property = [
    'PROPERTY_1', 'PROPERTY_2', 'PROPERTY_3', 'PROPERTY_4', 'PROPERTY_5',
    'FINAL_DISP_FINAL_1', 'FINAL_DISP_FINAL_2', 'FINAL_DISP_FINAL_3', 'FINAL_DISP_FINAL_4', 'FINAL_DISP_FINAL_5',
    'FINAL_DISP_TOTAL',
    'FINAL_DISP_INIT_1', 'FINAL_DISP_INIT_2', 'FINAL_DISP_INIT_3', 'FINAL_DISP_INIT_4', 'FINAL_DISP_INIT_5',
    'RETRY_1', 'RETRY_2', 'RETRY_3', 'RETRY_4', 'RETRY_5'
]

let DTinitial = GetDateTime(1, 1)
let DTc3 = [], DTg2 = []
let MCGDTRange = [], ComAvg = []

let PreviousRequestTime
let CurrentRequestTime

DTc3.push(moment(DTinitial[2]))
DTc3.push(moment(DTinitial[3]))
DTg2 = DTc3


let LogValue = {
    "MCGTable": [],
}

let RealTimeValue = {
    "MCGTable": [],
}
const { RangePicker } = DatePicker;
const { Title } = Typography;

const columnsMcGRT = [
    {
        title: 'Date',
        dataIndex: 'time',
    },
    {
        title: 'Com1',
        children: [
            {
                title: 'PV',
                dataIndex: 'FINAL_DISP_FINAL_1',
            },
            {
                title: 'SV',
                dataIndex: 'PROPERTY_1',
            },
            {
                title: 'Dispense (g)',
                dataIndex: '1ST_DISP_TIME_INIT_1',
            },
        ]
    },

    {
        title: 'Com2',
        children: [
            {
                title: 'PV',
                dataIndex: 'FINAL_DISP_FINAL_2',
            },
            {
                title: 'SV',
                dataIndex: 'PROPERTY_2',
            },
            {
                title: 'Dispense (g)',
                dataIndex: '1ST_DISP_TIME_INIT_2',
            },
        ]
    },

    {
        title: 'Com3',
        children: [
            {
                title: 'PV',
                dataIndex: 'FINAL_DISP_FINAL_3',
            },
            {
                title: 'SV',
                dataIndex: 'PROPERTY_3',
            },
            {
                title: 'Dispense (g)',
                dataIndex: '1ST_DISP_TIME_INIT_3',
            },
        ]
    },

    {
        title: 'Com4',
        children: [
            {
                title: 'PV',
                dataIndex: 'FINAL_DISP_FINAL_4',
            },
            {
                title: 'SV',
                dataIndex: 'PROPERTY_4',
            },
            {
                title: 'Dispense (g)',
                dataIndex: '1ST_DISP_TIME_INIT_4',
            },
        ]
    },

    {
        title: 'Com5',
        children: [
            {
                title: 'PV',
                dataIndex: 'FINAL_DISP_FINAL_5',
            },
            {
                title: 'SV',
                dataIndex: 'PROPERTY_5',
            },
            {
                title: 'Dispense (g)',
                dataIndex: '1ST_DISP_TIME_INIT_5',
            },
        ]
    },

];

const columnsMcG = [
    {
        title: 'Date',
        dataIndex: 'Time',
        width: 100,
    },
    {
        title: 'Com1',
        children: [
            {
                title: 'PV',
                dataIndex: 'FINAL_DISP_FINAL_1',
                width: 70,
                align: 'center',
            },
            {
                title: 'SV',
                dataIndex: 'PROPERTY_1',
                width: 70,
                align: 'center',
            },
            {
                title: 'Output(g)',
                dataIndex: 'FINAL_DISP_INIT_1',
                width: 100,
                align: 'center',
            },
            {
                title: 'Retry',
                dataIndex: 'RETRY_1',
                width: 70,
                align: 'center',
                render(text, record) {
                    // console.log(text);
                    if (text === undefined) {
                        text = "0"
                        return text
                    }
                    else {
                        return text
                    }
                }
            },
        ]
    },

    {
        title: 'Com2',
        children: [
            {
                title: 'PV',
                dataIndex: 'FINAL_DISP_FINAL_2',
                width: 70,
                align: 'center',
            },
            {
                title: 'SV',
                dataIndex: 'PROPERTY_2',
                width: 70,
                align: 'center',
            },
            {
                title: 'Output(g)',
                dataIndex: 'FINAL_DISP_INIT_2',
                width: 100,
                align: 'center',
            },
            {
                title: 'Retry',
                dataIndex: 'RETRY_2',
                width: 70,
                align: 'center',
                render(text, record) {
                    // console.log(text);
                    if (text === undefined) {
                        text = "0"
                        return text
                    }
                    else {
                        return text
                    }
                }
            },
        ]
    },

    {
        title: 'Com3',
        children: [
            {
                title: 'PV',
                dataIndex: 'FINAL_DISP_FINAL_3',
                width: 70,
                align: 'center',
            },
            {
                title: 'SV',
                dataIndex: 'PROPERTY_3',
                width: 70,
                align: 'center',
            },
            {
                title: 'Output(g)',
                dataIndex: 'FINAL_DISP_INIT_3',
                width: 100,
                align: 'center',
            },
            {
                title: 'Retry',
                dataIndex: 'RETRY_3',
                width: 70,
                align: 'center',
                render(text, record) {
                    // console.log(text);
                    if (text === undefined) {
                        text = "0"
                        return text
                    }
                    else {
                        return text
                    }
                }
            },
        ]
    },

    {
        title: 'Com4',
        children: [
            {
                title: 'PV',
                dataIndex: 'FINAL_DISP_FINAL_4',
                width: 70,
                align: 'center',
            },
            {
                title: 'SV',
                dataIndex: 'PROPERTY_4',
                width: 70,
                align: 'center',
            },
            {
                title: 'Output(g)',
                dataIndex: 'FINAL_DISP_INIT_4',
                width: 100,
                align: 'center',
            },
            {
                title: 'Retry',
                dataIndex: 'RETRY_4',
                width: 70,
                align: 'center',
                render(text, record) {
                    // console.log(text);
                    if (text === undefined) {
                        text = "0"
                        return text
                    }
                    else {
                        return text
                    }
                }
            },
        ]
    },

    {
        title: 'Com5',
        children: [
            {
                title: 'PV',
                dataIndex: 'FINAL_DISP_FINAL_5',
                width: 70,
                align: 'center',
            },
            {
                title: 'SV',
                dataIndex: 'PROPERTY_5',
                width: 70,
                align: 'center',
            },
            {
                title: 'Output(g)',
                dataIndex: 'FINAL_DISP_INIT_5',
                width: 100,
                align: 'center',
            },
            {
                title: 'Retry',
                dataIndex: 'RETRY_5',
                width: 70,
                align: 'center',
                render(text, record) {
                    // console.log(text);
                    if (text === undefined) {
                        text = "0"
                        return text
                    }
                    else {
                        return text
                    }
                }
            },
        ]
    },

    {
        title: 'Total Dispanse',
        dataIndex: 'FINAL_DISP_TOTAL',
        width: 80,
        align: 'center',
    }
];


const Line1McG = () => {

    const [state, setState] = useState({ count: 0 });

    useEffect(() => {
        RenderNewData()

        const interval = setInterval(() => {
            RenderNewData()
        }, 10000)

        return () => {
            clearInterval(interval)
            console.log('Unmount Effect Line1RT');
        }
    }, [])

    const RenderNewData = () => {

        DataRequest(property, 'Polymerlink', '1', 'Maguire C3', "MCGTable")
        setState(({ count }) => ({ count: count + 1 }));
    }

    const DataRequest = async (label, site, page, line, TableName) => {
        const response = await RealtimeData_Request(label, site, page, line)
        RealTimeValue[TableName] = LogDataMappingNameRT(McGuire, DataSortRT(response))
    }

    const AvgAppend = (data) => {
        const type = ['FINAL_DISP_INIT_1', 'FINAL_DISP_INIT_2', 'FINAL_DISP_INIT_3', 'FINAL_DISP_INIT_4', 'FINAL_DISP_INIT_5', 'FINAL_DISP_TOTAL']
        let ComTotal = 0, totalnumber, i = 0
        let buf = Object.keys(data)
        totalnumber = buf.length
        console.log(data);
        type.forEach(element => {
            data.forEach(element2 => {
                // console.log(element2[element]);

                if (element2[element] !== undefined) {
                    let NumberBuf = parseFloat(element2[element])
                    ComTotal = NumberBuf + ComTotal
                }

            });

            if (i === 5) {
                ComAvg[6] = parseFloat(ComTotal).toFixed(2)
            }

            ComAvg[i] = parseFloat(ComTotal / totalnumber).toFixed(2)
            ComTotal = 0
            i++
        });
        console.log(ComAvg);
    }

    const UpdateTableData = async (Parameter, StartTime, EndTime, Site, Line, Page, BufferName, Model) => {
        const response = await logdata_request(Parameter, StartTime, EndTime, Site, Line, Page)
        // console.log(response);
        let data = LogDataMappingName(McGuire, DataSortTimeMcG(response))

        let DataAvg = AvgAppend(data)

        LogValue[BufferName] = data
        console.log(LogValue[BufferName]);
        setState(({ count }) => ({ count: count + 1 }));
    }

    const MCGLogRequest = async (DT) => {
        DTg2 = DT
        MCGDTRange = ConvertMonentToDateTime(DT)
        await UpdateTableData(property, MCGDTRange[0], MCGDTRange[1], 'Polymerlink', 'Maguire C3', '1', "MCGTable", McGuire)
    }

    const MCGLogRequestBypage = async () => {
        let date1 = new Date();

        console.log(date1);

        await UpdateTableData(property, PreviousRequestTime, CurrentRequestTime, 'Polymerlink', 'Maguire C3', '1', "MCGTable", McGuire)

        let date2 = new Date();

        console.log(date2);
        console.log('Done');
    }

    const NextPage = () =>{
        console.log('nextpge');
        PreviousRequestTime = CurrentRequestTime
        MCGLogRequestBypage()
    }

    const SetInitialDatetime = (Value) =>{
        PreviousRequestTime = ConvertMonentToDateTimeSingle(Value)
        CurrentRequestTime = ConvertMonentToDateTimeSingle(Value.add(1,'hours'))

        console.log(CurrentRequestTime);
        console.log(PreviousRequestTime);
    }

    return (
        <div>

            <div style={{ paddingBottom: '10px', paddingTop: '20px' }}>
                <Divider orientation="left">McGuire C3 RealTime</Divider>
            </div>

            <div>
                <Card title='RealTime' bordered={true}
                    style={{ width: '100%', borderRadius: 15, }} hoverable={true}>
                    <Table bordered columns={columnsMcGRT} dataSource={RealTimeValue['MCGTable']} size="small" scroll={{ y: 500 }} pagination={false} />
                </Card>
            </div>

            <div style={{ paddingBottom: '10px', paddingTop: '20px' }}>
                <Divider orientation="left">McGuire C3 Log Visualize</Divider>
            </div>

            <div style={{ paddingBottom: '10px' }}>
                <RangePicker showTime onOk={MCGLogRequest} />
                <Button type='primary' style={{ marginLeft: '10px' }} onClick={() => { MCGLogRequest(DTg2) }}>Update</Button>
            </div>
            <div className="job-header-wrapper" style={{ borderRadius: '15px' }}>

                <PageHeader
                    className="site-page-header-responsive"
                    ghost={true}
                    title={'Average Value'}
                >
                    <Row gutter={[16, 16]}>
                        <Statistic
                            title="Component 1"
                            value={ComAvg[0]}
                            style={{
                                marginRight: '32px',
                            }}
                        />
                        <Statistic
                            title="Component 2"
                            value={ComAvg[1]}
                            style={{
                                marginRight: '32px',
                            }}
                        />
                        <Statistic
                            title="Component 3"
                            value={ComAvg[2]}
                            style={{
                                marginRight: '32px',
                            }}
                        />
                        <Statistic
                            title="Component 4"
                            value={ComAvg[3]}
                            style={{
                                marginRight: '32px',
                            }}
                        />
                        <Statistic
                            style={{
                                marginRight: '32px',
                            }}
                            title="Component 5"
                            value={ComAvg[4]} />

                        <Statistic
                            style={{
                                marginRight: '32px',
                            }}
                            title="AVG Total"
                            value={ComAvg[5]} />

                        <Statistic
                            style={{
                                marginRight: '32px',
                            }}
                            title="Total"
                            value={ComAvg[6]} />
                    </Row>
                </PageHeader>
            </div>

            {/* <Card title='Log Value McGuire C3' bordered={true}
                style={{ width: '100%', borderRadius: 15, marginBottom: '10px', marginTop:'20px' }} hoverable={true}>
                <Table bordered columns={columnsMcG} dataSource={LogValue['MCGTable']} size="small" scroll={{ y: 500, x:1000 }} pagination={false} />
            </Card> */}

            <div style={{ paddingTop: '50px' }}>
                <Table bordered columns={columnsMcG} dataSource={LogValue['MCGTable']} size="small" scroll={{ y: 500, x: 1000 }} pagination={true} />
                {/* <div align='right'>
                    <DatePicker showTime onOk={SetInitialDatetime}/>
                    <Button type='primary' style={{ marginLeft: '10px' }} onClick={() => {NextPage()}} >Next Page</Button>
                </div> */}
            </div>

        </div>
    )
}

export default Line1McG
