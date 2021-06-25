import React from 'react';
import imgWelcome from './_images/welcome.svg';
import { Link } from 'react-router-dom';

const Welcome = () => {
    return (
        <>
        <div className="landing-container">
            <header className="header-container">
                <nav className="nav-container">
                    <div className="logo-container"></div>
                    <div className="navegation-container">
                        <Link to="/login" className="btn-round btn-login">Iniciar sesión</Link>
                        <Link to="/register" className="btn-round btn-register">Registrar</Link>
                    </div>
                </nav>
            </header>
            <section className="landing-content">
                <div className="landing-text">
                    <h1>LinkBook</h1>
                    <h2>Tus enlaces siempre disponibles.</h2>
                    <h3>Personalizable, privado y rápido.</h3>
                    <p>El mejor sitio web para guardar y administrar <br /> tus enlaces a tus paginas favoritas.</p>
                    <Link to="/login" className="btn-round btn-start">
                        <span>Empezar</span><i className="material-icons">arrow_forward</i>
                    </Link>
                </div>
                <div className="landing-image">
                    <img src={imgWelcome} alt="landing-page" />
                </div>
            </section>
            <footer><span>Copyright © {new Date().getFullYear()}. Todos los derechos reservados</span></footer>
        </div>
        </>
    )
}

export default Welcome;
