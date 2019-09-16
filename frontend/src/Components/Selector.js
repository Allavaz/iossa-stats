import React from 'react';

export default function Selector(props) {
    return (
        <div className='torSelect'>
            <select id='selector' defaultValue='t3' onChange={props.prop2}>
                <option value='total'>Totales</option>
                <option value='t3'>Temporada 3</option>
                <option value='t2'>Temporada 2</option>
            </select>
            <div className='total' style={{display: props.prop3 === 'total' ? 'block' : 'none'}}>
                <div className='botonera'>
                    <button className='boton' onClick={() => props.prop1('all')}>Totales</button>
                    <button className='boton' onClick={() => props.prop1('d1')}>Liga D1</button>
                    <button className='boton' onClick={() => props.prop1('d2')}>Liga D2</button>
                    <button className='boton' onClick={() => props.prop1('master')}>Copa Master</button>
                    <button className='boton' onClick={() => props.prop1('maradei')}>Copa Maradei</button>
                    <button className='boton' onClick={() => props.prop1('recopamaster')}>Recopa Master</button>
                    <button className='boton' onClick={() => props.prop1('supercopamaster')}>Supercopa Master</button>
                </div>
            </div>
            <div className='t3' style={{display: props.prop3 === 't3' ? 'block' : 'none'}}>
                <div className='botonera'>
                    <button className='boton' onClick={() => props.prop1('t3')}>Totales</button>
                    <button className='boton' onClick={() => props.prop1('d1t3')}>Liga D1</button>
                    <button className='boton' onClick={() => props.prop1('d2t3')}>Liga D2</button>
                    <button className='boton' onClick={() => props.prop1('mastert3')}>Copa Master</button>
                    <button className='boton' onClick={() => props.prop1('maradeit3')}>Copa Maradei</button>
                    <button className='boton' onClick={() => props.prop1('recopamastert3')}>Recopa Master</button>
                    <button className='boton' onClick={() => props.prop1('supercopamastert3')}>Supercopa Master</button>
                </div>
            </div>
            <div className='t2' style={{display: props.prop3 === 't2' ? 'block' : 'none'}}>
                <div className='botonera'>
                    <button className='boton' onClick={() => props.prop1('t2')}>Totales</button>
                    <button className='boton' onClick={() => props.prop1('d1t2')}>Liga D1</button>
                    <button className='boton' onClick={() => props.prop1('d2t1')}>Liga D2</button>
                    <button className='boton' onClick={() => props.prop1('master2019')}>Copa Master</button>
                    <button className='boton' onClick={() => props.prop1('recopamaster2019')}>Recopa Master</button>
                </div>
            </div>
        </div>
    );
}
