import { Button, Col, DatePicker, PageHeader, Row, Statistic, Table } from 'antd';
import React, { useEffect } from 'react'
import { ExportExcelWorkBook, SetDateRange } from '../../DataRequest/LogDataRequestWrap';
import { GeneratePDFG2, NameColumbPDF } from '../../utils/PdfGenerate';
import './NameTableWrapper.css';

const NameTableWrapper = (props) => {


    const SetTimeRange = (value) => {
        const DateRange = SetDateRange(value)
        props.SetTimeRangeCallBack([], DateRange[0], DateRange[1], 'Polymerlink', props.site, props.page, props.BufferName, props.Model)
    }

    const generatePDF = () => {
        let headers = NameColumbPDF(props.Model)
        GeneratePDFG2(headers, props.LogValue, props.JobInfo)
    }

    return (
        <div style={{ paddingTop: '20px' }}>
            <div className="job-header-wrapper" style={{ borderRadius: '15px' }}>
                {/* <DatePicker onChange={SetTimeRange} /> */}
                {/* <Button onClick={generatePDF}> export </Button> */}
                <PageHeader
                    className="site-page-header-responsive"
                    ghost={true}
                    title={props.JobInfo.Info1}
                    extra={[
                        <Button type='primary' style={{ borderRadius: '10px' }}
                            onClick={() => ExportExcelWorkBook(props.LogValue, props.Model,
                                props.startingColumb, props.startingRow, props.EndingColumb,
                                props.EndingRow, props.FileName, props.JobInfo, props.Cell)} > Export Excel </Button>
                    ]}
                >
                    <Row gutter={[16, 16]}>
                        <Statistic
                            title="Grade"
                            value={props.JobInfo.Info5}
                            style={{
                                marginRight: '32px',
                            }}
                        />
                        <Statistic
                            title="Color"
                            value={props.JobInfo.Info4}
                            style={{
                                marginRight: '32px',
                            }}
                        />
                        <Statistic
                            title="Start"
                            value={props.JobInfo.Info2}
                            style={{
                                marginRight: '32px',
                            }}
                        />
                        <Statistic
                            style={{
                                marginRight: '32px',
                            }}
                            title="End"
                            value={props.JobInfo.Info3} />
                    </Row>
                </PageHeader>
            </div>
            <div style={{ paddingTop: '20px' }}>
                <Table columns={props.Columb} dataSource={props.LogValue}
                    bordered scroll={{ x: 2000, y: 500 }}
                    pagination={false} size="small" />
            </div>

        </div >
    )
}

export default NameTableWrapper
