import React, { Component } from 'react'
import { Segment, Comment } from 'semantic-ui-react'
import MessageHeader from './MessageHeader/index'
import MessageForm from './MessageForm/index'
import MessageBubble from './MessageBubble/index'
import { database } from '../../api/config'
import { connect } from 'react-redux'
import { setUserPosts } from '../../actions/'

class Message extends Component {
  state = {
    messagesRef: database.ref('messages'),
    messages: [],
    messagesLoading: true,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    userRef: database.ref('users'),
    numUniqueUsers: '',
    searchTerm: '',
    searchLoading: false,
    searchResults: [],
    privateChannel: this.props.isPrivateChannel,
    privateMessagesRef: database.ref('privateMessages'),
    isChannelStarred: false
  }

  componentDidMount() {
    const { channel, user } = this.state

    if (channel && user) {
      this.addListeners(channel.id)
      this.addUserStarsListeners(channel.id, user.uid)
    }
  }

  // Continuing listen for changes
  addListeners = channelId => {
    this.addMessageListener(channelId)
  }

  addMessageListener = channelId => {
    let loadedMessages = []
    const ref = this.getMessagesRef()

    ref.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val())
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      })
      this.countUniqueUsers(loadedMessages)
      this.countUserPosts(loadedMessages)
    })
  }

  addUserStarsListeners = (channelId, userId) => {
    this.state.userRef
      .child(userId)
      .child('starred')
      .once('value')
      .then(data => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val())
          const prevStarred = channelIds.includes(channelId)
          this.setState({ isChannelStarred: prevStarred })
        }
      })
  }

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, privateChannel } = this.state
    return privateChannel ? privateMessagesRef : messagesRef
  }

  // onClick handlers
  handleStar = () => {
    this.setState(
      prevState => ({
        isChannelStarred: !prevState.isChannelStarred
      }),
      () => this.starChannel()
    )
  }

  handleSearchChange = event => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true
      },
      () => this.handleSearchMessage()
    )
  }

  handleSearchMessage = () => {
    const channelMessages = [...this.state.messages] // get the spread value of messages
    const regex = new RegExp(this.state.searchTerm, 'gi') // applied globally and case sensitive
    const searchResults = channelMessages.reduce((acc, message) => {
      if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
        acc.push(message)
      }
      return acc
    }, []) // search result array
    this.setState({ searchResults })
    setTimeout(() => this.setState({ searchLoading: false }), 1000)
  }

  starChannel = () => {
    if (this.state.isChannelStarred) {
      this.state.userRef.child(`${this.state.user.uid}/starred`).update({
        [this.state.channel.id]: {
          name: this.state.channel.name,
          details: this.state.channel.details,
          createdBy: {
            name: this.state.channel.createdBy.name,
            avatar: this.state.channel.createdBy.avatar
          }
        }
      })
    } else {
      this.state.userRef
        .child(`${this.state.user.uid}/starred`)
        .child(this.state.channel.id)
        .remove(err => {
          if (err !== null) {
            console.error(err)
          }
        })
    }
  }

  // Display
  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => <MessageBubble key={message.timestamp} message={message} user={this.state.user} />)

  displayChannelName = channel => {
    return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` : ''
  }

  countUniqueUsers = message => {
    const uniqueUsers = message.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name)
      }

      return acc
    }, [])
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`
    this.setState({ numUniqueUsers })
  }

  countUserPosts = messages => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        }
      }
      return acc
    }, {})
    this.props.setUserPosts(userPosts)
  }

  render() {
    const {
      messagesRef,
      channel,
      user,
      messages,
      numUniqueUsers,
      searchTerm,
      searchResults,
      searchLoading,
      privateChannel,
      isChannelStarred
    } = this.state

    return (
      <React.Fragment>
        <MessageHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          privateChannel={privateChannel}
          handleStar={this.handleStar}
          isChannelStarred={isChannelStarred}
        />

        <Segment>
          <Comment.Group className="message">
            {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
          privateChannel={privateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </React.Fragment>
    )
  }
}

export default connect(null, { setUserPosts })(Message)
