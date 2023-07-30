export default {
    whenOnfocus: (fn: (() => void) | null) => { document.body.onfocus = fn; },
}