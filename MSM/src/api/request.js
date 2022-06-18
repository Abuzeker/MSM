import axios from 'axios'
import { message } from 'antd'


export default function request(url, data = {}, type = 'GET') {
    axios.defaults.withCredentials = true
    

    return new Promise((resolve, reject) => {
        let promise

        if (type === 'GET') {
            promise = axios.get(url,{ params: data})
        } else {
            promise = axios.post(url, data)
        }

        promise.then(response => {
            resolve(response.data)
            //console.log(response);
        }).catch(error => {
            message.error('Request Fail: ' + error.message)
        })
    })
}