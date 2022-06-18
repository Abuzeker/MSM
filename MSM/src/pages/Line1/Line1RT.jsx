import { Button, Col, Divider, Row } from 'antd'
import React, { useState, useEffect } from 'react'
import { RealtimeData_Request } from '../../api'
import { C3Model, C3ModelMap, G2Model } from '../../DataRequest/DataModel'
import { DataSortRT } from '../../DataRequest/RealTimeRequestWrap'
import HMIWrapper from '../Realtime/HMIWrapper'
import RealTimeGraphWrapper from '../Realtime/RealTimeGraphWrapper'
import RealTimeTableWrapper from '../Realtime/RealTimeTableWrapper'
import PolymerC3 from './HMI/PolymerC3'
import PolymerG2 from './HMI/PolymerG2'

let C3DataModel = C3Model
let G2DataModel = G2Model
let BlankPage = 1

let RealTimeValue = {
    "C3HMI": C3DataModel,
    "G2HMI": G2DataModel,
    "C3Table": [],
    "G2Table": [],
    "C3Graph": [],
    "G2Graph": [],
}



const Line1RT = () => {

    const [state, setState] = useState({ count: 0, count2: 100 });

    const DataRequest = async (label, site, page, line, HMIName, TableName) => {
        const response = await RealtimeData_Request(label, site, page, line)
        RealTimeValue[TableName] = DataSortRT(response)
        RealTimeValue[HMIName] = RealTimeValue[TableName]
        console.log(RealTimeValue[HMIName]);
    }


    const RenderNewData = () => {

        DataRequest([], 'Polymerlink', BlankPage, 'C3', 'C3HMI', "C3Table")
        DataRequest([], 'Polymerlink', BlankPage, 'G2', 'G2HMI', "G2Table")

        setState(({ count }) => ({ count: count + 1 }));
    }


    useEffect(() => {
        RenderNewData()

        const interval = setInterval(() => {
            RenderNewData()
        }, 3000)

        return () => {
            clearInterval(interval)
            console.log('Unmount Effect Line1RT');
        }

    }, [])


    return (
        <div>
            <HMIWrapper Tab={['C3', 'G2']}>
                <PolymerC3 key={'C3'} Parameter={RealTimeValue['C3HMI']} />
                <PolymerG2 key={'G2'} Parameter={RealTimeValue['G2HMI']} />
            </HMIWrapper>

            <Divider orientation="left">Parameter List</Divider>

            <div>
                <Row gutter={[16, 16]}>
                    <Col span={12} xs={24} xl={12}>
                        <RealTimeTableWrapper TableTitle={'C3'} TableData={RealTimeValue['C3Table']} />
                    </Col>
                    <Col span={12} xs={24} xl={12}>
                        <RealTimeTableWrapper TableTitle={'G2'} TableData={RealTimeValue['G2Table']} />
                    </Col>

                </Row>
            </div>

            <div>
                <Row gutter={[16, 16]}>

                    <Col span={12} xs={24} xl={12}>
                        <RealTimeGraphWrapper GarphTitle={'C3'}
                            DataModel={C3ModelMap}
                            RawDataReceive={RealTimeValue['C3Table']}
                            Divname={'C3Graph'}
                        />
                    </Col>

                    <Col span={12} xs={24} xl={12}>
                        <RealTimeGraphWrapper GarphTitle={'G2'}
                            DataModel={G2DataModel}
                            RawDataReceive={RealTimeValue['G2Table']}
                            Divname={'G2Graph'}
                        />
                    </Col>

                </Row>
            </div>


        </div>
    )
}

export default Line1RT
