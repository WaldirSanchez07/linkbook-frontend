import { Button, FormControl, Input, InputLabel } from '@material-ui/core';
import React from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Headers, urlAPI, handleErrors } from '../../_helpers/Config';
import { AppContext } from '../../_helpers/Context';
import { IconPassword, TextError } from '../layouts/Elements';
import { NavbarProfile } from '../layouts/Nav';

const initialize = { name: '', email: '', password: '', password_confirm: '' };

const Register = () => {
    const [form, setForm] = React.useState(initialize);
    const [errors, setErrors] = React.useState(initialize);
    const [pass, setPass] = React.useState(false);
    const ctx = React.useContext(AppContext);
    const history = useHistory();
    const btn = document.getElementsByClassName('smt');

    //llenar campos del formulario
    const handleChange = (prop) => (event) => {
        setForm({ ...form, [prop]: event.target.value });
    };

    //mostrar el texto de la contraseña
    const fnShowPassword = () => { setPass(!pass); };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({ ...initialize });
        btn[0].classList.add('btn-loading');
        await handleEnviar();
    }

    const handleEnviar = async () => {
        try {
            const Body = JSON.stringify(form);
            const res = await fetch(urlAPI + '/auth/signup', { method: 'POST', headers: Headers, body: Body });
            if (!res.ok) {
                const error = await res.json();
                if (error.errors) {
                    const er = await handleErrors(error.errors);
                    setErrors(er);
                    btn[0].classList.remove('btn-loading');
                    return;
                } else { throw new Error("error!"); }
            }
            btn[0].classList.remove('btn-loading');
            ctx.fnEmail(form.email); // enviar email a VerifyEmail
            history.push("/verify");
        } catch (err) { }
    }

    return (
        <>
            <NavbarProfile />
            <section className="session-container">
                <form className="session-content" onSubmit={handleRegister}>
                    <div className="session-header">
                        <h2>Registrarse</h2>
                    </div>
                    <div className="session-body">
                        <FormControl className="Mui-input" error={errors.name ? true : false}>
                            <InputLabel htmlFor="name">Nombres</InputLabel>
                            <Input id="name" type="text" onChange={handleChange('name')} />
                            <TextError error={errors.name}/>
                        </FormControl>
                        <FormControl className="Mui-input" error={errors.email ? true : false}>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input id="email" type="email" onChange={handleChange('email')} />
                            <TextError error={errors.email}/>
                        </FormControl>
                        <FormControl className="Mui-input" error={errors.password ? true : false}>
                            <InputLabel htmlFor="password">Contraseña</InputLabel>
                            <Input id="password" 
                                type={pass ? 'text' : 'password'} 
                                onChange={handleChange('password')}
                                endAdornment={ <IconPassword show={pass} fnShowPassword={fnShowPassword} /> }
                            />
                            <TextError error={errors.password}/>
                        </FormControl>
                        <FormControl className="Mui-input" error={errors.password_confirm ? true : false}>
                            <InputLabel htmlFor="password_confirm">Confirmar contraseña</InputLabel>
                            <Input id="password_confirm" 
                                type={pass ? 'text' : 'password'} 
                                onChange={handleChange('password_confirm')}
                                endAdornment={ <IconPassword show={pass} fnShowPassword={fnShowPassword} /> }
                            />
                            <TextError error={errors.password_confirm}/>
                        </FormControl>
                    </div>
                    <div className="session-footer">
                        <Button type="submit" variant="contained" size="large" className="btn-Mui-sub smt">Register</Button>
                    </div>
                    <div className="session-text">
                        <span>¿Ya tienes una cuenta? <Link to="/login">Ingresa</Link></span>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Register;