import React, { useState, useEffect } from 'react'
import { DeleteJob, logdata_request, logdata_Write, ReadJob, WriteJob } from '../../api';
import { DataSortTime, TableColumbLabelAsRow, LogDataMappingName, ReportSort, TableColumbJob, TableColumbLabelAsRowG2, GetDateTime, TableColumbJobtest, FilterByName, FilterOutExcessTime, TimeInterval, DataSortTimeMcG } from '../../DataRequest/LogDataRequestWrap';
import { G2Model, JobModel, McGuire } from '../../DataRequest/DataModel';
import NameTableWrapper from '../Report/NameTableWrapper';
import ReportWrapper from '../Report/ReportWrapper';
import { Button, message } from 'antd';
import ReportListWrapper from '../Report/ReportListWrapper';
import moment from 'moment';
import BagModal from '../Report/BagModal';
import EditReportForm from '../Report/EditReportForm';
import ReportGraph from '../Report/ReportGraph';


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
    EffectiveTime: '',
    RateEfficiency: '',
    Effciency: ''
}

let Cell = ["A10", "E10", "I10", "M10", "Q10"]

let EditJobData = {}
let TotalJobDuration
let ReportInfoG2 = {}

let BlankPage = 1, ClickTime


const Line1ReportG2 = () => {

    const [state, setState] = useState({ count: 0 });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [Edit, setEdit] = useState(false);

    useEffect(() => {
        let period = GetDateTime(14, 14)
        RequestJob([], period[0], period[1], 'PolymerLink', 'G2', 'G2ReportList')
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

    const DataRequestG2 = (row) => {

        let TimeRange = []

        TimeRange[0] = (moment(row['Start Time'], "DD-MM-YYYY HH:mm:ss").toISOString(false).split('.')[0] + "Z")
        TimeRange[1] = (moment(row['End Time'], "DD-MM-YYYY HH:mm:ss")).toISOString(false).split('.')[0] + "Z"

        ReportInfoG2.Info1 = row['Job No']
        ReportInfoG2.Info2 = row['Start Time']
        ReportInfoG2.Info3 = row['End Time']
        ReportInfoG2.Info4 = row['Color']
        ReportInfoG2.Info5 = row['Grade']
        ReportInfoG2.Info6 = row['Actual Product']
        ReportInfoG2.Info7 = row['Estimated Rate']

        UpdateTableData([], TimeRange[0], TimeRange[1], 'Polymerlink', 'G2', BlankPage, 'LogG2', G2Model)
    }
    // const ColumbJobG2 = TableColumbJob(JobModel, DataRequestG2, JobDeleteHandler, 'G2', BlankPage, 'View', 'Delete')
    const ColumbJobG2 = TableColumbJobtest(JobModel, DataRequestG2, JobDeleteHandler, EditJobSheet, 'G2', BlankPage, 'View', 'Delete', 'Edit')


    const UpdateTableData = async (Parameter, StartTime, EndTime, Site, Line, Page, BufferName, Model) => {
        const response = await logdata_request(Parameter, StartTime, EndTime, Site, Line, Page)
        let data = DataSortTime(response)
        let Runtime, RuntimeCounter = 0

        LogValue[BufferName] = LogDataMappingName(Model, data)
        let FeederState = FilterByName('Mill 1 Feeder', LogValue[BufferName])

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
        let duration = TimeInterval(ReportInfoG2.Info2, ReportInfoG2.Info3)
        TotalJobDuration = duration
        let TotalPeriodSecond = TotalJobDuration.Day * 86400 + TotalJobDuration.Hours * 3600 + TotalJobDuration.Minutes * 60

        ReportAnalysis.TotalPeriod = `${TotalJobDuration.Day} Days ${TotalJobDuration.Hours} Hours  ${TotalJobDuration.Minutes} Minutes`
        ReportAnalysis.RunPeriod = `${DayRuntime} Days ${HourRuntime} Hours  ${MinutesRuntime} Minutes`
        ReportAnalysis.ActualProduct = ReportInfoG2.Info6
        ReportAnalysis.ExpectedRate = ReportInfoG2.Info7
        ReportAnalysis.ActualRate = (ReportAnalysis.ActualProduct / (TotalJobDuration.Day * 24 + TotalJobDuration.Hours + TotalJobDuration.Minutes / 60)).toFixed(2)
        ReportAnalysis.ExpectedProduct = ReportAnalysis.ExpectedRate * (TotalJobDuration.Day * 24 + TotalJobDuration.Hours + TotalJobDuration.Minutes / 60)

        ReportAnalysis.EffectiveTime = ((SecondRuntime / TotalPeriodSecond) * 100).toFixed(2)
        ReportAnalysis.RateEfficiency = ((ReportAnalysis.ActualRate / ReportAnalysis.ExpectedRate) * 100).toFixed(2)
        ReportAnalysis.Effciency = ((ReportAnalysis.ActualProduct / ReportAnalysis.ExpectedProduct) * 100).toFixed(2)



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

        if (info.info5 == 0.00) {
            const response2 = await logdata_request(['FINAL_DISP_TOTAL'], datetimeStart, datetimeEnd, 'PolymerLink', 'Maguire C3', '1')
            let data = LogDataMappingName(McGuire, DataSortTimeMcG(response2))
            let AvgTotal = AvgAppend(data)
            info.info5 = AvgTotal

            console.log(AvgTotal);
        }
        
        const response = await WriteJob(info, datetimeStart, datetimeEnd, site, line)
        if (response.success === true) {
            message.success('Create Success !')
            let period = GetDateTime(14, 14)
            RequestJob([], period[0], period[1], 'PolymerLink', 'G2', 'G2ReportList')
        }
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
        //console.log(data);
        setState(({ count }) => ({ count: count + 1 }));
    }

    const InputBag = async (value) => {
        let DateTime, parameter = {}, Value = []

        // console.log(record['Time']);

        DateTime = ClickTime
        parameter['DateTime'] = DateTime
        parameter['Bag'] = value

        Value.push(parameter)

        console.log(parameter);

        const response = await logdata_Write(Value, 'G2', BlankPage)

        if (response.success === true) {
            console.log('ok');
            message.success(`Bag Number Added`)
            let TimeRange = []

            TimeRange[0] = (moment(ReportInfoG2.Info2, "DD-MM-YYYY HH:mm:ss").toISOString(false).split('.')[0] + "Z")
            TimeRange[1] = (moment(ReportInfoG2.Info3, "DD-MM-YYYY HH:mm:ss")).toISOString(false).split('.')[0] + "Z"

            UpdateTableData([], TimeRange[0], TimeRange[1], 'Polymerlink', 'G2', BlankPage, 'LogG2', G2Model)
            // UpdateTableData([], JobDetailRecord.datetimeStart, JobDetailRecord.datetimeEnd, 'Polymerlink', 'G2', BlankPage, 'LogG2', G2Model)
        }

        else {
            message.error(`Fail to add`)
        }


        console.log(response);
    }

    const showModal = (record) => {
        ClickTime = moment(record['Time'], "DD-MM-YYYY HH:mm:ss").toISOString(false).split('.')[0] + "Z"
        setIsModalVisible(true)
    }

    const handleOk = (record) => {
        //console.log(record['Bag']);
        InputBag(record['Bag'])
        setIsModalVisible(false)
        console.log(record);
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const ColumbG2 = TableColumbLabelAsRowG2(G2Model, showModal)
    console.log(ColumbG2);


    return (
        <div>
            {/* G2 part here */}
            <BagModal
                visible={isModalVisible}
                onok={handleOk} onCancle={handleCancel}
            />

            <ReportWrapper CreateJobCallBack={CreateJob}
                site={'Polymerlink'} line={'G2'}
            />

            <ReportListWrapper ReportListCallBack={RequestJob}
                site={'Polymerlink'} line={'G2'}
                ReportList={ReportList['G2ReportList']}
                Columb={ColumbJobG2}
                BufferName={"G2ReportList"}
            />

            <NameTableWrapper SetTimeRangeCallBack={UpdateTableData}
                LogValue={LogValue['LogG2']} Columb={ColumbG2}
                site={'G2'} page={BlankPage} BufferName={"LogG2"} Model={G2Model}
                JobInfo={ReportInfoG2} FileName={'MILL.xlsx'} startingColumb={'A'} startingRow={14}
                EndingColumb={'O'} EndingRow={14} Cell={Cell}
            />

            <ReportGraph ReportAnalysis={ReportAnalysis} RunningStep={LogValue['TimingData']} />

            <EditReportForm Visibility={Edit} callbackClose={CloseEditJobSheet}
                InfoData={EditJobData} CreateJobCallBack={CreateJob}
                site={'Polymerlink'} line={'G2'} />
        </div>
    )


}

export default Line1ReportG2
