import React, { Component } from 'react';
import { Playlists } from './partials';
import { treeMock } from '../../constants/mocks';

import './Explorer.style.less';

export class Explorer extends Component {
    render() {
        return (
            <aside className="flexbox-item-grow sidebar">
                …
                <Playlists playlists={treeMock} />
            </aside>
        );
    }
}
