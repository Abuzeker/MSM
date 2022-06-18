import React, { useState, useEffect } from 'react'
import { Button, Card, Select } from 'antd';
import { Line } from '@antv/g2plot';

const LogGraphWrapper = (props) => {
    // const [Graph, setGraph] = useState([])
    const [line, setline] = useState()
    // const [state, setstate] = useState({re:0})
console.log(props.RawDataReceive);
    useEffect(() => {
        console.log('Reffect');

        setline(new Line(props.Divname, {
            data: props.RawDataReceive,
            xField: 'date',
            yField: 'Value',
            seriesField: 'Parameter',
        }))

        try { line.render() }
        catch { }

        return () => {
        }
    }, [])

    //console.log(props.GarphTitle);
    line.changeData(props.RawDataReceive)


    return (
        <div >
            <Card title={props.GarphTitle} bordered={true} style={{ width: '100%', borderRadius: 15, backgroundColor: '#f0f9fa' }} hoverable={true}>
                <div id={props.Divname}></div>
            </Card>
        </div>
    )

}

export default LogGraphWrapper

