
import ajax from './ajax'

import request from './request'

const BASE = ''

export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')


export const RealtimeData_Request = (label, site, page, line) => ajax('https://iotcs.app/read_realtime/',
    {
        "csrfmiddlewaretoken": "csrftoken",
        "Site": site,
        "Line": line,
        "Page": page,
        "Parameters": label
    },
    'POST')

export const graph_request = (parameter, datetimeStart, datetimeEnd, line) => ajax('https://iotcs.app/read_logdata/',
    {
        "csrfmiddlewaretoken": "csrftoken",
        "Site": "Polymerlink",
        "Line": line,
        "Parameters": parameter,
        "DateTime": [datetimeStart, datetimeEnd],
    },
    'POST')

export const logdata_request = (parameter, datetimeStart, datetimeEnd, site, line, page) => ajax('https://iotcs.app/read_logdata/',
    {
        "csrfmiddlewaretoken": "csrftoken",
        "Site": site,
        "Line": line,
        "Parameters": parameter,
        "DateTime": [datetimeStart, datetimeEnd],
        "Page": page
    },
    'POST')

export const logdata_Write = (parameter, line, page) => ajax('https://iotcs.app/write_logdata/',
    {
        "csrfmiddlewaretoken": "csrftoken",
        "Site": "Polymerlink",
        "Page": page,
        "Line": line,
        "Data": parameter
    },
    'POST')

export const write_setting = (parameter, line, page) => ajax('https://iotcs.app/write_setting/',
    {
        "csrfmiddlewaretoken": "csrftoken",
        "Site": "Polymerlink",
        "Line": line,
        "Data": parameter,
        "Page": page,

    },
    'POST')

export const delete_logdata = (parameter, datetimeStart, datetimeEnd, line, page) => ajax('https://iotcs.app/read_logdata/',
    {
        "csrfmiddlewaretoken": "csrftoken",
        "Site": "Polymerlink",
        "Line": line,
        "Parameters": parameter,
        "DateTime": [datetimeStart, datetimeEnd],
        "Page": page
    },
    'POST')

export const ReadJob = (info, datetimeStart, datetimeEnd, site, line, page) => ajax('https://iotcs.app/read_report/',
    {
        "Site": site,
        "Line": line,
        "Info1": info.info1,
        "DateTime": [datetimeStart, datetimeEnd]
    },
    'POST')

export const WriteJob = (info, datetimeStart, datetimeEnd, site, line, page) => ajax('https://iotcs.app/write_report/',
    {
        "csrfmiddlewaretoken": "csrftoken",
        "Site": site,
        "Line": line,
        "Info1": info.info1,
        "Info2": info.info2,
        "Info3": info.info3,
        "Info4": info.info4,
        "Info5": info.info5,

        "DateTime": [datetimeStart, datetimeEnd]
    },
    'POST')

export const DeleteJob = (jobnumber, line, page) => ajax('https://iotcs.app/delete_report/',
    {
        "csrfmiddlewaretoken": "csrftoken",
        "Site": "Polymerlink",
        "Line": line,
        "Page": page,
        "Info1": jobnumber,
    },
    'POST')



export const LoginBackend = (username, password) => request('https://www.iotcs.app/api/login/',
    {
        "username": username,
        "password": password
    },
    'POST')

export const LogoutBackend = () => request('https://www.iotcs.app/api/logout/',
    {

    },
    'POST')

export const testapi = () => request('https://www.iotscs.app/api/test2/',
    {

    },
    'POST')

export const MSM_logdata_request = (parameter, datetimeStart, datetimeEnd) => ajax('http://192.168.68.105:3000/api/read_logdata/',
    {
        "projectID": "MSM",
        "parameters": parameter,
        "datetime": [datetimeStart, datetimeEnd],
    },
    'POST')


export const MSM_EventLog_request = (parameter, datetimeStart, datetimeEnd) => ajax('http://192.168.68.105:3000/api/read_eventlog/',
    {
        "projectID": "MSM",
        "parameters": parameter,
        "datetime": [datetimeStart, datetimeEnd],
    },
    'POST')

export const MSM_RealTime_request = (parameter) => ajax('http://192.168.68.105:3000/api/read_realtime/',
    {
        "projectID": "MSM",
        "parameters": parameter,
    },
    'POST')

export const MSM_Login = (Username, Password) => ajax('http://192.168.68.105:3000/api/login/',
    {
        "username": Username,
        "password": Password
    },
    'POST')

export const MSM_ReportRequest = (parameter, datetimeStart, datetimeEnd, LetterHead, LetterFoot) => ajax('http://192.168.68.105:3000/api/generate_report/',
    {
        "projectID": "MSM",
        "parameters": parameter,
        "letterhead": LetterHead,
        "letterfoor": LetterFoot,
        "fields": ["date_created", "parameter", "value", "unit"],
        "column_names": ["Datetime", "Parameter", "Value", "Unit"],
        "timezone": "Asia/Kuala_Lumpur",
        "datetime": [datetimeStart, datetimeEnd],
        "file_properties": {
            "filename": "report",
            "format": "pdf",
            "page_layout": {
                "page_size": ["8.27", "11.69"],
                "orientation": "portrait",
                "top_margin": "1.00",
                "bottom_margin": "1.00",
                "left_margin": "1.00",
                "right_margin": "1.00"
            }
        }
    },
    'POST')        
    
    
    // "projectID": "MSM",
        // "parameters": parameter,
        // "fields": ["date_created", "parameter", "value", "unit"],
        // "column_names": ["Datetime", "Parameter", "Value", "Unit"],
        // "timezone": "Asia/Kuala_Lumpur",
        // "datetime": [datetimeStart, datetimeEnd],
        // "file_properties": {
        //     "filename": "report",
        //     "format": "pdf",
        //     "page_layout": {
        //         "page_size": ["8.27", "11.69"],
        //         "orientation": "portrait",
        //         "top_margin": "1.00",
        //         "bottom_margin": "1.00",
        //         "left_margin": "1.00",
        //         "right_margin": "1.00"
        //     }
        // }