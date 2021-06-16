import React, { Component } from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { database } from '../../../api/config'
import { connect } from 'react-redux'
import { setCurrentChannel, setPrivateChannel } from '../../../actions/'

class DirectMessages extends Component {
  state = {
    user: this.props.currentUser,
    users: [],
    usersRef: database.ref('users'),
    connectedRef: database.ref('.info/connected'),
    presenceRef: database.ref('presence'),
    activeChannel: ''
  }

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid)
    }
  }

  addListeners = currentUserUid => {
    let loadedUsers = []
    this.state.usersRef.on('child_added', snap => {
      if (currentUserUid !== snap.key) {
        let user = snap.val()
        user['uid'] = snap.key
        user['status'] = 'offline'
        loadedUsers.push(user)
        this.setState({ users: loadedUsers })
      }
    })

    this.state.connectedRef.on('value', snap => {
      // handles online or offline status
      if (snap.val() === true) {
        const ref = this.state.presenceRef.child(currentUserUid)
        ref.set(true)
        ref.onDisconnect().remove(err => {
          //catch error
          if (err !== null) {
            console.error(err)
          }
        })
      }
    })

    this.state.presenceRef.on('child_added', snap => {
      if (currentUserUid !== snap.key) {
        // add status to user as online
        this.addStatus(snap.key, true)
      }
    })

    this.state.presenceRef.on('child_removed', snap => {
      if (currentUserUid !== snap.key) {
        // remove status to user as offline
        this.addStatus(snap.key, false)
      }
    })
  }

  addStatus = (userId, connected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user['status'] = `${connected ? 'online' : 'offline'}`
      }
      return acc.concat(user)
    }, [])
    this.setState({ users: updatedUsers })
  }

  isUserOnline = user => user.status === 'online'

  // handle direct message
  changeChannel = user => {
    const channelId = this.getChannelId(user.uid)
    const channelData = {
      id: channelId,
      name: user.name
    }
    this.props.setCurrentChannel(channelData)
    this.props.setPrivateChannel(true)
    this.setActiveChannel(user.uid)
  }

  setActiveChannel = userId => {
    this.setState({ activeChannel: userId })
  }

  getChannelId = userId => {
    const currentUserId = this.state.user.uid
    return userId < currentUserId ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`
  }

  render() {
    const { users, activeChannel } = this.state

    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>
          {''}({users.length})
        </Menu.Item>
        {/* Users to Send Direct Messages */}
        {users.map(user => (
          <Menu.Item
            key={user.uid}
            active={user.uid === activeChannel}
            onClick={() => this.changeChannel(user)}
            style={{ opacity: 0.7, fontStyle: 'italic' }}
          >
            <Icon name="circle" color={this.isUserOnline(user) ? 'green' : 'red'} />@ {user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    )
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(DirectMessages)
