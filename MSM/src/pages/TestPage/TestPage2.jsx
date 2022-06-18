import React, { Children } from 'react'
import { Page, Text, View, Document, StyleSheet, ReactPDF, PDFDownloadLink } from '@react-pdf/renderer';
import { Button, Table } from 'antd';
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'


const dataSource = [
    {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号',
    },
    {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号',
    },
];

const columns = [
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
    },
];

const TestPage2 = (props) => {


    return (
        <div>
            {props.children}

        </div>
    )
}

export default TestPage2
