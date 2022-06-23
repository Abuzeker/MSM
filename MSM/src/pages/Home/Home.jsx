
import React, { useEffect, useState } from 'react'
import { ReadJob, MSM_RealTime_request, MSM_logdata_request, MSM_EventLog_request } from '../../api'
import {
    DataSortTimeMSM, GetDateTime,
    LogDataMappingNameMSM, MSM_Realtime_GetDateTime, DateDisplay,
    EventSortTimeMSM, Find_initial_Time
} from '../../DataRequest/LogDataRequestWrap';
import { DataSortRT } from '../../DataRequest/RealTimeRequestWrap'
import moment from 'moment';
import { MSMTable, MSMDailyTable, MSMShiftTable } from '../../DataRequest/DataModel';
import { Button, Col, Row, Table, Typography, Statistic, Card, DatePicker, Select } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import './home.css'


let DTinitial = GetDateTime(0, 1)  // get from yesterday 00:00 to today 00:00
let DTinitial2 = GetDateTime(7, 2)
let ContingRange = MSM_Realtime_GetDateTime(1, 0)

let RequestDataOption = ['Line50kg', 'Line1kg', 'Line2kg', 'Line1Ton']

let RequestDataOption_Daily = ['Line50kg_Daily', 'Line1kg_Daily', 'Line2kg_Daily', 'Line1Ton_Daily']

let RequestDataOption_shift = [
    'Line50kg_Morning', 'Line1kg_Morning', 'Line2kg_Morning', 'Line1Ton_Morning',
    'Line50kg_Night', 'Line1kg_Night', 'Line2kg_Night', 'Line1Ton_Night']

let RequestDateRange = [DTinitial[0], DTinitial[1]]
let DailyLogRequestRange = [DTinitial2[0], DTinitial2[1], DTinitial2[2], DTinitial2[3]]
let DailyLogSorted = []
let ShiftLogSorted = []
let EventLogSorted = []
let EventLogSortedMorning = []
let EventLogSortedNight = []
let TotalCountProduct = []

let DailyRealTime = {
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

let TotalCount = {
    'Line50kg': 0,
    'Line1kg': 0,
    'Line2kg': 0,
    'Line1Ton': 0
}

const Home = () => {

    const { Title } = Typography

    const [state, setState] = useState({ count: 0 });
    const [sortedInfo, setSortedInfo] = useState({});
    const [sortedInfo2, setSortedInfo2] = useState({});

    useEffect(() => {


        const interval = setInterval(() => {
            RenderNewData()
        }, 1000)

        try {

            DailyLogRequest('shift', MSMShiftTable)
            DailyLogRequest('daily', MSMDailyTable)
            
        } catch (error) {
            console.log('server error');
        }



        //EvenLogRequest()


        return () => {
            clearInterval(interval)
            console.log('Unmount Effect Line1RT');
        }

    }, [])

    const RenderNewData = () => {
        RealTimeRequest()
    }

    const DailyLogRequest = async (type, Model) => {
        //  let DailyLogSorted = LogDataMappingTimeMSM(MSMTable,response)   
        console.log(DailyLogRequestRange);
        let response = []

        switch (type) {
            case 'shift':
                response = await MSM_logdata_request(RequestDataOption_shift, DailyLogRequestRange[0], DailyLogRequestRange[1])
                ShiftLogSorted = LogDataMappingNameMSM(Model, DataSortTimeMSM(response), type)
                break;

            case 'daily':
                response = await MSM_logdata_request(RequestDataOption_Daily, DailyLogRequestRange[0], DailyLogRequestRange[1])
                DailyLogSorted = LogDataMappingNameMSM(Model, DataSortTimeMSM(response), type)
                break;

            default:
                break;
        }
        console.log(DailyLogSorted);
        setState(({ count }) => ({ count: count + 1 }));
    }

    const EvenLogRequest = async () => {
        let response = await MSM_EventLog_request(RequestDataOption, DailyLogRequestRange[0], DailyLogRequestRange[1])
        //  let DailyLogSorted = LogDataMappingTimeMSM(MSMTable,response)   
        EventLogSorted = EventSortTimeMSM(response)
        // console.log(DailyLogRequestRange);
        // console.log(EventLogSorted);
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

    return (
        <div>

            <div style={{ marginTop: '16px' }}>
                <Card >
                    <h2>Daily Production Capacity Counter</h2>
                    <h3>{`( ${moment(ContingRange[0]).utc(true).format('DD/MM/YYYY HH:mm:ss')} - ${moment(ContingRange[3]).utc(true).format('DD/MM/YYYY HH:mm:ss')} )`}</h3>

                    <Row gutter={'3'} >
                        <Col span={6} xs={24} xl={6}>
                            <Card bordered={true} style={{ backgroundColor: 'ButtonHighlight ', border: '3px outset' }}  >
                                <h2>Packaging Line 50 KG</h2>

                                <Row gutter={'1'} >
                                    <Col span={8} xs={12} xl={12}>
                                        <Row gutter={'1'} >
                                            <Col span={8} xs={24} xl={24}>

                                                <Statistic
                                                    title={<h1>Morning:</h1>}
                                                    value={DailyMorningRealTime['Line50kg']}
                                                    precision={0}
                                                    valueStyle={{ color: '#3f8600', fontSize: '30px', color: '#131212', fontWeight: 'bold' }}
                                                    suffix={<h1 style={{ fontSize: '15px' }}>Unit</h1>}
                                                />
                                            </Col>

                                        </Row>
                                        <Row gutter={'1'} >

                                            <Col span={8} xs={24} xl={24}>

                                                <Col span={8} xs={24} xl={24}>

                                                    <Statistic
                                                        title={<h1>Night:</h1>}
                                                        value={DailyNightRealTime['Line50kg']}
                                                        precision={0}
                                                        valueStyle={{ color: '#3f8600', fontSize: '30px', color: '#131212', fontWeight: 'bold' }}
                                                        suffix={<h1 style={{ fontSize: '15px' }}>Unit</h1>}
                                                    />
                                                </Col>

                                            </Col>
                                        </Row>

                                    </Col>

                                    <Col span={8} xs={12} xl={12}>
                                        <Statistic
                                            title={<h1>Total:</h1>}
                                            value={DailyRealTime['Line50kg']}
                                            precision={0}
                                            valueStyle={{ color: '#3f8600', fontSize: '50px', color: '#131212', fontWeight: 'bold' }}
                                            suffix={<h1 style={{ fontSize: '25px' }}>Unit</h1>}
                                        />

                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={6} xs={24} xl={6}>
                            <Card bordered={true} style={{ backgroundColor: 'ButtonHighlight ', border: '3px outset' }}  >
                                <h2>Packaging Line 1 KG</h2>

                                <Row gutter={'1'} >
                                    <Col span={8} xs={12} xl={12}>
                                        <Row gutter={'1'} >
                                            <Col span={8} xs={24} xl={24}>

                                                <Statistic
                                                    title={<h1>Morning:</h1>}
                                                    value={DailyMorningRealTime['Line1kg']}
                                                    precision={0}
                                                    valueStyle={{ color: '#3f8600', fontSize: '30px', color: '#131212', fontWeight: 'bold' }}
                                                    suffix={<h1 style={{ fontSize: '15px' }}>Unit</h1>}
                                                />
                                            </Col>

                                        </Row>
                                        <Row gutter={'1'} >

                                            <Col span={8} xs={24} xl={24}>

                                                <Col span={8} xs={24} xl={24}>

                                                    <Statistic
                                                        title={<h1>Night:</h1>}
                                                        value={DailyNightRealTime['Line1kg']}
                                                        precision={0}
                                                        valueStyle={{ color: '#3f8600', fontSize: '30px', color: '#131212', fontWeight: 'bold' }}
                                                        suffix={<h1 style={{ fontSize: '15px' }}>Unit</h1>}
                                                    />
                                                </Col>

                                            </Col>
                                        </Row>

                                    </Col>

                                    <Col span={8} xs={12} xl={12}>
                                        <Statistic
                                            title={<h1>Total:</h1>}
                                            value={DailyRealTime['Line1kg']}
                                            precision={0}
                                            valueStyle={{ color: '#3f8600', fontSize: '50px', color: '#131212', fontWeight: 'bold' }}
                                            suffix={<h1 style={{ fontSize: '25px' }}>Unit</h1>}
                                        />

                                    </Col>
                                </Row>

                            </Card>
                        </Col>
                        <Col span={6} xs={24} xl={6}>
                            <Card bordered={true} style={{ backgroundColor: 'ButtonHighlight ', border: '3px outset' }}  >
                                <h2>Packaging Line 2 KG</h2>

                                <Row gutter={'1'} >
                                    <Col span={8} xs={12} xl={12}>
                                        <Row gutter={'1'} >
                                            <Col span={8} xs={24} xl={24}>

                                                <Statistic
                                                    title={<h1>Morning:</h1>}
                                                    value={DailyMorningRealTime['Line2kg']}
                                                    precision={0}
                                                    valueStyle={{ color: '#3f8600', fontSize: '30px', color: '#131212', fontWeight: 'bold' }}
                                                    suffix={<h1 style={{ fontSize: '15px' }}>Unit</h1>}
                                                />
                                            </Col>

                                        </Row>
                                        <Row gutter={'1'} >

                                            <Col span={8} xs={24} xl={24}>

                                                <Col span={8} xs={24} xl={24}>

                                                    <Statistic
                                                        title={<h1>Night:</h1>}
                                                        value={DailyNightRealTime['Line2kg']}
                                                        precision={0}
                                                        valueStyle={{ color: '#3f8600', fontSize: '30px', color: '#131212', fontWeight: 'bold' }}
                                                        suffix={<h1 style={{ fontSize: '15px' }}>Unit</h1>}
                                                    />
                                                </Col>

                                            </Col>
                                        </Row>

                                    </Col>

                                    <Col span={8} xs={12} xl={12}>
                                        <Statistic
                                            title={<h1>Total:</h1>}
                                            value={DailyRealTime['Line2kg']}
                                            precision={0}
                                            valueStyle={{ color: '#3f8600', fontSize: '50px', color: '#131212', fontWeight: 'bold' }}
                                            suffix={<h1 style={{ fontSize: '25px' }}>Unit</h1>}
                                        />

                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={6} xs={24} xl={6}>
                            <Card bordered={true} style={{ backgroundColor: 'ButtonHighlight ', border: '3px outset' }}  >
                                <h2>Packaging Line 1 TON</h2>
                                <Row gutter={'1'} >
                                    <Col span={8} xs={12} xl={12}>
                                        <Row gutter={'1'} >
                                            <Col span={8} xs={24} xl={24}>

                                                <Statistic
                                                    title={<h1>Morning:</h1>}
                                                    value={DailyMorningRealTime['Line1Ton']}
                                                    precision={0}
                                                    valueStyle={{ color: '#3f8600', fontSize: '30px', color: '#131212', fontWeight: 'bold' }}
                                                    suffix={<h1 style={{ fontSize: '15px' }}>Unit</h1>}
                                                />
                                            </Col>

                                        </Row>
                                        <Row gutter={'1'} >

                                            <Col span={8} xs={24} xl={24}>

                                                <Col span={8} xs={24} xl={24}>

                                                    <Statistic
                                                        title={<h1>Night:</h1>}
                                                        value={DailyNightRealTime['Line1Ton']}
                                                        precision={0}
                                                        valueStyle={{ color: '#3f8600', fontSize: '30px', color: '#131212', fontWeight: 'bold' }}
                                                        suffix={<h1 style={{ fontSize: '15px' }}>Unit</h1>}
                                                    />
                                                </Col>

                                            </Col>
                                        </Row>

                                    </Col>

                                    <Col span={8} xs={12} xl={12}>
                                        <Statistic
                                            title={<h1>Total:</h1>}
                                            value={DailyRealTime['Line1Ton']}
                                            precision={0}
                                            valueStyle={{ color: '#3f8600', fontSize: '50px', color: '#131212', fontWeight: 'bold' }}
                                            suffix={<h1 style={{ fontSize: '25px' }}>Unit</h1>}
                                        />

                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </div>

            <div style={{ marginTop: '16px' }}>


                <Card style={{ height: '540px', backgroundColor: 'AppWorkspace', border: '3px outset' }} >

                    <Title level={1} style={{ fontWeight: 'bold' }}> Shift Log  </Title>
                    <Table columns={LogColumbShift} dataSource={ShiftLogSorted} bordered scroll={{ x: 500, y: 385 }} pagination={false} size="small" onChange={handleChangeOverall} />
                </Card>

            </div>

            <div style={{ marginTop: '16px'}}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card style={{ height: '540px', backgroundColor: 'AppWorkspace', border: '3px outset', overflowY:'scroll' }} >
                            <Title level={1} style={{ fontWeight: 'bold' }}> Total Capacity </Title>
                            <Row gutter={[16, 16]}>
                                <Col span={12} xs={24} xl={12}>
                                    <Card title={<Title level={4} style={{ fontFamily: 'cursive' }}>50 Kg</Title>}>

                                        <Statistic
                                            value={TotalCount['Line50kg']}
                                            precision={0}
                                            valueStyle={{ color: '#084085', fontFamily: 'monospace', fontSize: '34px' }}
                                            suffix="Unit"
                                        />
                                    </Card>
                                </Col>
                                <Col span={12} xs={24} xl={12}>
                                    <Card title={<Title level={4} style={{ fontFamily: 'cursive' }}>1 Kg</Title>}>

                                        <Statistic
                                            value={TotalCount['Line1kg']}
                                            precision={0}
                                            valueStyle={{ color: '#084085', fontFamily: 'monospace', fontSize: '34px' }}
                                            suffix="Unit"
                                        />
                                    </Card>
                                </Col>
                                <Col span={12} xs={24} xl={12}>
                                    <Card title={<Title level={4} style={{ fontFamily: 'cursive' }}>2 Kg</Title>}>

                                        <Statistic
                                            value={TotalCount['Line2kg']}
                                            precision={0}
                                            valueStyle={{ color: '#084085', fontFamily: 'monospace', fontSize: '34px' }}
                                            suffix="Unit"
                                        />
                                    </Card>
                                </Col>
                                <Col span={12} xs={24} xl={12}>
                                    <Card title={<Title level={4} style={{ fontFamily: 'cursive' }}>1 Ton</Title>}>

                                        <Statistic
                                            value={TotalCount['Line1Ton']}
                                            precision={0}
                                            valueStyle={{ color: '#084085', fontFamily: 'monospace', fontSize: '34px' }}
                                            suffix="Unit"
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Card>

                    </Col>

                    <Col span={12}>
                        <Card style={{ backgroundColor: 'AppWorkspace', border: '3px outset', minHeight: '540px' }} >

                            <Title level={1} style={{ fontWeight: 'bold' }} > Daily Log  </Title>
                            <Table columns={LogColumb} dataSource={DailyLogSorted} bordered scroll={{ x: 500, y: 385 }} pagination={false} size="small" onChange={handleChangeOverall} />
                        </Card>
                    </Col>


                </Row>
            </div>

            <div style={{ marginTop: '16px' }}>



                <Card style={{ height: '540px', backgroundColor: 'AppWorkspace', border: '3px outset' }} >

                    <Title level={1} style={{ fontWeight: 'bold' }}> Event Log  </Title>
                    <Table bordered columns={LogColumbPerTime} dataSource={EventLogSorted} scroll={{ x: 600, y: 350 }} pagination={false} size="small" onChange={handleChangePertime} />
                </Card>

            </div>




            {/* <Button onClick={time}> test </Button>
            <Button onClick={comparedate}> compare </Button>
             */}


        </div>
    )
}

export default Home
