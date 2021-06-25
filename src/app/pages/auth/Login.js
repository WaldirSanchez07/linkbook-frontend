import React, {useState, useEffect, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { AppContext } from '../../_helpers/Context';
import { urlAPI, Headers, handleErrors } from '../../_helpers/Config'
import { SignIn } from '../../_helpers/Session';
import { Button, FormControl, FormHelperText, Input, InputLabel } from '@material-ui/core';
import { NavbarProfile } from '../layouts/Nav';
import { IconPassword } from '../layouts/Elements';

const initialize = { email: '', password: '' };

const Login = () => {
    const [form, setForm] = useState(initialize);
    const [errors, setErrors] = useState(initialize);
    const [pass, setPass] = useState(false);
    const ctx = useContext(AppContext);
    const history = useHistory();
    const btn = document.getElementsByClassName('smt'); //btn loading

    useEffect(() => { ctx.handleAuth(); }, [ctx]);

    const handleChange = (prop) => (event) => {
        setForm({ ...form, [prop]: event.target.value });
    };

    const fnShowPassword = () => {
        setPass(!pass);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({ ...initialize });
        btn[0].classList.add('btn-loading');
        await handleEnviar();
    }

    const handleEnviar = async () => {
        try {
            const Body = JSON.stringify(form);
            const res = await fetch(urlAPI + '/auth/signin', { method: 'POST', headers: Headers, body: Body });
            if (res.status === 401) {
                ctx.fnEmail(form.email); //enviar email a VerifyEmail
                history.push("/verify");
            }
            if (!res.ok) {
                const error = await res.json();
                if (error.errors) {
                    const er = await handleErrors(error.errors);
                    setErrors(er);
                    btn[0].classList.remove('btn-loading');
                    return;
                } else { throw new Error("error!"); }
            }
            const data = await res.json();
            SignIn(data.token, data.user);
            btn[0].classList.remove('btn-loading');
            history.push("/");
            ctx.handleAuth();
        } catch (err) { }
    }

    return (
        <>
            <NavbarProfile />
            <section className="session-container">
                <form className="session-content" onSubmit={handleLogin}>
                    <div className="session-header">
                        <h2>Iniciar sesión</h2>
                    </div>
                    <div className="session-body">
                        <FormControl className="Mui-input" error={errors.email ? true : false}>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input id="email" type="email" onChange={handleChange('email')} />
                            {errors.email && <FormHelperText id="name-error">{errors.email}</FormHelperText>}
                        </FormControl>
                        <FormControl className="Mui-input" error={errors.password ? true : false}>
                            <InputLabel htmlFor="password">Contraseña</InputLabel>
                            <Input 
                                id="password" 
                                type={pass ? 'text' : 'password'} 
                                onChange={handleChange('password')}
                                endAdornment={ <IconPassword show={pass} fnShowPassword={fnShowPassword}/> }
                            />
                            {errors.password && <FormHelperText id="name-error">{errors.password}</FormHelperText>}
                        </FormControl>
                        <div className="container-link-pass">
                            <Link to="/change-password">¿Olvidaste tu contraseña?</Link>
                        </div>
                    </div>
                    <div className="session-footer">
                        <Button type="submit" variant="contained" size="large" className="btn-Mui-sub smt">Ingresar</Button>
                    </div>
                    <div className="session-text">
                        <span>¿No tienes una cuenta? <Link to="/register">Regístrate</Link></span>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Login;
