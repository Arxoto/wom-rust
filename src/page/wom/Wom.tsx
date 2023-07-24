import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import constant from "../../constant";
import { Box, Head, Body } from "../Layout";
import './Wom.css'

export default function () {
    const [womInput, setWomInput] = useState(constant.wom_input_default);
    const [womTag, setWomTag] = useState(constant.wom_tag_default);
    const navigate = useNavigate();
    return (
        <Box>
            <Head>
                <div className='common-box activable-hide' onClick={() => navigate(constant.router_navigation)}>&gt;</div>
                <input className="common-box common-color round-box inputable" type="text" title="womIn" placeholder={constant.wom_input_placeholder} />
                <p className='common-box'>{womTag}</p>
            </Head>
            <Body>
                <p>aaaaaaaaaaaaaaaaaaaa</p>
                <p>aaaaaaaaaaaaaaaaaaaa</p>
                <p>aaaaaaaaaaaaaaaaaaaa</p>
                <p>aaaaaaaaaaaaaaaaaaaa</p>
                <p>aaaaaaaaaaaaaaaaaaaa</p>
                <h1>BBBBBBBBBBBBBBBBBB</h1>
                <h1>BBBBBBBBBBBBBBBBBB</h1>
                <h1>BBBBBBBBBBBBBBBBBB</h1>
                <h1>BBBBBBBBBBBBBBBBBB</h1>
            </Body>
        </Box>
    )
}