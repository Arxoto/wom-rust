import './Layout.css';

interface ReactDomWithChildren {
    children: any
}

function Box({ children }: ReactDomWithChildren) {
    return (
        <div className='layout-box'>
            {children}
        </div>
    )
}

function Body({ children }: ReactDomWithChildren) {
    return (
        <div className='elastic'>
            {children}
        </div>
    )
}

function Head({ children }: ReactDomWithChildren) {
    return (
        <div className='static head'>
            {children}
            <img className='wom-icon' src="" alt="" />
        </div>
    )
}

export { Box, Body, Head };