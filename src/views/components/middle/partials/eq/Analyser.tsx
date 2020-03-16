import React, { useState, useEffect } from 'react';
import { Hr } from '../../../shared';

type Props = {
    handleAnalyse: () => void;
    getPlayer: () => HTMLAudioElement | null;
};

export function Analyser({}: Props) {
    const [first, setFirst] = useState(true);
    // const canvas = useRef<HTMLCanvasElement>(null);
    if (first) {
        setFirst(false);
    }

    useEffect(() => {
        // handleAnalyse();
    });

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
