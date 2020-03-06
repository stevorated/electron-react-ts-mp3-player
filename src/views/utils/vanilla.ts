type Props = {
    childId: string;
    parentId: string;
    ratio?: number;
};

export function shouldFloat({
    childId,
    parentId,
    ratio = 11.3,
}: Props): boolean {
    const floaterWrap = document.getElementById(parentId);
    const floater = document.getElementById(childId);

    const floaterWrapWidth = floaterWrap?.clientWidth ?? 0;
    const floaterLength = floater?.innerText.length ?? 0;

    return floaterLength * ratio > floaterWrapWidth;
}
