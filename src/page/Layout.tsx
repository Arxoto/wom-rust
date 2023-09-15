import { useState } from 'react';
import { currentWindowClose, currentWindowTop } from '../app/runtime';
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
    return (
        <div className='head'>
            {children}
            <img className='wom-icon' src="" alt="" data-tauri-drag-region />
        </div>
    )
}

function OffspringHead({ children }: ReactDomWithChildren) {
    return (
        <>
            <div className="offspring-head">
                <div className='offspring-frame'></div>
                <div className='offspring-inner' data-tauri-drag-region>
                    <div></div>
                    <div className='offspring-inner-right'>
                        <InputCheckBox selectedClassName='to-ontop' noselectClassName='to-notop' onSelected={() => currentWindowTop(true)} noSelected={() => currentWindowTop(false)} />
                        <InputButton className='to-close' onClick={currentWindowClose} />
                    </div>
                </div>
            </div>
            <div className='offspring-placeholder'></div>
            <div className='head'>
                {children}
                <img className='offspring-icon' src="" alt="" data-tauri-drag-region />
            </div>
        </>
    )
}

function InputCheckBox({ selectedClassName, noselectClassName, onSelected, noSelected }: { selectedClassName: any, noselectClassName: any, onSelected: () => void, noSelected: () => void }) {
    const [selected, setSelected] = useState(false);
    if (selected) {
        return <div className={selectedClassName} onClick={() => { setSelected(false); noSelected(); }}></div>
    }
    return <div className={noselectClassName} onClick={() => { setSelected(true); onSelected(); }}></div>
}

function InputButton({ className, onClick }: { className: any, onClick: () => void }) {
    return <div className={className} onClick={onClick}></div>
}

export { Box, Body, Head, OffspringHead };