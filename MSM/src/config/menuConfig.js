
import {
    DesktopOutlined, DashboardOutlined,
    HomeOutlined, ConsoleSqlOutlined,
    SendOutlined, UserSwitchOutlined, StockOutlined,ThunderboltOutlined
  } from '@ant-design/icons';
  
  
  const menuList = [
    {
      title: 'Home',
      key: '/Home',
      icon: <HomeOutlined />,
      isPublic: true,
    },
  
    {
        title: 'Line',
        key: '/Line 1',
        icon: <DesktopOutlined />,
        children: [
          {
            title: 'Line 1Kg',
            key: '/Line1kg',
            icon: <DashboardOutlined />
          },
          {
            title: 'Line 2Kg',
            key: '/Line2kg',
            icon: <DashboardOutlined />
          },
          {
            title: 'Line 50Kg',
            key: '/Line50kg',
            icon: <DashboardOutlined />
          },
          {
            title: 'Line 1Ton',
            key: '/Line1ton',
            icon: <DashboardOutlined />
          },

          // {
          //   title: 'Report G2',
          //   key: '/G2Report',
          //   icon: <ConsoleSqlOutlined />
          // },
          // {
          //   title: 'Maguire C3',
          //   key: '/Line1McG',
          //   icon: <ConsoleSqlOutlined />
          // },
        ]
      },
  
      // {
      //   title: 'Alfa Laval',
      //   key: '/Alfa',
      //   icon: <DesktopOutlined />,
      //   children: [
      //     {
      //       title: 'RealTime',
      //       key: '/AlfaRealTime',
      //       icon: <DashboardOutlined />
      //     },
      //     {
      //       title: 'DataVisualize',
      //       key: '/DataVisualAlfaLava',
      //       icon: <StockOutlined />
      //     },
      //     {
      //       title: 'Report',
      //       key: '/AlfaLavalReport',
      //       icon: <ConsoleSqlOutlined />
      //     },
      //   ]
      // },
  
      // {
      //   title: 'Tirtiaux',
      //   key: '/Tirtiaux',
      //   icon: <DesktopOutlined />,
      //   children: [
      //     {
      //       title: 'RealTime',
      //       key: '/TirtiauxRealTime',
      //       icon: <DashboardOutlined />
      //     },
      //     {
      //       title: 'DataVisualize',
      //       key: '/DataVisualTritiaux',
      //       icon: <StockOutlined />
      //     },
      //     {
      //       title: 'Report',
      //       key: '/TirtiauxReport',
      //       icon: <ConsoleSqlOutlined />
      //     },
      //   ]
      // },

      {
        title: 'Overall View',
        key: '/AllLine',
        icon: <DashboardOutlined />
      },

      {
        title: 'LogExport',
        key: '/EnergyUsage',
        icon: <ThunderboltOutlined />,
      },
  
      // {
      //   title: 'NotificationLine1',
      //   key: '/NotificationLine1',
      //   icon: <SendOutlined />,
      // },
    
      // {
      //   title: 'Test',
      //   key: '/Testpage1',
      //   icon: <UserSwitchOutlined />
      // }
  
  ]
  
  export default menuList
