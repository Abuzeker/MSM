import React from 'react'
import { Page, Text, View, Document, StyleSheet, ReactPDF, PDFDownloadLink } from '@react-pdf/renderer';
import { Button, Table, Tabs } from 'antd';
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Svgexporttest from './Svgexporttest';
import Excel from 'exceljs'
import { saveAs } from 'file-saver';
import XlsxPopulate from 'xlsx-populate'


// const columns = [
//     {
//         title: 'Full Name',
//         width: 100,
//         dataIndex: 'name',
//         key: 'name',
//         fixed: 'left',
//     },
//     {
//         title: 'Age',
//         width: 100,
//         dataIndex: 'age',
//         key: 'age',
//         fixed: 'left',
//     },
//     {
//         title: 'Column 1',
//         dataIndex: 'address',
//         key: '1',
//         width: 150,
//     },
//     {
//         title: 'Column 2',
//         dataIndex: 'address',
//         key: '2',
//         width: 150,
//     },
//     {
//         title: 'Column 3',
//         dataIndex: 'address',
//         key: '3',
//         width: 150,
//     },
//     {
//         title: 'Column 4',
//         dataIndex: 'address',
//         key: '4',
//         width: 150,
//     },
//     {
//         title: 'Column 5',
//         dataIndex: 'address',
//         key: '5',
//         width: 150,
//     },
//     {
//         title: 'Column 6',
//         dataIndex: 'address',
//         key: '6',
//         width: 150,
//     },
//     {
//         title: 'Column 7',
//         dataIndex: 'address',
//         key: '7',
//         width: 150,
//     },
//     { title: 'Column 8', dataIndex: 'address', key: '8' },
//     {
//         title: 'Action',
//         key: 'operation',
//         fixed: 'right',
//         width: 100,
//         render: () => <a>action</a>,
//     },
// ];

// const data = [];
// for (let i = 0; i < 100; i++) {
//     data.push({
//         key: i,
//         name: `Edrward ${i}`,
//         age: 32,
//         address: `London Park no. ${i}`,
//     });
// }

const Testpage1 = () => {

    // const WriteExcelCell = () => {

    //     function s2ab(s) {

    //         var buf = new ArrayBuffer(s.length);
    //         var view = new Uint8Array(buf);
    //         for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    //         return buf;

    //     }

    //     let test = [
    //         [
    //             '11', '11', '11', '11', '11'
    //         ],
    //         [
    //             '12', '12', '12', '12', '12'
    //         ]
    //     ]

    //     fetch("ExtruderSheet.xlsx")
    //         .then(res => res.arrayBuffer())
    //         .then(ab => {
    //             const wb = XLSX.read(ab, { type: "string" });
    //             const wsname = wb.SheetNames[0];
    //             const ws = wb.Sheets[wsname];

    //             XLSX.utils.sheet_add_aoa(ws, test, { origin: 'O6' });

    //             let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    //             console.log('Done');

    //             saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'test.xlsx');

    //         })
    // }

    const TestEcelHandler = () => {

        fetch('ExtruderSheet.xlsx')
            .then(res => res.arrayBuffer())
            .then(buffer => {
                XlsxPopulate.fromDataAsync(buffer)
                    .then(workbook => {

                        // r = workbook.sheet(0).cell("A8").value("foo");
                        const r = workbook.sheet(0).range("A7:C9");

                        r.value([
                            [1, 2, 3],
                            [4, 5, 6],
                            [7, 8, 9]
                        ]);

                        workbook.outputAsync()
                            .then(function (blob) {
                                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                                    // If IE, you must uses a different method.
                                    window.navigator.msSaveOrOpenBlob(blob, "out.xlsx");
                                } else {
                                    var url = window.URL.createObjectURL(blob);
                                    var a = document.createElement("a");
                                    document.body.appendChild(a);
                                    a.href = url;
                                    a.download = "ExtruderSheet.xlsx";
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                    document.body.removeChild(a);
                                }
                            });
                    })
                    .then(data => {
                        // saveAs(new Blob([s2ab(data)], { type: "application/octet-stream" }), 'test.xlsx');
                        console.log(data);
                        // upload data to AWS S3
                    })
                    .catch(err => console.error(err));
            });
    }




    return (
        <div>
            <Button onClick={TestEcelHandler}>
                capture
            </Button>
            {/* 
            <div id='capture' style={{ width: '100%', height: 600, borderRadius: 15, }}>
            </div> */}
        </div>
    )
}


export default Testpage1
