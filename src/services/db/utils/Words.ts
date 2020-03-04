import { loremIpsum } from 'lorem-ipsum';

export class Words {
    private static bank = [
        'Bumfuzzle',
        'Cattywampus',
        'draft',
        'queen',
        'strap',
        'behead',
        'design',
        'pudding',
        'ice',
        'freight',
        'area',
        'contribution',
        'pick',
        'chimney',
        'council',
        'quest',
        'asylum',
        'rub',
        'knock',
    ]; // Array of words to draw from

    static generate(count: number = 1): string {
        return loremIpsum({
            count: count, // Number of "words", "sentences", or "paragraphs"
            format: 'plain', // "plain" or "html"
            // paragraphLowerBound: 3, // Min. number of sentences per paragraph.
            // paragraphUpperBound: 7, // Max. number of sentences per paragarph.
            random: Math.random, // A PRNG function
            // sentenceLowerBound: 5, // Min. number of words per sentence.
            // sentenceUpperBound: 15, // Max. number of words per sentence.
            // suffix: '\n', // Line ending, defaults to "\n" or "\r\n" (win32)
            units: 'words', // paragraph(s), "sentence(s)", or "word(s)"
            words: this.bank, // Array of words to draw from
        });
    }

    static createRandomSongObject = () => {
        return {
            title: `${Words.generate(Math.round(4 * Math.random()))}`,
            path: `c:/${Words.generate()}/${Words.generate(
                Math.round(4 * Math.random())
            )}.mp3`,
            length: 40000 * (Math.random() + 0.5),
        };
    };
}
