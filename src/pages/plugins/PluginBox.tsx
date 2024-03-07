// import { parseQuery } from "../../core/runtime";
import NotFound from "../NotFound";

/**
 * see runtime.exWebView
 * 暂未用到 没采用 iframe 方案
 */
export default function () {
    // let ss = window.location.search;
    // let query = parseQuery(ss);
    // const goto = query.goto;
    const goto = undefined;
    if (!goto) {
        return <NotFound></NotFound>
    }

    console.log("plugin webview", goto)
    return <>
        <iframe src={goto} style={{ border: '0', overflow: 'auto', height: '100%', width: '100%' }}></iframe>
    </>
}