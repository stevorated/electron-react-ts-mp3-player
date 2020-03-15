type AudioTrackStatus =
    | 'PLAYING'
    | 'STOPPED'
    | 'PAUSED'
    | 'BUSY'
    | 'INIT'
    | 'ERROR';

export class AudioSample extends AudioContext {
    private path: string;
    private lastTime: number | null = null;
    private source: AudioBufferSourceNode | null = null;
    private status: AudioTrackStatus | null = null;
    private arrayBuffer: ArrayBuffer | null = null;
    // private audioBuffer: AudioBuffer | null = null;

    constructor(path: string) {
        super();
        this.path = path;
        this.status = 'INIT';
    }

    getPath() {
        return this.path;
    }

    getSource() {
        return this.source;
    }

    getStatus() {
        return this.status;
    }

    public async play(
        when?: number,
        offset?: number,
        duration?: number
    ): Promise<void> {
        if (this.status === 'BUSY' || this.status === 'PLAYING') {
            return;
        }

        try {
            this.status = 'BUSY';
            const arrayBuffer = await this.fetchArrayBuffer(this.path);
            this.arrayBuffer = arrayBuffer.slice(0);
            const audioBuffer = await this.decodeAudioData(arrayBuffer);
            this.source = this.createBufferSource();
            this.source.buffer = audioBuffer;
            this.source.connect(this.destination);
            this.source.start(
                this.baseLatency || when,
                this.lastTime ? this.lastTime - 1 : offset,
                duration
            );
            this.status = 'PLAYING';
            return;
        } catch (err) {
            console.log(err);
            this.status = 'ERROR';
        }
    }

    private async fetchArrayBuffer(path: string): Promise<ArrayBuffer> {
        if (this.arrayBuffer) {
            return this.arrayBuffer;
        }
        console.log('fetching');
        const resp = await fetch(path);
        const arrayBuffer = await resp.arrayBuffer();
        this.arrayBuffer = arrayBuffer.slice(0);

        return arrayBuffer;
    }

    public pause() {
        if (this.source) {
            const currentTime = this.source.context.currentTime;
            this.lastTime = currentTime - 1 > 0 ? currentTime - 1 : currentTime;
            this.source.stop();
            this.status = 'PAUSED';
            console.log('paused', this);
        }
    }

    public stop() {
        if (this.source) {
            this.lastTime = null;
            this.source.stop();
            this.source.disconnect();
            this.status = 'STOPPED';
            this.source = null;
            console.log('stoped', this);
        }
    }
}
