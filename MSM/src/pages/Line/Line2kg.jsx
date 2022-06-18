 
import React, { useEffect, useState } from 'react'
import { ReadJob, MSM_RealTime_request, MSM_logdata_request, MSM_EventLog_request } from '../../api'
import {
    DataSortTimeMSM, GetDateTime,
    LogDataMappingNameMSM, MSM_Realtime_GetDateTime, DateDisplay,
    EventSortTimeMSM, Find_initial_Time
} from '../../DataRequest/LogDataRequestWrap';
import { DataSortRT } from '../../DataRequest/RealTimeRequestWrap'
import moment from 'moment';
import { MSMTable } from '../../DataRequest/DataModel';
import { Button, Col, Row, Table, Typography, Statistic, Card, DatePicker, Select } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
// import './home.css'


let DTinitial = GetDateTime(0, 1)  // get from yesterday 00:00 to today 00:00
let DTinitial2 = GetDateTime(7, 1)
let ContingRange = MSM_Realtime_GetDateTime(1, 0)

let RequestDataOption = ['Line50kg', 'Line1kg', 'Line2kg', 'Line1Ton']
let RequestDateRange = [DTinitial[0], DTinitial[1]]
let DailyLogRequestRange = [DTinitial2[0], DTinitial2[1]]
let DailyLogSorted = []
let EventLogSorted = []
let TotalCountProduct = []

let DailyRealTime = {
    'Line50kg': 0,
    'Line1kg': 0,
    'Line2kg': 0,
    'Line1Ton': 0
}

let TotalCount = {
    'Line50kg': 0,
    'Line1kg': 0,
    'Line2kg': 0,
    'Line1Ton': 0
}

let DailyMorningRealTime = {
    'Line50kg': 0,
    'Line1kg': 0,
    'Line2kg': 0,
    'Line1Ton': 0
}

let DailyNightRealTime = {
    'Line50kg': 0,
    'Line1kg': 0,
    'Line2kg': 0,
    'Line1Ton': 0
}

const Line1kg = () => {

    const { Title } = Typography

    const [state, setState] = useState({ count: 0 });
    const [sortedInfo, setSortedInfo] = useState({});
    const [sortedInfo2, setSortedInfo2] = useState({});

    useEffect(() => {


        const interval = setInterval(() => {
            RenderNewData()
        }, 1000)

        DailyLogRequest()
        EvenLogRequest()


        return () => {
            clearInterval(interval)
            console.log('Unmount Effect Line1RT');
        }

    }, [])

    const RenderNewData = () => {
        RealTimeRequest()
    }

    const DailyLogRequest = async () => {
        let response = await MSM_logdata_request(RequestDataOption, DailyLogRequestRange[0], DailyLogRequestRange[1])
        //  let DailyLogSorted = LogDataMappingTimeMSM(MSMTable,response)   
        DailyLogSorted = LogDataMappingNameMSM(MSMTable, DataSortTimeMSM(response))
        console.log(DailyLogSorted);
        setState(({ count }) => ({ count: count + 1 }));
    }

    const EvenLogRequest = async () => {
        let response = await MSM_EventLog_request(RequestDataOption, DailyLogRequestRange[0], DailyLogRequestRange[1])
        //  let DailyLogSorted = LogDataMappingTimeMSM(MSMTable,response)   
        EventLogSorted = EventSortTimeMSM(response)
        console.log(EventLogSorted);
        setState(({ count }) => ({ count: count + 1 }));
    }

    const RealTimeRequest = async () => {

        let field_name = Object.keys(DailyRealTime)

        let realtime = await MSM_RealTime_request(RequestDataOption)
        //console.log(realtime);
        TotalCountProduct = DataSortRT(realtime)

        //console.log(TotalCountProduct);

        ContingRange = MSM_Realtime_GetDateTime(0, 1)

        Find_initial_Time() ? ContingRange = MSM_Realtime_GetDateTime(0, 1) : ContingRange = MSM_Realtime_GetDateTime(1, 0)

        console.log(ContingRange);

        let responseDaily = await MSM_EventLog_request(RequestDataOption, ContingRange[0], ContingRange[3])
        EventLogSorted = EventSortTimeMSM(responseDaily)

        console.log(EventLogSorted);


        field_name.forEach(element => {
            DailyRealTime[`${element}`] = 0
            DailyMorningRealTime[`${element}`] = 0
            DailyNightRealTime[`${element}`] = 0

            EventLogSorted.forEach(element2 => {

                if (element === element2['Label']) {
                    DailyRealTime[`${element}`]++

                    if (element2['Shift'] === 'Morning') {
                        DailyMorningRealTime[`${element}`]++
                    }

                    else {
                        DailyNightRealTime[`${element}`]++
                    }
                }
            });

            TotalCountProduct.forEach(element3 => {
                if (element === element3['Label']) {
                    TotalCount[`${element}`] = element3.value
                }
            });
        });

        // Find_initial_Time() ? ContingRange = MSM_Realtime_GetDateTime(0, 1) : ContingRange = MSM_Realtime_GetDateTime(1, 0)

        console.log(ContingRange);

        setState(({ count }) => ({ count: count + 1 }));
    }

    const handleChangeOverall = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        setSortedInfo(sorter);
    };

    const handleChangePertime = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        setSortedInfo2(sorter);
    };

    // const ChangeDateRange = (value) => {
    //     // console.log(RequestDateRange);
    //     RequestDateRange = []
    //     RequestDateRange = ConvertMonentToDateTime(value)
    //     // console.log(RequestDateRange);
    // }

    // const ChangeOption = (value) => {
    //     console.log(`selected ${value}`);
    //     RequestDataOption = []
    //     RequestDataOption.push(value)
    //     // console.log(RequestDataOption);
    // }

    const LogColumb = [
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

    return (
        <div>

            <div style={{ marginTop: '16px' }}>
                <Card >
                    <h2>Daily Production Capacity Counter</h2>
                    <h2>{`( ${moment(ContingRange[0]).utc(true).format('DD/MM/YYYY HH:mm:ss')} - ${moment(ContingRange[1]).utc(true).format('DD/MM/YYYY HH:mm:ss')} )`}</h2>

                    <Row gutter={'3'} >
                        <Col span={6} xs={24} xl={24}>
                        <Card bordered={true} style={{ backgroundColor: 'ButtonHighlight ', border: '3px outset', minHeight: '540px' }}  >
                                <Title>Packaging Line 2 KG</Title>

                                <Row gutter={'1'} >
                                    <Col span={8} xs={12} xl={12}>
                                        <Row gutter={'1'} >
                                            <Col span={8} xs={24} xl={24}>

                                                <Statistic
                                                    title={<h2>Morning:</h2>}
                                                    value={DailyMorningRealTime['Line2kg']}
                                                    precision={0}
                                                    valueStyle={{ color: '#3f8600', fontSize: '120px', color: '#131212', fontWeight: 'bold' }}
                                                    suffix={<h1 style={{ fontSize: '40px' }}>Unit</h1>}
                                                />
                                            </Col>

                                        </Row>
                                        <Row gutter={'1'} >

                                            <Col span={8} xs={24} xl={24}>

                                                <Col span={8} xs={24} xl={24}>

                                                    <Statistic
                                                        title={<h2>Night:</h2>}
                                                        value={DailyNightRealTime['Line2kg']}
                                                        precision={0}
                                                        valueStyle={{ color: '#3f8600', fontSize: '120px', color: '#131212', fontWeight: 'bold' }}
                                                        suffix={<h1 style={{ fontSize: '40px' }}>Unit</h1>}
                                                        />
                                                </Col>

                                            </Col>
                                        </Row>

                                    </Col>

                                    <Col span={8} xs={12} xl={12}>
                                        <Statistic
                                            title={<h2 style={{fontSize: '50px'}}>Total:</h2>}
                                            value={DailyRealTime['Line2kg']}
                                            precision={0}
                                            valueStyle={{ color: '#3f8600', fontSize: '240px', color: '#131212', fontWeight: 'bold' }}
                                            suffix={<h1 style={{ fontSize: '40px' }}>Unit</h1>}
                                            />

                                    </Col>
                                </Row>

                            </Card>
                        </Col>

                    </Row>
                </Card>
            </div>


        </div>
    )
}

export default Line1kg
