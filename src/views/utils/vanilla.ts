type Props = {
    childId: string;
    parentId: string;
    ratio?: number;
    title?: string;
};

export function shouldFloat({
    childId,
    parentId,
    ratio = 11.3,
    title,
}: Props): boolean {
    const floaterWrap = document.getElementById(parentId);
    const floater = document.getElementById(childId);
    const floaterWrapWidth = floaterWrap?.clientWidth ?? 0;
    const floaterLength =
        floater?.innerText.length ?? floater?.innerText.length ?? 0;
    const textLength = (title?.length ?? 0) + 8;
    const fromDoc = floaterLength * ratio > floaterWrapWidth;
    const fromWindow = window.innerWidth < (textLength + 8) * ratio + 350;

    return fromWindow || fromDoc;
}