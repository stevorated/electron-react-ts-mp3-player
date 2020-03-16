export class Randomize {
    private size: number;
    private range: number[];
    private min = 0;

    constructor(size: number) {
        this.size = size;
        this.range = this.createRange(0, this.size);
    }

    private createRange = (min: number, max: number): number[] => {
        if (min === max - 1) return [min];
        return [min, ...this.createRange(min + 1, max)];
    };

    randomizarray = async () => {
        const randomizer = new Randomize(this.size);
        return Promise.all(this.range.map(() => randomizer.randomize()));
    };

    randomize = async () => {
        const place =
            Math.floor(Math.random() * (this.range.length - this.min)) +
            this.min;

        const chosen = this.range[place];
        this.range = this.range.filter(num => num !== chosen);
        return chosen;
    };
}
