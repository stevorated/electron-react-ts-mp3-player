import React, { Component } from 'react';
import { EQBars } from './EQBars';
import { Songs } from './Songs';
import { playlistsMock } from '../../../../constants/mocks';

export class SongsListContainer extends Component {
  render() {
    const { songs } = playlistsMock[0];
    return (
      <div className="main-body playlist-container">
        <EQBars cols={30} />
        <Songs rows={17} songs={songs} />
      </div>
    );
  }
}
