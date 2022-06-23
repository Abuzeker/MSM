import React from 'react';
import { Page, Document, Image, StyleSheet } from '@react-pdf/renderer';
// import InvoiceTitle from './InvoiceTitle'
// import BillTo from './BillTo'
// import InvoiceNo from './InvoiceNo'
// import InvoiceItemsTable from './InvoiceItemsTable'
// import InvoiceThankYouMsg from './InvoiceThankYouMsg'
import LetterHead from '../.././src/assets/MSMHeader.png'
import LetterFoot from '../.././src/assets/MSMFooter.png'
import InvoiceItemsTable from './InvoiceItemsTable';


const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 20,
        paddingLeft: 50,
        paddingRight: 50,
        lineHeight: 2,
        flexDirection: 'column',
    },
    Head: {
        width: 500,
        height: 70,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    Foot: {
        paddingTop: 20,
        width: 500,
        height: 70,
        marginLeft: 'auto',
        marginRight: 'auto'
    }
});



const Invoice = ({ invoice }) => {
    var PageLength = Math.ceil(invoice.items.length / 24);
    let end = 0
    let start = 0

    return (
        <Document>

            {(() => {
                const pages = [];
                console.log(invoice);

                let pagedata = []

                for (let i = 0; i < PageLength; i++) {

                    if (invoice.items.length < (start + 24)) {end = invoice.items.length}
                    else {end = start + 24}

                    pagedata = invoice.items.slice(start, end);

                    start = end + 1

                    //0-24
                    //25-49
                    //50-74
                    //75-99

                    console.log(pagedata);

                    pages.push(
                        <Page size="A4" style={styles.page}>
                            <Image style={styles.Head} src={LetterHead} />

                            <InvoiceItemsTable invoice={pagedata} />

                            <Image style={styles.Foot} src={LetterFoot} />
                        </Page>

                    )

                }
                return pages;

            })()}

        </Document>
    )


}

export default Invoice