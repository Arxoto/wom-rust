export default {
    whenfocus: (fn: (() => void) | null) => { document.body.onfocus = fn; },
    whenkeydown: (onkeydown: ((event: KeyboardEvent) => void) | null) => {
        window.onkeydown = onkeydown;
    }
}