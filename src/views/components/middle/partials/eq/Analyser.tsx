import React, { useRef } from 'react';
import { colors } from '../../../../assets/styles/consts';

type Props = {
    source: MediaElementAudioSourceNode | null;
    context: AudioContext | null;
};

export function Analyser({}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // let ctx: CanvasRenderingContext2D | null = null;
    // let analyser: AnalyserNode | null;
    // let fbcArray: Uint8Array;
    // let bars: number = 100;
    // let barX: number;
    // let barWidth: number;
    // let barHeight: number;

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
