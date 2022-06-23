import React, {Fragment} from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#000000'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontStyle: 'bold',
    },
    DateTime: {
        width: '50%',
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    Shift: {
        width: '30%',
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    Line50kg: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    Line1kg: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    Line2kg: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    Line1Ton: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
  });


const InvoiceTableRow = ({items}) => {
    const rows = items.map( item => 
        <View style={styles.row}>
            <Text style={styles.DateTime}>{item["DateTime"]}</Text>
            <Text style={styles.Shift}>{item["Shift"]}</Text>
            <Text style={styles.Line50kg}>{item["Line50kg"]}</Text>
            <Text style={styles.Line1kg}>{item["Line1kg"]}</Text>
            <Text style={styles.Line2kg}>{item["Line2kg"]}</Text>
            <Text style={styles.Line1Ton}>{item["Line1Ton"]}</Text>

            {/* <Text style={styles.amount}>{(item.qty * item.rate).toFixed(2)}</Text> */}
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
export default InvoiceTableRow