import './Layout.css';

interface ReactDomWithChildren {
    children: any
}

function Box({ children }: ReactDomWithChildren) {
    return (
        <div className='box'>
            {children}
        </div>
    )
}

function Body({ children }: ReactDomWithChildren) {
    return (
        <div className='body'>
            {children}
        </div>
    )
}

function Head({ children }: ReactDomWithChildren) {
    return (
        <div className='head'>
            {children}
            <img src="" alt="" data-tauri-drag-region />
        </div>
    )
}

export { Box, Body, Head };