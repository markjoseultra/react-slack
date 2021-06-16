import React, { Component } from 'react'
import { Header, Segment, Input, Icon } from 'semantic-ui-react'

class MessageHeader extends Component {
  render() {
    const {
      channelName,
      numUniqueUsers,
      handleSearchChange,
      searchLoading,
      privateChannel,
      handleStar,
      isChannelStarred
    } = this.props
    return (
      <Segment clearing>
        {/* Channel Title */}
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {channelName}
            {!privateChannel && (
              <Icon
                name={isChannelStarred ? 'star' : 'star outline'}
                color={isChannelStarred ? 'yellow' : 'black'}
                onClick={handleStar}
              />
            )}
          </span>
          <Header.Subheader>{numUniqueUsers}</Header.Subheader>
        </Header>
        {/* Channel Search Input */}
        <Header floated="right">
          <Input
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Messages"
            onChange={handleSearchChange}
            loading={searchLoading}
          />
        </Header>
      </Segment>
    )
  }
}

export default MessageHeader
