export function animateCSS(
    el: any,
    animationName: string,
    callback?: () => {}
) {
    el.classList.add('animated', animationName);

    function handleAnimationEnd() {
        el.classList.remove('animated', animationName);
        el.removeEventListener('animationend', handleAnimationEnd);

        if (typeof callback === 'function') callback();
    }

    el.addEventListener('animationend', handleAnimationEnd);
}
