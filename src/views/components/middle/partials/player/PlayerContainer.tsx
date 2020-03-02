import React, { Component } from 'react';

import './PlayerContainer.style.less';

export class PlayerContainer extends Component {
    render() {
        return (
            <div>
                <div className="container-audio centered">
                    <audio
                        controls
                        loop
                        onAuxClick={() => {
                            console.log('ya alla');
                        }}
                    >
                        <source
                            src="C:\\Users\\garbe\\Desktop\\album\\album_1\\Actually Not Master.mp3"
                            type="audio/mp3"
                        />
                        Your browser dose not Support the audio Tag
                    </audio>
                    <div className="container-audio current-song-container">
                        <h2 className="nopadd centered">Playlist Title</h2>
                        <h2 className="nopadd centered">track # 4</h2>
                        <h2 className="nopadd centered">Song Title</h2>
                        <h2 className="nopadd centered">02:42</h2>
                    </div>
                </div>
            </div>
        );
    }
}
