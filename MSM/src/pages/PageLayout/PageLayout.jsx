import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Layout, Row, Col, Modal, Avatar, Badge, PageHeader, Descriptions, Statistic } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, UserSwitchOutlined, UserOutlined, AlertOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import axios from 'axios';

import 'antd/dist/antd.css';
import './pagelayout.css';
import logo from '../../assets/MSM.png'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { LogoutBackend } from '../../api';
import Sidebar from './Sidebar/Sidebar';
import Home from '../Home/Home';
import Testpage1 from '../TestPage/Testpage1';
import Line1RT from '../Line1/Line1RT';
import Line1ReportC3 from '../Line1/Line1ReportC3';
import { Testprint } from '../TestPage/Testprint';
import Line1ReportG2 from '../Line1/Line1ReportG2';
import Line1DataLog from '../../pages/Line1/Line1DataLog';
import NotificationC3 from '../Line1/Notification/NotificationC3';
import NotificationLine1 from '../Line1/Notification/NotificationLine1';
import Line1McG from '../Line1/Line1McG';
import EnergyUsage from '../EnergyUsage/EnergyUsage';
import Line1kg from '../Line/Line1kg';
import Line2kg from '../Line/Line2kg';
import Line50kg from '../Line/Line50kg';
import Line1ton from '../Line/Line1ton';



const { Header, Content, Footer, Sider } = Layout;

const PageLayout = () => {
  let history = useHistory();


  const [collapsed, setcollapsed] = useState(false)
  const [NetworkError, setNetworkError] = useState(false)

  useEffect(() => {
    // try{
    //       CheckSession()
    // }
    // catch{}

    return () => {
      console.log("unmount");
    }
  });


  const user = memoryUtils.user
  if (Object.keys(user).length === 0) {
    console.log('dont have')
    return <Redirect to='/Login' />
  }

  const toggle = () => {
    setcollapsed(!collapsed)
  };

  const logout = () => {
    Modal.confirm({
      content: 'Confirm Logout?',
      onOk: async () => {

        const response = await LogoutBackend()

        if (response.message === 'success') {
          console.log('logouted')
          storageUtils.removeUser()
          memoryUtils.user = {}
          history.replace('/login')
        }


      }
    })
  }

  const SessionNotExistHandler = () => {
    console.log('logouted')
    storageUtils.removeUser()
    memoryUtils.user = {}
    history.replace('/login')
  }

  const CheckSession = async () => {

    axios({
      method: 'post',
      url: 'https://www.iotcs.app/api/test2/',
      withCredentials: true
    })

      .then(function (response) {
        response.data.success ? console.log('ok') : SessionNotExistHandler()
        //console.log(response.data.success)
        setNetworkError(false)
      })

      .catch(function (error) {
        //console.log(error);
        setNetworkError(true)
      });

  }



  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsedWidth={80} trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" >
          <img src={logo} alt='Company logo'></img>
        </div>
        <Sidebar />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <Row>
            <Col xs={4} xl={1} >
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: toggle,
              })}
            </Col>

            <Col xs={12} xl={19} >
              {/* <img className="header-logo" src={logo} alt='Company logo'></img> */}
            </Col>

            <Col xs={8} xl={4} style={{ float: 'right' }}>

              <div className='logout' >
                <Avatar size={40} icon={<UserOutlined />}
                  style={{ float: 'right', backgroundColor: '#87d068' }}
                  onClick={logout} />
              </div>

            </Col>
          </Row>

        </Header>
        <Content style={{ margin: '16px 16px' }}>

            {/* <div className="site-page-header-ghost-wrapper" style={{ borderRadius: '15px' }}>
              <PageHeader
                className="site-page-header-responsive"
                title="PLM"
                subTitle={window.location.pathname}
                ghost={true}
              >
                <Row gutter={[16, 16]}>
                  <Statistic
                    style={{
                      marginRight: '32px',
                    }}
                    title="Name" value={memoryUtils.user.name} />
                  <Statistic
                    title="Role"
                    value={memoryUtils.user.role}
                    style={{
                      marginRight: '32px',
                    }}
                  />
                  <Statistic
                    style={{
                      marginRight: '32px',
                    }}
                    title="Production Line" value={memoryUtils.user.site} />
                </Row>

              </PageHeader>
            </div> */}

          <div style={{ padding: 24, minHeight: 360 }}>
            <Switch>
              <Redirect from='/' exact to='/Home' />
              <Route path='/Home' component={Home} />
              <Route path='/Line1kg' component={Line1kg} />
              <Route path='/Line2kg' component={Line2kg} />
              <Route path='/Line50kg' component={Line50kg} />
              <Route path='/Line1ton' component={Line1ton} />
              <Route path='/G2Report' component={Line1ReportG2} />
              <Route path='/DataVisualize' component={Line1DataLog} />
              <Route path='/NotificationLine1' component={NotificationLine1} />
              <Route path='/Line1McG' component={Line1McG}/>
              <Route path='/EnergyUsage' component={EnergyUsage}/>
            </Switch>
          </div>

        </Content>
        <Footer style={{ textAlign: 'center' }}>IOT Control Solution Sdn. Bhd.</Footer>
      </Layout>
    </Layout>
  )
}

export default PageLayout

