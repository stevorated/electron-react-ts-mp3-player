import React, { Component } from 'react';
import { PlayerContainer, SongsListContainer } from './partials';

export class Middle extends Component {
  render() {
    return (
      <div className="flexbox-item-grow main">
        <PlayerContainer />
        <SongsListContainer />
      </div>
    );
  }
}
