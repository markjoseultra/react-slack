import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

import UserPanel from './UserPanel/index'
import Channels from './Channels/index'
import DirectMessages from './DirectMessages/index'
import Starred from './Starred/index'

class SidePanel extends Component {
  render() {
    const { currentUser } = this.props
    return (
      <Menu size="large" inverted fixed="left" vertical style={{ background: '#4c3c4c', fontSize: '1.2rem' }}>
        <UserPanel currentUser={currentUser} />
        <Starred currentUser={currentUser} />
        <Channels currentUser={currentUser} />
        <DirectMessages currentUser={currentUser} />
      </Menu>
    )
  }
}

export default SidePanel
