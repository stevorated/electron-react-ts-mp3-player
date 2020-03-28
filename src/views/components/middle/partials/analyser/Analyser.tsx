import React, { useRef } from 'react';
import { colors } from '../../../../assets/consts';

type Props = {
    source: MediaElementAudioSourceNode | null;
    context: AudioContext | null;
};

export function Analyser({}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    return (
        <canvas
            ref={canvasRef}
            style={{
                border: `2px ${colors.lightTextColor} dotted`,
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        />
    );
}
