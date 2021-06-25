import React from 'react'
import { NavbarProfile } from './layouts/Nav';
import img404 from '../../assets/image/404.svg';
import { Button } from '@material-ui/core';

const NotFound = () => {
    return (
        <div>
            <NavbarProfile />
            <div className="page404">
                <img src={img404} alt="linkbook-notfound" />
                <h2>404</h2>
                <h3>Página no encontrada</h3>
                <Button variant="contained" size="large" className="btn-Mui-sub" href="/">
                <i className="material-icons">arrow_back</i>
                    Ir a Inicio
                </Button>
            </div>
        </div>
    )
}

export default NotFound