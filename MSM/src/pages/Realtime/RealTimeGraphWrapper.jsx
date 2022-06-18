import React, { useState, useEffect } from 'react'
import { Button, Card, Select } from 'antd';
import { Line } from '@antv/g2plot';
import { GraphDataFind } from '../../DataRequest/RealTimeRequestWrap';

const { Option } = Select;

// let line

const RealTimeGraphWrapper = (props) => {

    const [OptionSelected, setOptionSelected] = useState([])
    const [Graph, setGraph] = useState([])
    const [line, setline] = useState()
    const [state, setstate] = useState({re:0})

    const LabelOption = []
    const LabelList = Object.keys(props.DataModel)

    LabelList.forEach(element => {
        LabelOption.push(<Option key={element}>{element}</Option>);
    });

    const handleChange = (value) => {
        setOptionSelected(value)
    }

    const HistoryClear = () => {
        line.update()
        setGraph([])
    }

    const renderline = () =>{
        try { 
            line.render()
            setstate(({ re }) => ({ re: re + 1 }));
         }
        catch { }
    }

    const UpdateData = () => {

        state.re === 0 ? renderline() : console.log('Already Render');

        let GraphBuffer = GraphDataFind(OptionSelected, props.RawDataReceive)
        if (GraphBuffer.length === 0) {
        }

        else {
            GraphBuffer.forEach(element => {
                Graph.push(element)
            });
            try {
                line.changeData(Graph)
            }
            catch { }
        }
    }


    useEffect(() => {
        console.log('Reffect');

        setline(new Line(props.Divname, {
            data: Graph,
            xField: 'time',
            yField: 'Value',
            seriesField: 'Label',
        }))

        try { line.render() }
        catch { }

        return () => {
            console.log('un');
            try {
                line.destroy();
            }
            catch { }

        }
    }, [])

    console.log(props.GarphTitle);
    UpdateData()

    return (
        <div >
            <div>
                <Select
                    mode="multiple"
                    placeholder="Please select"
                    onChange={handleChange}
                    style={{ width: '100%' }}
                >
                    {LabelOption}
                </Select>

                <Button onClick={HistoryClear}> Clear </Button>

            </div>

            <Card title={props.GarphTitle} bordered={true} style={{ width: '100%', borderRadius: 15, backgroundColor: '#f0f9fa' }} hoverable={true}>
                <div id={props.Divname}></div>
            </Card>

        </div>
    )
}

export default RealTimeGraphWrapper
