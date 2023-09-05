import React from 'react';
import { useState } from 'react';
import { RgbaColorPicker } from 'react-colorful';
import axios from 'axios'

function ColorPicking(props) {
    const [color, setColor] = useState({ r: 200, g: 150, b: 35, a: 1 });

    const handleChange = () => {
        axios.post('http://localhost:5000/change-color');
    }

    const handleSwitch = () => {
        axios.post('http://localhost:5000/turn-on-led', color);
    }

    return (
        <div>
            <RgbaColorPicker color={color} onChange={setColor} />
            <div className="value">{JSON.stringify(color)}</div>
            <button className='btn btn-success' onClick={handleChange}>Change Color</button>
            <hr />
            <button className='btn btn-success' onClick={handleSwitch}>Switch</button>
        </div>
    );
}

export default ColorPicking;