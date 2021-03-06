import React from 'react';
import {View, StyleSheet } from '@react-pdf/renderer';
// import InvoiceTableHeader from './InvoiceTableHeader'
import InvoiceTableRow from './InvoiceTableRow'
import InvoiceTableBlankSpace from './InvoiceTableBlankSpace'
import InvoiceTableHeader from './InvoiceTableHeader';
// import InvoiceTableFooter from './InvoiceTableFooter'

const tableRowsCount = 24;

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#000000',
    },
});

  const InvoiceItemsTable = ({invoice}) => (
    <View style={styles.tableContainer}>
        <InvoiceTableHeader/>
        <InvoiceTableRow items={invoice} />
        <InvoiceTableBlankSpace rowsCount={ tableRowsCount - invoice.length} />
        {/* <InvoiceTableFooter items={invoice.items} /> */}
    </View>
  );
  
  export default InvoiceItemsTable