import { isMain } from '../app/runtime';
import './Layout.css';
import './LayoutOffspring.css'

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
    if (isMain())
        return (
            <div className='head'>
                {children}
                <img className='wom-icon' src="" alt="" data-tauri-drag-region />
            </div>
        )
    return (
        <>
            <div className="offspring-head" data-tauri-drag-region>
                <div className='offspring-frame'></div>
            </div>
            <div className='offspring-placeholder'></div>
            <div className='head'>
                {children}
                <img className='offspring-icon' src="" alt="" data-tauri-drag-region />
            </div>
        </>
    )
}

export { Box, Body, Head };