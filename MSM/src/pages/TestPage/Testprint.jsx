import { Button } from 'antd';
import React from 'react';

import ReactToPrint, { PrintContextConsumer } from 'react-to-print';


export class Testprint extends React.PureComponent {
  
  render() {
    return (
        <div>


            <div id='capture'>
                <svgexporttest/>
            </div>
      </div>
    );
  }
}