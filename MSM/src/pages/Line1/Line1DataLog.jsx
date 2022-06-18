import { Button, Col, Divider, Row, DatePicker, Card, Table, Select } from 'antd'
import React, { useState, useEffect } from 'react'
import { logdata_request, RealtimeData_Request } from '../../api'
import { C3Model, C3ModelMap, G2Model } from '../../DataRequest/DataModel'
import { ConvertMonentToDateTime, DataSortTime, GetDateTime } from '../../DataRequest/LogDataRequestWrap'
import { Line } from '@antv/g2plot';
import moment from 'moment';



let DTinitial = GetDateTime(1,1)
let BlankPage = 1, DTc3 = [] , DTg2 = []
let C3DTRange = [], G2DTRange = []

DTc3.push(moment(DTinitial[2]))
DTc3.push(moment(DTinitial[3]))
DTg2 = DTc3


let LogValue = {
    "C3Table": [],
    "G2Table": [],
    "C3Graph": [],
    "G2Graph": [],
    "C3Selected": [],
    "G2Selected": [],
}
const { RangePicker } = DatePicker;
const { Option } = Select;


let OptionC3 = Object.keys(C3ModelMap)
let OptionG2 = Object.keys(G2Model)

const OptionSelectorC3 = [];
const OptionSelectorG2 = [];

LogValue['C3Selected'] = [OptionC3[0], OptionC3[1]];
LogValue['G2Selected'] = [OptionG2[0], OptionG2[1]];

OptionC3.forEach(element => {
    OptionSelectorC3.push(<Option key={element}>{element}</Option>)
});
OptionG2.forEach(element => {
    OptionSelectorG2.push(<Option key={element}>{element}</Option>)
});

let data_filterC3 = OptionC3.map(obj => {
    let cobj = []

    cobj = {
        text: obj,
        value: obj,
    }
    return cobj
})

const parseDMYhmC3 = (s) => {
    var b = s.split(/\D/);
    return new Date(b[2], b[1] - 1, b[2], b[3], b[4]);
}

const columnsC3 = [
    {
        title: 'Parameter',
        dataIndex: 'Parameter',
        filters: data_filterC3,
        filterMode: 'tree',
        filterSearch: true,
        onFilter: (value, record) => record.Parameter.includes(value),
        width: '30%',
    },
    {
        title: 'Value',
        dataIndex: 'Value',
        sorter: (a, b) => a.Value - b.Value,
    },
    {
        title: 'Date',
        dataIndex: 'date',
        sorter: (a, b) => parseDMYhmC3(a.date) - parseDMYhmC3(b.date),
    },
];



let data_filterG2 = OptionG2.map(obj => {
    let cobj = []

    cobj = {
        text: obj,
        value: obj,
    }
    return cobj
})

const parseDMYhmG2 = (s) => {
    var b = s.split(/\D/);
    return new Date(b[2], b[1] - 1, b[2], b[3], b[4]);
}

const columnsG2 = [
    {
        title: 'Parameter',
        dataIndex: 'Parameter',
        filters: data_filterG2,
        filterMode: 'tree',
        filterSearch: true,
        onFilter: (value, record) => record.Parameter.includes(value),
        width: '30%',
    },
    {
        title: 'Value',
        dataIndex: 'Value',
        sorter: (a, b) => a.Value - b.Value,
    },
    {
        title: 'Date',
        dataIndex: 'date',
        sorter: (a, b) => parseDMYhmG2(a.date) - parseDMYhmG2(b.date),
    },
];

let line, line2

const Line1DataLog = () => {

    const [state, setState] = useState({ count: 0 });

    useEffect(() => {
        console.log('Reffect');

        line = new Line('C3Graph', {
            data: LogValue['C3Table'],
            xField: 'date',
            yField: 'Value',
            seriesField: 'Parameter',
        })

        try { line.render() }
        catch { }

        line2 = new Line('G2Graph', {
            data: LogValue['G2Table'],
            xField: 'date',
            yField: 'Value',
            seriesField: 'Parameter',
        })

        try { line2.render() }
        catch { }

        return () => {
            line.destroy();
            line2.destroy();

        }
    }, [])

    const UpdateTableData = async (Parameter, StartTime, EndTime, Site, Line, Page, BufferName, Model) => {
        console.log(Parameter)
        const response = await logdata_request(Parameter, StartTime, EndTime, Site, Line, Page)
        let data = DataSortTime(response)
        LogValue[BufferName] = data
        // console.log(response);
        setState(({ count }) => ({ count: count + 1 }));
    }

    const C3LogRequest = async (DT) => {
        DTc3 = DT
        console.log(DTc3);
        C3DTRange = ConvertMonentToDateTime(DT)
        console.log(C3DTRange);
        await UpdateTableData(LogValue['C3Selected'], C3DTRange[0], C3DTRange[1], 'Polymerlink', 'C3', BlankPage, "C3Table", C3ModelMap)
        console.log(LogValue["C3Table"]);
        line.changeData(LogValue["C3Table"])
    }

    const G2LogRequest = async (DT) => {
        DTg2 = DT
        G2DTRange = ConvertMonentToDateTime(DT)
        await UpdateTableData(LogValue['G2Selected'], G2DTRange[0], G2DTRange[1], 'Polymerlink', 'G2', BlankPage, "G2Table", G2Model)
        line2.changeData(LogValue["G2Table"])
    }

    const ChangeC3Select = (value) => {
        LogValue['C3Selected'] = value
    }

    const ChangeG2Select = (value) => {
        LogValue['G2Selected'] = value

    }


    return (
        <div>
            <div style={{ paddingBottom: '10px' }}>
                <Divider orientation="left">C3 Log Visualize</Divider>
            </div>
            <div style={{ paddingBottom: '10px' }}>
                <RangePicker showTime onOk={C3LogRequest} />
                <Button type='primary' style={{ marginLeft: '10px' }} onClick={() => { C3LogRequest(DTc3) }}>Update</Button>
            </div>
            <Select
                mode="multiple"
                size="middle"
                placeholder="Please select"
                defaultValue={[OptionC3[0], OptionC3[1]]}
                style={{ width: '100%', paddingBottom: '20px' }}
                onChange={ChangeC3Select}
            >
                {OptionSelectorC3}
            </Select>

            <Card title='Log Value C3' bordered={true}
                style={{ width: '100%', borderRadius: 15, marginBottom: '10px' }} hoverable={true}>
                <Table bordered columns={columnsC3} dataSource={LogValue['C3Table']} size="small" scroll={{ y: 500 }} pagination={false} />
            </Card>

            <Card title={'C3 Graph Visulize'} bordered={true} style={{ width: '100%', borderRadius: 15, backgroundColor: '#ffffff' }} hoverable={true}>
                <div id='C3Graph'></div>
            </Card>


            <div style={{ paddingBottom: '10px', paddingTop:'20px' }}>
                <Divider orientation="left">G2 Log Visualize</Divider>
            </div>

            <div style={{ paddingBottom: '10px' }}>
                <RangePicker showTime onOk={G2LogRequest} />
                <Button type='primary' style={{ marginLeft: '10px' }} onClick={() => { G2LogRequest(DTg2) }}>Update</Button>
            </div>

            <Select
                mode="multiple"
                size="middle"
                placeholder="Please select"
                defaultValue={[OptionG2[0], OptionG2[1]]}
                style={{ width: '100%', paddingBottom: '20px'   }}
                onChange={ChangeG2Select}

            >
                {OptionSelectorG2}
            </Select>

            <Card title='Log Value G2' bordered={true}
                style={{ width: '100%', borderRadius: 15, marginBottom: '10px' }} hoverable={true}>
                <Table bordered columns={columnsG2} dataSource={LogValue['G2Table']} size="small" scroll={{ y: 500 }} pagination={false} />
            </Card>

            <Card title={'Log Value G2'} bordered={true} style={{ width: '100%', borderRadius: 15, backgroundColor: '#ffffff' }} hoverable={true}>
                <div id='G2Graph'></div>
            </Card>




        </div>
    )
}

export default Line1DataLog
