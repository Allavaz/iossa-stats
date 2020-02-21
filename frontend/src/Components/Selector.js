import React from 'react';

export default function Selector(props) {
    return (
        <div className='torSelect'>
            <select id='selector' defaultValue='t4' onChange={props.prop2}>
                <option value='total'>Totales</option>
                <option value='t5'>Temporada 5</option>
                <option value='t4'>Temporada 4</option>
                <option value='t3'>Temporada 3</option>
                <option value='t2'>Temporada 2</option>
                <option value='t1'>Temporada 1</option>
                <option value='t0'>Temporada 0</option>
            </select>
            <div className='total' style={{display: props.prop3 === 'total' ? 'block' : 'none'}}>
                <div className='botonera'>
                    <button className='boton' onClick={() => props.prop1('all')}>Totales</button>
                    <button className='boton' onClick={() => props.prop1('d1')}>Liga D1</button>
                    <button className='boton' onClick={() => props.prop1('d2')}>Liga D2</button>
                    <button className='boton' onClick={() => props.prop1('master')}>Copa Master</button>
                    <button className='boton' onClick={() => props.prop1('maradei')}>Copa Maradei</button>
                    <button className='boton' onClick={() => props.prop1('recopamaster')}>Recopa Master</button>
                    <button className='boton' onClick={() => props.prop1('recopamaradei')}>Recopa Maradei</button>
                    <button className='boton' onClick={() => props.prop1('supercopamaster')}>Supercopa Master</button>
                    <button className='boton' onClick={() => props.prop1('copaamerica')}>Copa America</button>
                    <button className='boton' onClick={() => props.prop1('copadelsur')}>Copa del Sur</button>
                    <button className='boton' onClick={() => props.prop1('cg')}>Copa Gubero</button>
                    <button className='boton' onClick={() => props.prop1('lm')}>Liga Master</button>
                    <button className='boton' onClick={() => props.prop1('ddh')}>Division de Honor</button>
                </div>
            </div>
            <div className='t5' style={{display: props.prop3 === 't5' ? 'block' : 'none'}}>
                <div className='botonera'>
                    <button className='boton' onClick={() => props.prop1('t5')}>Totales</button>
                    <button className='boton' onClick={() => props.prop1('lmt5')}>Liga Master</button>
                    <button className='boton' onClick={() => props.prop1('ddht5')}>Division de Honor</button>
                    <button className='boton' onClick={() => props.prop1('mastert5')}>Copa Master</button>
                    <button className='boton' onClick={() => props.prop1('maradeit5')}>Copa Maradei</button>
                    <button className='boton' onClick={() => props.prop1('recopamastert5')}>Recopa Master</button>
                    <button className='boton' onClick={() => props.prop1('recopamaradeit5')}>Recopa Maradei</button>
                    <button className='boton' onClick={() => props.prop1('supercopamastert5')}>Supercopa Master</button>
                </div>
            </div>
            <div className='t4' style={{display: props.prop3 === 't4' ? 'block' : 'none'}}>
                <div className='botonera'>
                    <button className='boton' onClick={() => props.prop1('t4')}>Totales</button>
                    <button className='boton' onClick={() => props.prop1('d1t4')}>Liga D1</button>
                    <button className='boton' onClick={() => props.prop1('d2t4')}>Liga D2</button>
                    <button className='boton' onClick={() => props.prop1('cgt4')}>Copa Gubero</button>
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
                    <button className='boton' onClick={() => props.prop1('copaamericat3')}>Copa America</button>
                    <button className='boton' onClick={() => props.prop1('copadelsurt3')}>Copa del Sur</button>
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
            <div className='t1' style={{display: props.prop3 === 't1' ? 'block' : 'none'}}>
                <div className='botonera'>
                    <button className='boton' onClick={() => props.prop1('t1')}>Totales</button>
                    <button className='boton' onClick={() => props.prop1('d1t1')}>Liga D1</button>
                    <button className='boton' onClick={() => props.prop1('maradeit1')}>Copa Maradei</button>
                </div>
            </div>
            <div className='t0' style={{display: props.prop3 === 't0' ? 'block' : 'none'}}>
                <div className='botonera'>
                    <button className='boton' onClick={() => props.prop1('t0')}>Totales</button>
                    <button className='boton' onClick={() => props.prop1('lmt0')}>Liga Master</button>
                    <button className='boton' onClick={() => props.prop1('ddht0')}>Division de Honor</button>
                    <button className='boton' onClick={() => props.prop1('recopamastert0')}>Recopa Master</button>
                </div>
            </div>
        </div>
    );
}
