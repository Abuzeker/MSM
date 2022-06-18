import React, { Component } from 'react'
import { Menu } from 'antd';
import { Link, withRouter } from 'react-router-dom';

import menuList from '../../../config/menuConfig'


const SubMenu = Menu.SubMenu;

class LeftNav extends Component {

  //read menuconfig file to render the menu html
  Menucontents = (menuList) => {

    const path = this.props.location.pathname

    return menuList.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.key}>
              {item.title}
            </Link>
          </Menu.Item>
        )
      }

      else {
        if (item.children.find(citem => path.indexOf(citem.key) === 0)) { this.openKey = item.key }
        return (
          <SubMenu
            key={item.key}
            title={item.title}
            icon={item.icon}
          >
            {this.Menucontents(item.children)}
          </SubMenu>
        )
      }
    })
  }

  componentWillMount() { //run once when the component render at the first time
    this.menucontent = this.Menucontents(menuList)
  }



  render() {
    let path = this.props.location.pathname
    console.log(path)
    const openKey = this.openKey

    return (
      <div className='left-nav'>
        <Menu
          mode="inline"
          defaultSelectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          theme='dark'
        >
          {this.menucontent}

        </Menu>

      </div>

    )
  }
}

export default withRouter(LeftNav)
