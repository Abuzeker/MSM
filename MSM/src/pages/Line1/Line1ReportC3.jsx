import React, { useState, useEffect } from 'react'
import { DeleteJob, logdata_request, ReadJob, WriteJob } from '../../api';
import { DataSortTime, TableColumbLabelAsRow, LogDataMappingName, ReportSort, TableColumbJob, SortToArrayExcel, ExportExcelWorkBook, FilterByName, FilterOutExcessTime, TimeInterval, GetDateTime, TableColumbJobtest, DataSortTimeMcG } from '../../DataRequest/LogDataRequestWrap';
import { C3Model, C3ModelMap, G2Model, JobModel, McGuire } from '../../DataRequest/DataModel';
import NameTableWrapper from '../Report/NameTableWrapper';
import ReportWrapper from '../Report/ReportWrapper';
import { Button, message, Card } from 'antd';
import ReportListWrapper from '../Report/ReportListWrapper';
import moment from 'moment';
import { Area } from '@antv/g2plot';
import ReportGraph from '../Report/ReportGraph';
import EditReportForm from '../Report/EditReportForm';
let line

let LogValue = {
    "LogC3": [],
    "LogG2": [],
    "TimingData": [],

}

let ReportList = {
    "C3ReportList": [],
    "G2ReportList": []
}

let JobDetailRecord = {
    datetimeStart: '',
    datetimeEnd: '',
    site: '',
    line: '',
    BufferName: ''
}

let ReportAnalysis = {
    TotalPeriod: '',
    RunPeriod: '',
    ExpectedRate: '',
    ActualRate: '',
    ExpectedProduct: '',
    ActualProduct: '',
    EffectiveTime:'',
    RateEfficiency:'',
    Effciency:''
}

let Cell = ["A2", "E2", "I2", "K2", "O2"]

let EditJobData = {}
let TotalJobDuration
let ReportInfoC3 = {}


let BlankPage = 1

const ColumbC3 = TableColumbLabelAsRow(C3ModelMap)

const Line1Report = () => {

    const [state, setState] = useState({ count: 0 });
    const [Edit, setEdit] = useState(false);


    useEffect(() => {
        let period = GetDateTime(14, 14)
        RequestJob([], period[0], period[1], 'PolymerLink', 'C3', 'C3ReportList')
        return () => {
        }
    }, [])

    const EditJobSheet = (RowData) => {
        setEdit(true);
        EditJobData = RowData
        console.log(EditJobData);
    }

    const CloseEditJobSheet = () => {
        setEdit(false);
        // console.log(RowData);
    }


    const JobDeleteHandler = async (jobnumber, line, page) => {
        const response = await DeleteJob(jobnumber['Job No'], line, page)

        if (response.success === true) {
            message.success(`Job ${jobnumber['Job No']} Deleted`)
            RequestJob([], JobDetailRecord.datetimeStart, JobDetailRecord.datetimeEnd,
                JobDetailRecord.site, JobDetailRecord.line, JobDetailRecord.BufferName)
        }
        else {
            message.error(`Unable to Delete Job ${jobnumber['Job No']}`)
        }
    }

    const DataRequestC3 = (row) => {

        let TimeRange = []

        TimeRange[0] = (moment(row['Start Time'], "DD-MM-YYYY HH:mm:ss").toISOString(false).split('.')[0] + "Z")
        TimeRange[1] = (moment(row['End Time'], "DD-MM-YYYY HH:mm:ss")).toISOString(false).split('.')[0] + "Z"

        ReportInfoC3.Info1 = row['Job No']
        ReportInfoC3.Info2 = row['Start Time']
        ReportInfoC3.Info3 = row['End Time']
        ReportInfoC3.Info4 = row['Color']
        ReportInfoC3.Info5 = row['Grade']
        ReportInfoC3.Info6 = row['Actual Product']
        ReportInfoC3.Info7 = row['Estimated Rate']

        UpdateTableData([], TimeRange[0], TimeRange[1], 'Polymerlink', 'C3', BlankPage, 'LogC3', C3ModelMap)

    }

    const ColumbJobC3 = TableColumbJobtest(JobModel, DataRequestC3, JobDeleteHandler, EditJobSheet, 'C3', BlankPage, 'View', 'Delete', 'Edit')

    const UpdateTableData = async (Parameter, StartTime, EndTime, Site, Line, Page, BufferName, Model) => {
        const response = await logdata_request(Parameter, StartTime, EndTime, Site, Line, Page)
        let data = DataSortTime(response)
        let Runtime, RuntimeCounter = 0

        LogValue[BufferName] = LogDataMappingName(Model, data)
        let FeederState = FilterByName('Feeder Speed', LogValue[BufferName])

        LogValue['TimingData'] = FeederState

        FeederState.forEach(element => {
            if (element.State === 1) {
                RuntimeCounter++
            }
        });

        let SecondRuntime = RuntimeCounter * 600
        let DayRuntime = parseInt(SecondRuntime / 86400)
        let HourRuntime = (parseInt(SecondRuntime / 3600) - DayRuntime * 24)
        let MinutesRuntime = (parseInt(SecondRuntime / 60) - DayRuntime * 1440 - HourRuntime * 60)

        LogValue[BufferName] = FilterOutExcessTime(LogValue[BufferName])
        let duration = TimeInterval(ReportInfoC3.Info2, ReportInfoC3.Info3)
        TotalJobDuration = duration
        let TotalPeriodSecond =  TotalJobDuration.Day*86400 + TotalJobDuration.Hours*3600 + TotalJobDuration.Minutes*60

        ReportAnalysis.TotalPeriod = `${TotalJobDuration.Day} Days ${TotalJobDuration.Hours} Hours  ${TotalJobDuration.Minutes} Minutes`
        ReportAnalysis.RunPeriod = `${DayRuntime} Days ${HourRuntime} Hours  ${MinutesRuntime} Minutes`
        ReportAnalysis.ActualProduct = ReportInfoC3.Info6
        ReportAnalysis.ExpectedRate = ReportInfoC3.Info7
        ReportAnalysis.ActualRate = (ReportAnalysis.ActualProduct / (TotalJobDuration.Day * 24 + TotalJobDuration.Hours + TotalJobDuration.Minutes / 60)).toFixed(2)
        ReportAnalysis.ExpectedProduct = ReportAnalysis.ExpectedRate * (TotalJobDuration.Day * 24 + TotalJobDuration.Hours + TotalJobDuration.Minutes / 60)
       
        ReportAnalysis.EffectiveTime = ((SecondRuntime/TotalPeriodSecond)*100).toFixed(2)
        ReportAnalysis.RateEfficiency =  ((ReportAnalysis.ActualRate/ReportAnalysis.ExpectedRate)*100).toFixed(2)
        ReportAnalysis.Effciency = ((ReportAnalysis.ActualProduct/ReportAnalysis.ExpectedProduct)*100).toFixed(2)



        setState(({ count }) => ({ count: count + 1 }));
    }

    const AvgAppend = (data) => {
        let ComAvg
        const type = ['FINAL_DISP_TOTAL']
        let ComTotal = 0, totalnumber, i = 0
        let buf = Object.keys(data)
        console.log(data);
        type.forEach(element => {
            data.forEach(element2 => {
                console.log(element2[element]);

                if (element2[element] !== undefined) {
                    let NumberBuf = parseFloat(element2[element])
                    ComTotal = NumberBuf + ComTotal
                }

            });
            ComAvg = parseFloat(ComTotal/1000).toFixed(2)
            ComTotal = 0
            i++
        });
        console.log(ComAvg);
        return ComAvg
    }


    const CreateJob = async (info, datetimeStart, datetimeEnd, site, line) => {
        // console.log(info)
        // console.log(datetimeStart);
        // console.log(datetimeEnd);
        
        if (info.info5 == 0.00) {
            const response2 = await logdata_request(['FINAL_DISP_TOTAL'], datetimeStart, datetimeEnd, 'PolymerLink', 'Maguire C3', '1')
            console.log(response2);
            let data = LogDataMappingName(McGuire, DataSortTimeMcG(response2))
            let AvgTotal = AvgAppend(data)
            info.info5 = AvgTotal
            console.log(AvgTotal);
        }

        const response = await WriteJob(info, datetimeStart, datetimeEnd, site, line)
        if (response.success === true) {
            message.success('Create Success !')
            let period = GetDateTime(14, 14)
            RequestJob([], period[0], period[1], 'PolymerLink', 'C3', 'C3ReportList')

        }
        // CloseEditJobSheet()
    }

    const RequestJob = async (info, datetimeStart, datetimeEnd, site, line, BufferName) => {
        JobDetailRecord.datetimeStart = datetimeStart
        JobDetailRecord.datetimeEnd = datetimeEnd
        JobDetailRecord.site = site
        JobDetailRecord.line = line
        JobDetailRecord.BufferName = BufferName

        const response = await ReadJob(info, datetimeStart, datetimeEnd, site, line)
        let data = ReportSort(response)
        ReportList[BufferName] = data
        console.log(data);
        setState(({ count }) => ({ count: count + 1 }));
    }

    return (
        <div>
            {/* C3 part here */}
            <ReportWrapper CreateJobCallBack={CreateJob}
                site={'Polymerlink'} line={'C3'}
            />

            <ReportListWrapper ReportListCallBack={RequestJob}
                site={'Polymerlink'} line={'C3'}
                ReportList={ReportList['C3ReportList']}
                Columb={ColumbJobC3}
                BufferName={"C3ReportList"}
            />

            <NameTableWrapper SetTimeRangeCallBack={UpdateTableData}
                LogValue={LogValue['LogC3']} Columb={ColumbC3}
                site={'C3'} page={'1'} BufferName={"LogC3"} Model={C3ModelMap}
                JobInfo={ReportInfoC3} FileName={'ExtruderSheet.xlsx'} startingColumb={'A'} startingRow={7}
                EndingColumb={'R'} EndingRow={7} Cell={Cell}
            />

            <ReportGraph ReportAnalysis={ReportAnalysis} RunningStep={LogValue['TimingData']} />

            <EditReportForm Visibility={Edit} callbackClose={CloseEditJobSheet}
                InfoData={EditJobData} CreateJobCallBack={CreateJob}
                site={'Polymerlink'} line={'C3'} />

            {/* <Card title={'Timing Graph C3'} bordered={true} style={{
                width: '100%', borderRadius: 15,
                backgroundColor: '#ffffff', marginTop: '15px'
            }} hoverable={true}>
                <div id='C3Graph'></div>
            </Card> */}
        </div>
    )


}

export default Line1Report
