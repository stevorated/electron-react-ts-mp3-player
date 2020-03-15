// import React, { useRef } from 'react';

// import './canvas.style.less';
// import { Hr } from '../../../shared';

// type Props = {
//     getPlayer: () => HTMLMediaElement | null;
// };

// export function Canvas({ getPlayer }: Props) {
//     const container = useRef<HTMLDivElement>(null);
//     const canvas = useRef<HTMLCanvasElement>(null);

//     let ctx: CanvasRenderingContext2D | null = null;
//     let context: AudioContext;
//     let analyser: AnalyserNode;
//     let source: MediaElementAudioSourceNode;
//     let fbc_array: Uint8Array;
//     let bars: number = 100;
//     let bar_x: number;
//     let bar_width: number;
//     let bar_height: number;

//     const player = getPlayer();

//     if (player) {
//         // player.src =
//         // 'C:/Users/garbe/Desktop/album/album_1/Actually Not Master.mp3';
//         // player.play();

//         // const context = new AudioContext();
//         // const source = context.createAnalyser();
//         // source.connect(context.destination);

//         // start

//         // const [first, setFirst] = useState(true);
//         // let audio: HTMLAudioElement | null;

//         // useEffect(() => {});

//         // function initMp3Player(player: HTMLAudioElement) {
//         //     console.log('HERE');
//         //     audio = new window.Audio();
//         //     audio.src = '../2 Pieces Master.mp3';
//         //     audio.controls = false;
//         //     audio.loop = true;
//         //     audio.autoplay = true;
//         //     setFirst(false);

//         //     // container.current.appendChild(audio);
//         context = new window.AudioContext(); // AudioContext object instance

//         analyser = context.createAnalyser(); // AnalyserNode method

//         ctx = canvas.current?.getContext('2d') || null;
//         //     // Re-route audio playback into the processing graph of the AudioContext
//         source = context.createMediaElementSource(player);
//         // source.connect(analyser);
//         // analyser.connect(context.destination);
//         // frameLooper();
//     }

//     function frameLooper() {
//         if (!canvas.current || !ctx) {
//             return;
//         }

//         window.requestAnimationFrame(frameLooper);
//         fbc_array = new Uint8Array(analyser.frequencyBinCount);
//         analyser.getByteFrequencyData(fbc_array);
//         ctx.clearRect(0, 0, canvas.current.width, canvas.current.height); // Clear the canvas
//         ctx.fillStyle = 'rgba(100, 200, 100, 0.4)'; // Color of the bars
//         bars = 37;
//         for (var i = 0; i < bars; i++) {
//             bar_x = i * 8;
//             bar_width = 4;
//             bar_height = -(fbc_array[i] / 2);
//             //  fillRect( x, y, width, height ) // Explanation of the parameters below
//             ctx.fillRect(bar_x, canvas.current.height, bar_width, bar_height);
//         }
//     }

//     return (
//         <div className="canvas-container container-audio centered">
//             <div id="mp3_player">
//                 <div id="audio_box"></div>
//                 <canvas id="analyser_render"></canvas>
//             </div>
//             <Hr />
//         </div>
//     );
// }
