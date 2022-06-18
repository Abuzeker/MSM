
import { Button } from 'antd';
import moment from 'moment';
import XlsxPopulate from 'xlsx-populate'


export const TableColumbTimeAsRow = () => {
    let Columb = []
    let TimeRow = []

    for (let i = 0; i < 24; i++) {
        let n
        i < 10 ? n = `0${i}` : n = i
        TimeRow.push(`${n}:00`)
    }

    Columb.push(
        {
            title: 'Parameter',
            width: 100,
            dataIndex: 'Parameter',
            key: 'Parameter',
            fixed: 'left',
            align: 'center',
        })

    TimeRow.forEach(element => {
        Columb.push(
            {
                title: element,
                width: 70,
                dataIndex: element,
                key: element,
                align: 'center',
            }
        )
    });
    return Columb
}

export const TableColumbLabelAsRowG2 = (Datamodel, InputBagCallBack) => {
    let Columb = []

    Columb.push(
        {
            title: 'Time',
            width: 60,
            dataIndex: 'Time',
            key: 'Time',
            fixed: 'left',
            align: 'center',
        })

    const name = Object.keys(Datamodel)
    name.forEach(element => {
        Columb.push(
            {
                title: element,
                width: 70,
                dataIndex: element,
                key: element,
                align: 'center',
            }
        )
    })

    Columb.push(
        {
            title: 'View',
            width: 60,
            dataIndex: 'View',
            key: 'View',
            align: 'center',
            render: (text, record, index) => <Button onClick={
                (e) => { InputBagCallBack(record) }
            } > Click </Button>,
        })

    //console.log(Columb);
    return Columb
}

export const TableColumbLabelAsRow = (Datamodel) => {
    let Columb = []

    Columb.push(
        {
            title: 'Time',
            width: 60,
            dataIndex: 'Time',
            key: 'Time',
            fixed: 'left',
            align: 'center',
        })

    const name = Object.keys(Datamodel)
    name.forEach(element => {
        Columb.push(
            {
                title: element,
                width: 70,
                dataIndex: element,
                key: element,
                align: 'center',
            }
        )
    })

    //console.log(Columb);
    return Columb
}

export const TableColumbJob = (Datamodel, Viewhandler, DeleteHandler, line, page, button1name, button2name) => {
    let Columb = []

    const name = Object.keys(Datamodel)
    name.forEach(element => {
        Columb.push(
            {
                title: element,
                width: 70,
                dataIndex: element,
                key: element,
                align: 'center',
            }
        )
    })

    Columb.push(
        {
            title: `${button1name}`,
            width: 60,
            dataIndex: 'View',
            key: 'View',
            align: 'center',
            render: (text, record, index) => <Button onClick={
                (e) => { Viewhandler(record) }
            } > Click </Button>,
        })

    Columb.push(
        {
            title: `${button2name}`,
            width: 60,
            dataIndex: 'Delete',
            key: 'Delete',
            align: 'center',
            render: (text, record, index) => <Button onClick={
                (e) => { DeleteHandler(record, line, page) }
            } > {button2name} </Button>,
        })

    //console.log(Columb);
    return Columb
}


export const TableColumbJobtest = (Datamodel, Viewhandler, DeleteHandler, EditHandler, line, page, button1name, button2name, button3name) => {
    let Columb = []

    const name = Object.keys(Datamodel)
    name.forEach(element => {
        Columb.push(
            {
                title: element,
                width: 70,
                dataIndex: element,
                key: element,
                align: 'center',
            }
        )
    })

    Columb.push(
        {
            title: `${button1name}`,
            width: 60,
            dataIndex: 'View',
            key: 'View',
            align: 'center',
            render: (text, record, index) => <Button onClick={
                (e) => { Viewhandler(record) }
            } > Click </Button>,
        })

    Columb.push(
        {
            title: `${button2name}`,
            width: 60,
            dataIndex: 'Delete',
            key: 'Delete',
            align: 'center',
            render: (text, record, index) => <Button onClick={
                (e) => { DeleteHandler(record, line, page) }
            } > {button2name} </Button>,
        })

    Columb.push(
        {
            title: `${button3name}`,
            width: 60,
            dataIndex: 'Edit',
            key: 'Edit',
            align: 'center',
            render: (text, record, index) => <Button onClick={
                (e) => { EditHandler(record) }
            } > {button3name} </Button>,
        })

    //console.log(Columb);
    return Columb
}

export const TableColumbJobHome = (Datamodel, line, page, button1name, button2name) => {
    let Columb = []

    Columb.push(
        {
            title: 'Line',
            width: 70,
            dataIndex: 'Line',
            key: 'Line',
            align: 'center',
        })

    const name = Object.keys(Datamodel)
    name.forEach(element => {
        Columb.push(
            {
                title: element,
                width: 70,
                dataIndex: element,
                key: element,
                align: 'center',
            }
        )
    })

    //console.log(Columb);
    return Columb
}

//offset initial date from today and offset ending date by today
export const GetDateTime = (OffsetInitialDay, OffsetDayEnd) => {

    let DateTimeArray = []
    let separator = '-'

    let today = new Date()
    let tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + OffsetDayEnd)
    today.setDate(today.getDate() - OffsetInitialDay)

    let date1 = today.getDate();
    let month1 = today.getMonth() + 1;
    let year1 = today.getFullYear();

    let date2 = tomorrow.getDate();
    let month2 = tomorrow.getMonth() + 1;
    let year2 = tomorrow.getFullYear();


    let Start_time = `${year1}${separator}${month1 < 10 ? `0${month1}` : `${month1}`}${separator}${date1} 00:00:00`
    let End_time = `${year2}${separator}${month2 < 10 ? `0${month2}` : `${month2}`}${separator}${date2} 00:00:00`

    DateTimeArray[0] = moment(Start_time).toISOString(false).split('.')[0] + "Z"
    DateTimeArray[1] = moment(End_time).toISOString(false).split('.')[0] + "Z"
    DateTimeArray[2] = Start_time
    DateTimeArray[3] = End_time

    return DateTimeArray
}

export const SetDateRange = (datetime) => {
    let DateTime = []
    let ReturnDT = []
    //convert datepicker value to Z format
    DateTime[0] = moment(datetime, "DD-MM-YYYY").subtract(1, 'days')
    DateTime[1] = datetime//moment(datetime, "DD-MM-YYYY").add(1, 'days');

    ReturnDT[0] = DateTime[0].toISOString(false).split('T')[0] + "T16:00:00Z"
    ReturnDT[1] = DateTime[1].toISOString(false).split('T')[0] + "T15:00:00Z"
    //console.log(ReturnDT)
    return ReturnDT
}

//convert datetimepicker value to Z format
export const ConvertMonentToDateTime = (momentDateTime) => {
    let DateTimeReturn = []

    try {
        DateTimeReturn[0] = momentDateTime[0].toISOString(false).split('.')[0] + "Z"
        DateTimeReturn[1] = momentDateTime[1].toISOString(false).split('.')[0] + "Z"
    }
    catch { }
    return DateTimeReturn
}

//convert datetimepicker value to Z format
export const ConvertMonentToDateTimeSingle = (momentDateTime) => {
    let DateTimeReturn

    try {
        DateTimeReturn = momentDateTime.toISOString(false).split('.')[0] + "Z"
    }
    catch { }
    return DateTimeReturn
}

export const DataSortTime = (response) => {
    let DataReturn
    if (response.success === true) {
        const data = response.data

        DataReturn = data.map(obj => {
            let cobj = []
            let date_new = moment(obj.fields.DateCreated);
            let DateComponent = date_new.utc(true).format('DD-MM-YYYY HH:mm:ss')
            let TimeComponent = date_new.utc(true).format('HH:mm:ss')
            let ar0 = TimeComponent.split(':')
            let ar1 = ar0[0] + ':' + ar0[1]
            // let SV = obj.fields.

            cobj = {
                'key': `${obj.fields.Parameter}  ${DateComponent}`,
                'time': ar1,
                'date': DateComponent,
                'Parameter': obj.fields.Parameter,
                'Value': parseFloat(obj.fields.Value),
            }
            return cobj
        })
        //console.log(DataReturn);
    }
    else {
        // console.log(response)
    }
    return DataReturn
}


export const ReportSort = (response) => {
    let DataReturn
    if (response.success === true) {
        const data = response.data

        DataReturn = data.map(obj => {
            let cobj = []
            let DateTime_Start = (moment(obj.fields.DateTime_Start)).utc(true).format('DD-MM-YYYY HH:mm:ss')
            let DateTime_End = (moment(obj.fields.DateTime_End)).utc(true).format('DD-MM-YYYY HH:mm:ss')
            // let ar0 = TimeComponent.split(':')
            // let ar1 = ar0[0] + ':' + ar0[1]

            cobj = {
                'key': obj.fields.Info1,
                'Line': obj.fields.Line,
                'Start Time': DateTime_Start,
                'End Time': DateTime_End,
                'Job No': obj.fields.Info1,
                'Grade': obj.fields.Info2,
                'Color': obj.fields.Info3,
                'Estimated Rate': obj.fields.Info4,
                'Actual Product': obj.fields.Info5,

            }
            return cobj
        })
        //console.log(DataReturn);
    }
    else {
        console.log(response)
    }
    return DataReturn
}

export const LogDataMappingTime = (Datamodel, RawData) => {
    const name = Object.keys(Datamodel)
    let ReturnValue = []
    let bufferModel = {}
    bufferModel.Parameter = 0

    for (let i = 0; i < 24; i++) {
        let n
        i < 10 ? n = `0${i}` : n = i
        bufferModel[`${n}:00`] = 0
    }

    name.forEach(element => {
        let Buffer = {}
        Object.assign(Buffer, bufferModel)
        Buffer.Parameter = element

        RawData.forEach(element2 => {
            if (element2.Parameter === element) {
                Buffer[element2.time] = element2.Value
                Buffer['key'] = element2.Parameter
            }
        })
        ReturnValue.push(Buffer)
    })
    return ReturnValue
}


export const LogDataMappingName = (Datamodel, RawData) => {
    const name = Object.keys(Datamodel)

    let prevtime = [], period = "", ReturnValue = []

    const parasearch = (item) => {
        if (item.date === period) { return true; }
        return false
    }

    RawData.forEach(element => {
        if (element.date === prevtime) { }

        else {
            prevtime = element.date
            period = element.date

            let data_buf3 = {}

            name.forEach(element => {
                data_buf3[element] = 0
            });

            let data_buf2 = RawData.filter(parasearch)

            data_buf2.map(obj => {
                data_buf3['key'] = obj.date
                data_buf3['Time'] = obj.date
                data_buf3['time'] = obj.time

                data_buf3[obj.Parameter] = obj.Value
                return data_buf3
            })
            ReturnValue.push(data_buf3)
        }
    })
    return ReturnValue
}


export const SortToArrayExcel = (DataJson, DataModel) => {
    console.log(DataJson);
    // let bufferArray = []
    let bufferArray2 = []
    const para = Object.keys(DataJson[1])
    const name = Object.keys(DataModel)
    let ReturnPara = {
        Array: [],
        height: 1,
        width: 1
    }
    // console.log(para);
    // console.log(name);
    // bufferArray.push(DataJson[1]['Time'])

    DataJson.forEach(element => {
        let bufferArray = []
        bufferArray.push(element['Time'])

        name.forEach(element1 => {

            para.forEach(element2 => {
                // console.log('new');
                // console.log(element1);
                // console.log(element2);

                let number

                if (element2 === element1) {
                    try {
                        //console.log(element2);

                        number = parseFloat(element[element2])
                    }
                    catch {
                        console.log('error');
                        number = parseFloat(0)
                    }

                    //console.log(LogValue['LogC3'][1][element2])
                    bufferArray.push(number)
                }
            })

        })
        bufferArray2.push(bufferArray)
    });

    ReturnPara.Array = bufferArray2
    ReturnPara.height = bufferArray2.length
    ReturnPara.width = bufferArray2[0].length

    return ReturnPara
}


export const ExportExcelWorkBook = (DataJson, DataModel, startCol, startRow, endCol, endRow, FileName, JobInfo, Cell) => {

    fetch(FileName)
        .then(res => res.arrayBuffer())
        .then(buffer => {
            XlsxPopulate.fromDataAsync(buffer)
                .then(workbook => {

                    // r = workbook.sheet(0).cell("A8").value("foo");
                    let setting = SortToArrayExcel(DataJson, DataModel)

                    const r = workbook.sheet(0).range(`${startCol}${startRow}:${endCol}${endRow + setting.height}`);
                    const Jobname = workbook.sheet(0).cell(Cell[0]).value(`Job No: ${JobInfo.Info1}`);
                    const Grade = workbook.sheet(0).cell(Cell[1]).value(`Grade: ${JobInfo.Info5}`);
                    const Colour = workbook.sheet(0).cell(Cell[2]).value(`Colour: ${JobInfo.Info4}`);
                    const Start = workbook.sheet(0).cell(Cell[3]).value(`Start: ${JobInfo.Info2}`);
                    const End = workbook.sheet(0).cell(Cell[4]).value(`End: ${JobInfo.Info3}`);




                    r.value(setting.Array);

                    workbook.outputAsync()
                        .then(function (blob) {
                            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                                window.navigator.msSaveOrOpenBlob(blob, "out.xlsx");
                            }

                            else {
                                var url = window.URL.createObjectURL(blob);
                                var a = document.createElement("a");
                                document.body.appendChild(a);
                                a.href = url;
                                a.download = FileName;
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                            }
                        });
                })
                .catch(err => console.error(err));
        })
}

export const FilterOutEndedJob = (JobList) => {
    let FilterJob = []

    const Current = new Date()
    const NowTime = new Date(moment(Current, "DD-MM-YYYY HH:mm:ss").toISOString(false)) //when wan to change datetime from (new dete()) to the usual view

    // const NowTime2 = moment(Current, "DD-MM-YYYY HH:mm:ss").toISOString(false)

    JobList.forEach(element => {
        try {
            let DateBuf = new Date(moment(element['End Time'], "DD-MM-YYYY HH:mm:ss").toISOString(false))
            console.log(NowTime);
            console.log(DateBuf);


            // console.log(new Date(moment(element['End Time'], "DD-MM-YYYY HH:mm:ss").toISOString(false)));

            if (DateBuf > NowTime) {
                console.log('got');
                FilterJob.push(element)
            }
            else {
                console.log('not');
            }
        }
        catch { }
    });

    return FilterJob
}

export const VisualizeLogColumb = (DataOption) => {

    let data_filter = DataOption.map(obj => {
        let cobj = []

        cobj = {
            text: obj,
            value: obj,
        }
        return cobj
    })

    const parseDMYhm = (s) => {
        var b = s.split(/\D/);
        return new Date(b[2], b[1] - 1, b[2], b[3], b[4]);
    }

    const columns = [
        {
            title: 'Parameter',
            dataIndex: 'Parameter',
            filters: data_filter,
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
            title: 'time',
            dataIndex: 'time',
            sorter: (a, b) => parseDMYhm(a.time) - parseDMYhm(b.time),
        },
    ];

    return columns
}

export const DataSortTimeMcG = (response) => {
    let DataReturn = []
    console.log(response);
    if (response.success === true) {
        const data = response.data
        let i = 0

        DataReturn = data.map(obj => {
            let cobj = []
            let date_new = moment(obj.fields.DateCreated);
            let DateComponent = date_new.utc(true).format('DD-MM-YYYY HH:mm:ss')
            let TimeComponent = date_new.utc(true).format('HH:mm:ss')
            let ar0 = TimeComponent.split(':')
            let ar1 = ar0[0] + ':' + ar0[1]
            // let SV = obj.fields.

            cobj = {
                'key': i++,
                'time': ar1,
                'date': DateComponent,
                'Parameter': obj.fields.Parameter,
                'Value': obj.fields.Value,
            }
            return cobj
        })
        // console.log(DataReturn);
    }
    else {
        // console.log(response)
    }
    return DataReturn
}

export const LogDataMappingTimeMcG = (Datamodel, RawData) => {
    const name = Object.keys(Datamodel)
    let ReturnValue = []
    let bufferModel = {}
    let TimeColumb = []
    let prevdate = ''
    bufferModel.Parameter = 0

    RawData.forEach(element => {
        if (element.date !== prevdate) {
            TimeColumb.push(element.date)
            prevdate = element.date
        }
    });
    // console.log(TimeColumb);

    name.forEach(element => {
        let Buffer = {}
        Object.assign(Buffer, bufferModel)
        Buffer.Parameter = element

        RawData.forEach(element2 => {
            if (element2.Parameter === element) {
                Buffer[element2.time] = element2.Value
                Buffer['key'] = element2.key
            }
        })
        ReturnValue.push(Buffer)
    })


    console.log(ReturnValue);
    return ReturnValue
}


export const LogDataMappingNameRT = (Datamodel, RawData) => {
    const name = Object.keys(Datamodel)

    let prevtime = [], period = "", ReturnValue = []

    const parasearch = (item) => {
        if (item.date === period) { return true; }
        return false
    }

    RawData.forEach(element => {
        if (element.date === prevtime) { }

        else {
            prevtime = element.date
            period = element.date

            let data_buf3 = {}

            name.forEach(element => {
                data_buf3[element] = 0
            });

            let data_buf2 = RawData.filter(parasearch)

            data_buf2.map(obj => {
                data_buf3['key'] = obj.date
                data_buf3['Time'] = obj.date
                data_buf3['time'] = obj.time

                data_buf3[obj.Label] = obj.Value
                return data_buf3
            })
            ReturnValue.push(data_buf3)
        }
    })
    return ReturnValue
}

export const FilterByName = (TargetName, RawData) => {
    let DataReturn

    DataReturn = RawData.map(obj => {
        let DataObjBuf = {}
        DataObjBuf = {
            'Time': obj['Time'],
            'Feeder Speed': obj[TargetName],
            'State': obj[TargetName] > 10 ? 1 : 0,
        }
        return DataObjBuf
    })
    return DataReturn
}

const CalculateTiming = (ProductperHour, RawData) => {

}


export const FilterOutExcessTime = (RawData) => {
    let ReturnData = []
    RawData.forEach(element => {
        let ConditionBuf = element['Time'].split(' ')[1].split(':')[1]

        if (ConditionBuf === '00') {
            ReturnData.push(element)
        }

    });
    return ReturnData
}

export const TimeInterval = (StartTime, EndTime) => {

    var startTime = moment(StartTime, "DD-MM-YYYY HH:mm:ss").toISOString(false).split('.')[0] + "Z"
    var endTime = moment(EndTime, "DD-MM-YYYY HH:mm:ss").toISOString(false).split('.')[0] + "Z"

    //   let s =  ConvertMonentToDateTime(test)

    let a = moment(startTime)
    let b = moment(endTime)

    var durationDay = b.diff(a, 'days')
    var durationHour = b.diff(a, 'hours')
    durationHour = durationHour % 24
    var durationMinutes = b.diff(a, 'minutes')
    durationMinutes = durationMinutes % 60

    let TotalDuration = {
        Day: durationDay,
        Hours: durationHour,
        Minutes: durationMinutes
    }

    // console.log(s);
    // console.log(`${durationDay} Days ${durationHour} Hours  ${durationMinutes} Minutes `);
    return TotalDuration

}


export const DateDisplay = () => {
    let DateToday = new Date()
    let date = DateToday.getDate();
    let month = DateToday.getMonth() + 1;
    let year = DateToday.getFullYear();


    let DateTime = date + '/' + month + '/' + year

    return DateTime
}


export const DataSortTimeMSM = (response) => {
    let DataReturn
    if (response.success === true) {
        const data = response.data

        DataReturn = data.map(obj => {
            let cobj = []
            let date_new = moment(obj.fields.date_created);
            let DateComponent = date_new.utc(true).format('DD/MM/YYYY HH:mm:ss')
            let TimeComponent = date_new.utc(true).format('HH:mm:ss')
            let Date = date_new.utc(true).format('DD/MM/YYYY')
            let shift = (moment('06:59:59', 'HH:mm:ss') < moment(TimeComponent, 'HH:mm:ss') && moment(TimeComponent, 'HH:mm:ss') < moment('19:00:00', 'HH:mm:ss')) ? "Morning" : "Night"

            // let SV = obj.fields.

            cobj = {
                'key': `${obj.fields.parameter}  ${DateComponent}`,
                'date': Date,
                'DateTime': DateComponent,
                'Parameter': obj.fields.parameter,
                'Value': parseFloat(obj.fields.value),
                'type': obj.fields.parameter,
                'Shift': shift
            }
            return cobj
        })
        console.log(DataReturn);
    }
    else {
        // console.log(response)
    }
    return DataReturn
}

export const LogDataMappingTimeMSM = (Datamodel, RawData) => {
    const name = Object.keys(Datamodel)
    let ReturnValue = []
    let bufferModel = {}
    bufferModel.Parameter = 0

    for (let i = 0; i < 24; i++) {
        let n
        i < 10 ? n = `0${i}` : n = i
        bufferModel[`${n}:00`] = 0
    }

    name.forEach(element => {
        let Buffer = {}
        Object.assign(Buffer, bufferModel)
        Buffer.Parameter = element

        RawData.forEach(element2 => {
            if (element2.Parameter === element) {
                Buffer[element2.time] = element2.Value
                Buffer['key'] = element2.Parameter
            }
        })
        ReturnValue.push(Buffer)
    })
    return ReturnValue
}

export const LogDataMappingNameMSM = (Datamodel, RawData, type) => {
    const name = Object.keys(Datamodel)

    let prevtime = [], period = "", ReturnValue = []

    const parasearch = (item) => {
        if (item.DateTime === period) { return true; }
        return false
    }

    RawData.forEach(element => {
        if (element.DateTime === prevtime) { }

        else {
            prevtime = element.DateTime
            period = element.DateTime

            let data_buf3 = {}
            let data_buf2 = RawData.filter(parasearch)
            // console.log(data_buf2);

            switch (type) {
                case 'daily':

                    name.forEach(element => {
                        data_buf3[element.split('_')[0]] = 0
                    });

                    data_buf2.map(obj => {

                        data_buf3['DateTime'] = obj.date
                        data_buf3['Shift'] = 'Daily'
        
                        let namebuf = obj.Parameter.split('_')[0]
                        // console.log(namebuf);
        
                        data_buf3[namebuf] = obj.Value
                        return data_buf3
                    })

                    break;

                case 'shift':

                    name.forEach(element => {
                        data_buf3[element] = 0
                    });

                    data_buf2.map(obj => {

                        data_buf3['DateTime'] = obj.DateTime
                        data_buf3['Shift'] = obj.Shift
        
                        let namebuf = obj.Parameter.split('_')[0]
                        // console.log(namebuf);
        
                        data_buf3[namebuf] = obj.Value
                        return data_buf3
                    })

                    break;

                default:
                    break;
            }




            // console.log(data_buf3);
            ReturnValue.push(data_buf3)
        }
    })
    return ReturnValue
}


export const EventSortTimeMSM = (response) => {
    let DataReturn
    if (response.success === true) {
        const data = response.data

        DataReturn = data.map(obj => {
            let cobj = []
            let date_new = moment(obj.fields.date_created);
            let DateComponent = date_new.utc(true).format('DD/MM/YYYY HH:mm:ss')
            let Date = date_new.utc(true).format('DD/MM/YYYY')
            let TimeComponent = date_new.utc(true).format('HH:mm:ss')
            let ar0 = TimeComponent.split(':')
            let ar1 = ar0[0] + ':' + ar0[1]
            let tag = Date + '' + TimeComponent + '#' + obj.fields.parameter + 'TBAMSMSGNBLH'

            // console.log(TimeComponent);
            // console.log(moment('18:59:59', 'HH:mm:ss'));

            let shift = (moment('06:59:59', 'HH:mm:ss') < moment(TimeComponent, 'HH:mm:ss') && moment(TimeComponent, 'HH:mm:ss') < moment('19:00:00', 'HH:mm:ss')) ? "Morning" : "Night"

            // let SV = obj.fields.

            cobj = {
                'key': `${obj.fields.parameter}  ${DateComponent}`,
                'DateTime': DateComponent,
                'IdUnit': parseFloat(obj.fields.value),
                'Label': obj.fields.parameter,
                'Value': parseFloat(obj.fields.value),
                'Weight': 'TBA',
                'Location': 'MSMSGBLH',
                'Tag': tag,
                'Shift': shift
            }
            return cobj
        })
        // console.log(DataReturn);
    }
    else {
        // console.log(response)
    }
    return DataReturn
}

export const MSM_Realtime_GetDateTime = (OffsetInitialDay, OffsetDayEnd) => {

    let DateTimeArray = []
    let separator = '-'

    let today = new Date()
    let tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + OffsetDayEnd)
    today.setDate(today.getDate() - OffsetInitialDay)

    let date1 = today.getDate();
    let month1 = today.getMonth() + 1;
    let year1 = today.getFullYear();

    let date2 = tomorrow.getDate();
    let month2 = tomorrow.getMonth() + 1;
    let year2 = tomorrow.getFullYear();


    let Morning_Start_time = `${year1}${separator}${month1 < 10 ? `0${month1}` : `${month1}`}${separator}${date1} 07:00:00`
    let Morning_End_time = `${year2}${separator}${month2 < 10 ? `0${month2}` : `${month2}`}${separator}${date1} 18:59:59`
    let Night_Start_time = `${year1}${separator}${month1 < 10 ? `0${month1}` : `${month1}`}${separator}${date1} 19:00:00`
    let Night_End_time = `${year2}${separator}${month2 < 10 ? `0${month2}` : `${month2}`}${separator}${date2} 06:59:59`

    DateTimeArray[0] = moment(Morning_Start_time).toISOString(false).split('.')[0] + "Z"
    DateTimeArray[1] = moment(Morning_End_time).toISOString(false).split('.')[0] + "Z"
    DateTimeArray[2] = moment(Night_Start_time).toISOString(false).split('.')[0] + "Z"
    DateTimeArray[3] = moment(Night_End_time).toISOString(false).split('.')[0] + "Z"

    return DateTimeArray
}


export const Find_initial_Time = () => {
    let separator = '-'

    let Over = false;

    let today = new Date()

    let date1 = today.getDate();
    let month1 = today.getMonth() + 1;
    let year1 = today.getFullYear();

    let Start_time = `${year1}${separator}${month1 < 10 ? `0${month1}` : `${month1}`}${separator}${date1} 07:00:00`

    let init = new Date(Start_time)

    // console.log(today);
    // console.log(init);

    if (today > init) {
        Over = true
    }

    else {
        Over = false
    }

    return Over

}
