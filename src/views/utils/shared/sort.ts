export const by = <T>(
    a: T,
    b: T,
    fieldName: keyof T,
    desc?: boolean
): number => {
    const opp = desc ? -1 : 1;
    if (a[fieldName] > b[fieldName]) {
        return opp;
    } else {
        return opp * -1;
    }
};
