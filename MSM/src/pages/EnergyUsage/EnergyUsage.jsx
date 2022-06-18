
import { Button, Col, Divider, Row, DatePicker, Card, Table, Select, Spin, Typography } from 'antd'
import React, { useState, useEffect } from 'react'
import { logdata_request, MSM_EventLog_request, MSM_logdata_request } from '../../api'
import { C3Model, C3ModelMap, G2Model, MSMTable, DummyData, MSMDailyTable, MSMShiftTable } from '../../DataRequest/DataModel'
import {
    ConvertMonentToDateTime, EventSortTimeMSM, GetDateTime,
    DataSortTimeMSM, LogDataMappingTime, LogDataMappingTimeMSM,
    LogDataMappingNameMSM
} from '../../DataRequest/LogDataRequestWrap'
import { Line, Column } from '@antv/g2plot';
import moment from 'moment';
import { CSVLink, CSVDownload } from "react-csv";


let DTinitial = GetDateTime(0, 1)  // get from yesterday 00:00 to today 00:00
let DTinitial2 = GetDateTime(0, 1)  // get from yesterday 00:00 to today 00:00
let DTinitial3 = GetDateTime(7, 1)  // get from yesterday 00:00 to today 00:00


let RequestDataOption = ['Line50kg', 'Line1kg', 'Line2kg', 'Line1Ton']
let RequestDataOption_Daily = ['Line50kg_Daily', 'Line1kg_Daily', 'Line2kg_Daily', 'Line1Ton_Daily']
let RequestDataOption_shift = [
    'Line50kg_Morning', 'Line1kg_Morning', 'Line2kg_Morning', 'Line1Ton_Morning',
    'Line50kg_Night', 'Line1kg_Night', 'Line2kg_Night', 'Line1Ton_Night']

let RequestDateRange = [DTinitial[0], DTinitial[1]]

let BarChartRange = [DTinitial3[0], DTinitial3[1]]

let responseSorted = []
const annotations = [];

let EventLogRequestRange = [DTinitial2[0], DTinitial2[1]]
let EventLogSorted = []

let DailyLogRequestRange = [DTinitial2[0], DTinitial2[1]]
let DailyLogSorted = []
let ShiftLogSorted = []


const headersDaily = [
    { label: "DateTime", key: "DateTime" },
    { label: "Line50kg", key: "Line50kg" },
    { label: "Line1kg", key: "Line1kg" },
    { label: "Line2kg", key: "Line2kg" },
    { label: "Line1Ton", key: "Line1Ton" },
];

const headersshift = [
    { label: "DateTime", key: "DateTime" },
    { label: "Shift", key: "Shift" },
    { label: "Line50kg", key: "Line50kg" },
    { label: "Line1kg", key: "Line1kg" },
    { label: "Line2kg", key: "Line2kg" },
    { label: "Line1Ton", key: "Line1Ton" },
];

const headersEvent = [
    { label: "DateTime", key: "DateTime" },
    { label: "Shift", key: "Shift" },
    { label: "Tag", key: "Tag" },
    { label: "IdUnit", key: "IdUnit" },
    { label: "Label", key: "Label" },
    { label: "Weight", key: "Weight" },
    { label: "Location", key: "Location" },

];



const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography


let line, stackedColumnPlot

const EnergyUsage = () => {

    const [state, setState] = useState({ count: 0 });
    const [Loading, setLoading] = useState(false);
    const [sortedInfo, setSortedInfo] = useState({});
    const [sortedInfo2, setSortedInfo2] = useState({});


    const LogColumbPerTime = [
        {
            title: 'DateTime',
            width: 40,
            dataIndex: 'DateTime',
            key: 'DateTime',
            align: 'center',

            sorter: (a, b) =>
                new Date(moment(a.DateTime, "YYYY/MM/DD hh:mm:ss ").format("LLL")) -
                new Date(moment(b.DateTime, "YYYY/MM/DD hh:mm:ss ").format("LLL")),

            sortOrder: sortedInfo2.columnKey === 'DateTime' ? sortedInfo2.order : null,
            ellipsis: true,
        },

        {
            title: 'Shift',
            width: 20,
            dataIndex: 'Shift',
            key: 'Shift',
            align: 'center',

            filters: [
                {
                    text: 'Morning',
                    value: 'Morning',
                },
                {
                    text: 'Night',
                    value: 'Night',
                },
            ],
            onFilter: (value, record) => record.Shift.indexOf(value) === 0,
        },

        {
            title: 'Tag',
            width: 60,
            dataIndex: 'Tag',
            key: 'Tag',
            align: 'center',
        },
        {
            title: 'Id Unit',
            width: 20,
            dataIndex: 'IdUnit',
            key: 'IdUnit',
            align: 'center',

            sorter: (a, b) => a.IdUnit - b.IdUnit,
            sortOrder: sortedInfo2.columnKey === 'IdUnit' ? sortedInfo2.order : null,
            ellipsis: true,
        },
        {
            title: 'Label',
            width: 20,
            dataIndex: 'Label',
            key: 'Label',
            align: 'center',

            filters: [
                {
                    text: 'Line50kg',
                    value: 'Line50kg',
                },
                {
                    text: 'Line1kg',
                    value: 'Line1kg',
                },
                {
                    text: 'Line2kg',
                    value: 'Line2kg',
                },
                {
                    text: 'Line1Ton',
                    value: 'Line1Ton',
                },
            ],
            onFilter: (value, record) => record.Label.indexOf(value) === 0,
        },

        {
            title: 'Weight',
            width: 20,
            dataIndex: 'Weight',
            key: 'Weight',
            align: 'center',
        },
        {
            title: 'Location',
            width: 20,
            dataIndex: 'Location',
            key: 'Location',
            align: 'center',
        },
    ]

    const handleChangeOverall = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        setSortedInfo(sorter);
    };

    const handleChangePertime = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        setSortedInfo2(sorter);
    };

    const EvenLogRequest = async () => {
        let response = await MSM_EventLog_request(RequestDataOption, EventLogRequestRange[0], EventLogRequestRange[1])
        //  let DailyLogSorted = LogDataMappingTimeMSM(MSMTable,response)   
        EventLogSorted = EventSortTimeMSM(response)
        // console.log(EventLogSorted);
        setState(({ count }) => ({ count: count + 1 }));
    }

    useEffect(() => {
        console.log('Reffect');

        stackedColumnPlot = new Column('container', {
            data: responseSorted,
            isStack: true,
            xField: 'date',
            yField: 'Value',
            seriesField: 'type',
            label: {
                position: 'middle',
                layout: [
                    { type: 'interval-adjust-position' },
                    { type: 'interval-hide-overlap' },
                    { type: 'adjust-color' },
                ],
            },
            annotations,
        });

        BarChartInit()


        try { stackedColumnPlot.render(); }
        catch { }

        return () => {
            stackedColumnPlot.destroy()
        }
    }, [])


    const BarChartInit = async () => {
        // setLoading(true)
        // console.log(Parameter)
        let response = await MSM_logdata_request(RequestDataOption_Daily, BarChartRange[0], BarChartRange[1])
        let BarChartData = DataSortTimeMSM(response)

        stackedColumnPlot.changeData(BarChartData)
        console.log(BarChartData);
        // setLoading(false)
        setState(({ count }) => ({ count: count + 1 }));
    }


    const LogColumb = [
        {
            title: 'DateTime',
            width: 70,
            dataIndex: 'DateTime',
            key: 'DateTime',
            align: 'center',

            sorter: (a, b) =>
                new Date(moment(a.DateTime, "YYYY/MM/DD hh:mm:ss ").format("LLL")) -
                new Date(moment(b.DateTime, "YYYY/MM/DD hh:mm:ss ").format("LLL")),

            sortOrder: sortedInfo.columnKey === 'DateTime' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: '50 kG',
            width: 70,
            dataIndex: 'Line50kg',
            key: 'Line50kg',
            align: 'center',

            sorter: (a, b) => a.Line50kg - b.Line50kg,
            sortOrder: sortedInfo.columnKey === 'Line50kg' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: '1 kG',
            width: 70,
            dataIndex: 'Line1kg',
            key: 'Line1kg',
            align: 'center',

            sorter: (a, b) => a.Line1kg - b.Line1kg,
            sortOrder: sortedInfo.columnKey === 'Line1kg' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: '2 kG',
            width: 70,
            dataIndex: 'Line2kg',
            key: 'Line2kg',
            align: 'center',

            sorter: (a, b) => a.Line2kg - b.Line2kg,
            sortOrder: sortedInfo.columnKey === 'Line2kg' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: '1 Ton',
            width: 70,
            dataIndex: 'Line1Ton',
            key: 'Line1Ton',
            align: 'center',

            sorter: (a, b) => a.Line1Ton - b.Line1Ton,
            sortOrder: sortedInfo.columnKey === 'Line1Ton' ? sortedInfo.order : null,
            ellipsis: true,
        },

    ]

    const LogColumbShift = [
        {
            title: 'DateTime',
            width: 50,
            dataIndex: 'DateTime',
            key: 'DateTime',
            align: 'center',

            sorter: (a, b) =>
                new Date(moment(a.DateTime, "YYYY/MM/DD hh:mm:ss ").format("LLL")) -
                new Date(moment(b.DateTime, "YYYY/MM/DD hh:mm:ss ").format("LLL")),

            sortOrder: sortedInfo.columnKey === 'DateTime' ? sortedInfo.order : null,
            ellipsis: true,
        },

        {
            title: 'Shift',
            width: 20,
            dataIndex: 'Shift',
            key: 'Shift',
            align: 'center',

            filters: [
                {
                    text: 'Morning',
                    value: 'Morning',
                },
                {
                    text: 'Night',
                    value: 'Night',
                },
            ],
            onFilter: (value, record) => record.Shift.indexOf(value) === 0,
        },

        {
            title: '50 KG',
            width: 35,
            dataIndex: 'Line50kg',
            key: 'Line50kg',
            align: 'center',

            sorter: (a, b) => a.Line50kg - b.Line50kg,
            sortOrder: sortedInfo.columnKey === 'Line50kg' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: '1 KG',
            width: 35,
            dataIndex: 'Line1kg',
            key: 'Line1kg',
            align: 'center',

            sorter: (a, b) => a.Line1kg - b.Line1kg,
            sortOrder: sortedInfo.columnKey === 'Line1kg' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: '2 KG',
            width: 35,
            dataIndex: 'Line2kg',
            key: 'Line2kg',
            align: 'center',

            sorter: (a, b) => a.Line2kg - b.Line2kg,
            sortOrder: sortedInfo.columnKey === 'Line2kg' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: '1 TON',
            width: 35,
            dataIndex: 'Line1Ton',
            key: 'Line1Ton',
            align: 'center',

            sorter: (a, b) => a.Line1Ton - b.Line1Ton,
            sortOrder: sortedInfo.columnKey === 'Line1Ton' ? sortedInfo.order : null,
            ellipsis: true,
        },

    ]

    const DailyLogRequest = async (type, Model) => {
        //  let DailyLogSorted = LogDataMappingTimeMSM(MSMTable,response)   
        console.log(DailyLogRequestRange);
        let response = []

        switch (type) {
            case 'shift':
                response = await MSM_logdata_request(RequestDataOption_shift, DailyLogRequestRange[0], DailyLogRequestRange[1])
                ShiftLogSorted = LogDataMappingNameMSM(Model, DataSortTimeMSM(response), type)
                console.log(ShiftLogSorted);
                break;

            case 'daily':
                response = await MSM_logdata_request(RequestDataOption_Daily, RequestDateRange[0], RequestDateRange[1])
                DailyLogSorted = LogDataMappingNameMSM(Model, DataSortTimeMSM(response), type)
                console.log(DailyLogSorted);
                break;

            default:
                break;
        }
        setState(({ count }) => ({ count: count + 1 }));
    }

    const ChangeDateRange = (value, type) => {

        switch (type) {
            case 'Daily':
                RequestDateRange = []
                RequestDateRange = ConvertMonentToDateTime(value)
                break;

            case 'Event':
                EventLogRequestRange = []
                EventLogRequestRange = ConvertMonentToDateTime(value)
                break;

            case 'shift':
                DailyLogRequestRange = []
                DailyLogRequestRange = ConvertMonentToDateTime(value)
                break;

            default:
                break;
        }




        // console.log(RequestDateRange);
    }


    const ChangeOption = (value) => {

        if (value === 'All') {
            RequestDataOption = ['Line50kg', 'Line1kg', 'Line2kg', 'Line1Ton']
        }

        else {
            console.log(`selected ${value}`);
            RequestDataOption = []
            RequestDataOption.push(value)
        }
    }

    return (
        <div>
            <div style={{ paddingBottom: '10px' }}>
                <Divider orientation="left">Daily Count Log</Divider>
            </div>


            {/* <Spin tip="Loading..." spinning={Loading} size="large"> */}
                <Card title={'Weekly Record'} bordered={true} style={{ width: '100%', borderRadius: 15, backgroundColor: '#ffffff' }} hoverable={true}>
                    <div id='container'></div>
                </Card>
            {/* </Spin> */}


            <div style={{ paddingBottom: '10px' }}>
                <Divider orientation="left">Daily Log</Divider>
            </div>

            <div style={{ paddingBottom: '10px' }}>
                <RangePicker onChange={(e) => ChangeDateRange(e, 'Daily')} />

                <Button type='primary' style={{ marginLeft: '10px' }} >
                    <CSVLink data={DailyLogSorted} target="_blank" filename={"DataLog.csv"} headers={headersDaily}>
                        Export
                    </CSVLink>
                </Button>

                <Button type='primary' style={{ marginLeft: '10px' }} onClick={(e) => { DailyLogRequest('daily', MSMDailyTable)}}>Update</Button>
            </div>


            <Card title='Daily Log' bordered={true}
                style={{ width: '100%', borderRadius: 15, marginBottom: '10px' }} hoverable={true}>
                <Table bordered columns={LogColumb} dataSource={DailyLogSorted} size="small" scroll={{ y: 500 }}
                    onChange={handleChangeOverall} pagination={false} />
            </Card>

            {/* shift log */}

            <div style={{ paddingBottom: '10px' }}>
                <Divider orientation="left">Shift Log</Divider>
            </div>

            <div style={{ paddingBottom: '10px' }}>
                <RangePicker onChange={(e) => ChangeDateRange(e, 'shift')} />

                <Button type='primary' style={{ marginLeft: '10px' }} >
                    <CSVLink data={ShiftLogSorted} target="_blank" filename={"ShiftLog.csv"} headers={headersshift}>
                        Export
                    </CSVLink>
                </Button>

                <Button type='primary' style={{ marginLeft: '10px' }} onClick={(e) => { DailyLogRequest('shift', MSMShiftTable)}}>Update</Button>
            </div>

            <Card title='Shift Log' bordered={true}
                style={{ width: '100%', borderRadius: 15, marginBottom: '10px' }} hoverable={true}>
                <Table bordered columns={LogColumbShift} dataSource={ShiftLogSorted} size="small" scroll={{ y: 500 }}
                    onChange={handleChangeOverall} pagination={false} />
            </Card>

            {/* shift log */}



            <div style={{ marginTop: '16px' }}>

                <div style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                    <Divider orientation="left">Event Log</Divider>
                </div>

                <div style={{ paddingBottom: '10px' }}>
                        <RangePicker showTime onChange={(e) => ChangeDateRange(e, 'Event')} onOk={(e) => ChangeDateRange(e, 'Event')} />

                        <Select defaultValue="Line50kg" style={{ width: 100, marginLeft: '10px' }} onChange={ChangeOption}>
                            <Option value="All">All</Option>
                            <Option value="Line50kg">Line50kg</Option>
                            <Option value="Line1kg">Line1kg</Option>
                            <Option value="Line2kg">Line2kg</Option>
                            <Option value="Line1Ton">Line1Ton</Option>
                        </Select>

                        <Button type='primary' style={{ marginLeft: '10px' }} >
                            <CSVLink data={EventLogSorted} target="_blank" filename={"EventLog.csv"} headers={headersEvent}>
                                Export
                            </CSVLink>
                        </Button>



                        <Button type='primary' style={{ marginLeft: '10px' }} onClick={() => { EvenLogRequest() }}>Update</Button>
                    </div>

                <Card title='Event Log' bordered={true}
                    style={{ width: '100%', borderRadius: 15, marginBottom: '10px' }} hoverable={true}>
                    <Table bordered columns={LogColumbPerTime} dataSource={EventLogSorted} scroll={{ x: 600, y: 750 }} pagination={true} size="small" onChange={handleChangePertime} />
                </Card>

            </div>



        </div>
    )
}

export default EnergyUsage

