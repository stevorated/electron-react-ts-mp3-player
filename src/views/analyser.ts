export const createAnalyser = (
    // parent: any,
    canvas: HTMLCanvasElement,
    context: AudioContext,
    source: MediaElementAudioSourceNode
) => {
    const analyser = context.createAnalyser();
    const ctx = canvas.getContext('2d');
    let fbc_array: Uint8Array;
    let bars: number;
    let bar_x: number;
    let bar_width: number;
    let bar_height: number;
    source.connect(context.destination);
    analyser.connect(context.destination);

    frameLooper();

    function frameLooper() {
        if (!canvas || !ctx) {
            return;
        }

        window.requestAnimationFrame(frameLooper);
        fbc_array = new Uint8Array(analyser.frequencyBinCount);

        analyser.getByteFrequencyData(fbc_array);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(100, 200, 100, 0.4)'; // Color of the bars
        bars = 37;
        for (var i = 0; i < bars; i++) {
            bar_x = i * 8;
            bar_width = 4;
            bar_height = -(fbc_array[i] / 2);
            //  fillRect( x, y, width, height ) // Explanation of the parameters below
            ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
        }
    }
};
