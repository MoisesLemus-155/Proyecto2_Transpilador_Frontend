import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './index.css'

export const PensumNavbar = ({ onFileClick }) => {
    const [isResponsive, setIsResponsive] = useState(false);

    const toggleNav = () => {
        setIsResponsive(!isResponsive);
    };
    return (
        <div className={`topnav${isResponsive ? " responsive" : ""}`} id="myTopnav">
            <ul className="nav nav-pills">
                <a className="a-style active">Pensum USAC</a>
                <a className='a-style' href='/'>Home</a>
                <Link to="/Reporte" className="a-style">Reporte Error</Link>
                <a className='a-style' href="/" onClick={(e) => {
                    e.preventDefault();
                    onFileClick();
                }}>Archivos</a>
                <a className='a-style' href="/Manuales">Manuales</a>
                <a className="icon" onClick={toggleNav}>
                    <i className="fa fa-bars icono" />
                </a>
            </ul>
        </div>
    )
}
