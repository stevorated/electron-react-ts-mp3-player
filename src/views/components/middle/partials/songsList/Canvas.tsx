import React from 'react';

const bar_width = 2;
const bars = 200;

type Props = {
    getPlayer: () => HTMLMediaElement | null;
};

export function Canvas({ getPlayer }: Props) {
    const player = getPlayer();
    // const canvas = useRef<HTMLCanvasElement>(null);
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');

    if (canvas && player && ctx) {
        const context = new window.AudioContext();
        const analizer = context.createAnalyser();
        analizer.connect(context.destination);
        animationLooper(canvas, ctx, analizer);
    }
    return (
        <div className="container-audio centered border-bottom padding-bottom">
            <canvas
                style={{ color: 'white', background: 'blue' }}
                id="canvas"
                className="canvas"
            ></canvas>
        </div>
    );
}

// for drawing a bar
function drawBar(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    width: number,
    frequency: number
) {
    var lineColor = 'rgb(' + frequency + ', ' + frequency + ', ' + 205 + ')';

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

const animationLooper = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    analyser: AnalyserNode
) => () => {
    console.log('HERE');
    // set to the size of device
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // find the center of the window
    const center_x = canvas.width / 2;
    const center_y = canvas.height / 2;
    const radius = 150;

    // style the background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //draw a circle
    ctx.beginPath();
    ctx.arc(center_x, center_y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    const frequency_array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequency_array);
    for (var i = 0; i < bars; i++) {
        //divide a circle into equal parts
        const rads = (Math.PI * 2) / bars;

        const bar_height = frequency_array[i] * 0.7;

        // set coordinates
        const x = center_x + Math.cos(rads * i) * radius;
        const y = center_y + Math.sin(rads * i) * radius;
        const x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
        const y_end = center_y + Math.sin(rads * i) * (radius + bar_height);

        //draw a bar
        drawBar(ctx, x, y, x_end, y_end, bar_width, frequency_array[i]);
    }
    console.log('HERERE');
    window.requestAnimationFrame(animationLooper(canvas, ctx, analyser));
};
