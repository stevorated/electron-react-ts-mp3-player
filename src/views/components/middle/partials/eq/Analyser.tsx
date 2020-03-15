import React, { useState } from 'react';
import { Hr } from '../../../shared';

type Props = {
    getPlayer: () => HTMLAudioElement | null;
};

export function Analyser({}: Props) {
    const [first, setFirst] = useState(true);

    if (first) {
        setFirst(false);
    }

    return (
        <div className="canvas-container container-audio centered hide">
            <div id="mp3_player">
                <div id="audio_box"></div>
                <canvas id="analyser_render"></canvas>
            </div>
            <Hr />
        </div>
    );
}
