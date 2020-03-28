export const camelToUnderline = (field: string): string => {
    const letters = field.split('');

    const parsed = letters.map(letter => {
        if (letter.toUpperCase() === letter) {
            return `_${letter.toLowerCase()}`;
        }

        return letter;
    });

    return parsed.join('');
};

export const underlineToCamel = (field: string): string => {
    const letters = field.split('');
    let res = '';
    let i = 0;

    while (i < letters.length) {
        if (letters[i] === '_') {
            res += letters[i + 1].toUpperCase();
            i += 2;
        } else {
            res += letters[i];
            i += 1;
        }
    }

    return res;
    // const parsed = letters.map((letter, index) => {
    //     if (letter === '_') {
    //         return `_${letter.toLowerCase()}`;
    //     }

    //     return letter;
    // });

    // return parsed.join('');
};

export const underlineObjectTitles = (obj: object) => {
    const entries = Object.entries(obj).map(([key, value]) => {
        return [camelToUnderline(key), value];
    });

    let newObj = {};

    for (let i = 0; i < entries.length; i++) {
        Object.assign(newObj, { [entries[i][0]]: entries[i][1] });
    }

    return newObj;
};

export const camelcaseObjectTitles = (obj: object) => {
    const entries = Object.entries(obj).map(([key, value]) => {
        return [underlineToCamel(key), value];
    });

    let newObj = {};

    for (let i = 0; i < entries.length; i++) {
        Object.assign(newObj, { [entries[i][0]]: entries[i][1] });
    }

    return newObj;
};
