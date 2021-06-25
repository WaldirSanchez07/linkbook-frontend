import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Headers, urlAPI, handleErrors } from '../../_helpers/Config';
import {
    Button, Typography, Card, CardContent, FormControl, InputLabel, OutlinedInput, FormHelperText,
    InputAdornment, IconButton, Collapse, makeStyles
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { NavbarProfile } from '../layouts/Nav';
import { isAuthenticatedExternal } from '../../_helpers/Session';

const useStyles = makeStyles({
    title: {
        marginBottom: 16,
    },
    span: {
        fontWeight: 600,
    },
    mt16: {
        marginTop: 16,
        textTransform: 'none'
    },
    inputOutlined: {
        margin: '8px 0 !important'
    }
});

export const VerifyEmail = ({ email }) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const alOpen = () => { setOpen(!open); }

    const handleVerify = async (email) => {
        const Body = JSON.stringify({ email: email });
        try {
            await fetch(urlAPI + '/auth/email/verify', { method: 'POST', headers: Headers, body: Body });
        } catch (error) { }
    }

    useEffect(() => { handleVerify(email); }, [email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleVerify();
        alOpen();
    }

    return (
        <>
            <NavbarProfile />
            <div className="wrapperCard">
                <Card className="cardWidth" variant="outlined">
                    <CardContent>
                        <Typography variant="h6" component="h2" className={classes.title}>
                            Verificar dirección de correo
                        </Typography>
                        <Typography variant="body2" component="p">
                            Te hemos enviado un correo de verificación a <span className={classes.span}>{email}</span>, revisa tu bandeja de recibidos o en la sección spam. <br />
                            Sino te llega ningún correo en 2 minutos, presiona en volver a enviar.
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Button variant="contained" className={"btn-profile smt " + classes.mt16} type="submit">Volver enviar</Button>
                        </form>
                        {open && <MyAlert open={open} alOpen={alOpen} message="Te hemos enviado un correo." />}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export const VerifiedEmail = () => {
    const classes = useStyles();
    const [fail, setFail] = useState();
    const { token } = useParams();

    const verified = async (token) => {
        if (isAuthenticatedExternal(token)) {
            try {
                const res = await fetch(urlAPI + `/auth/verify/${token}`, { method: 'PATCH', headers: Headers });
                if (!res.ok) setFail(true);
                setFail(false);
            } catch (error) { }
        } else {
            setFail(false);
        }
    }

    useEffect(() => { verified(token); }, [token]);

    return (
        <>
            <NavbarProfile />
            <div className="wrapperCard">
                <Card className="cardWidth" variant="outlined">
                    <CardContent>
                        {
                            fail &&
                                fail === true ? <Alert severity="error">El token ha expirado!</Alert>
                                : <Alert severity="success">Email verificado correctamente!</Alert>
                        }

                        {fail &&
                            fail === true ?
                            <Button variant="contained" href="/" className={"btn-profile " + classes.mt16}>
                                Ir a inicio
                            </Button>
                            : <Button variant="contained" href="/login" className={"btn-profile " + classes.mt16}>
                                Iniciar sesión
                            </Button>
                        }
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export const EmailChangePass = () => {
    const classes = useStyles();
    const [errors, setErrors] = React.useState({ email: '' });
    const [data, setData] = React.useState({ email: '' });
    const [open, setOpen] = React.useState(false);
    const btn = document.getElementsByClassName('smt');

    const handleEmail = async (e) => {
        e.preventDefault();
        errors.email = '';
        btn[0].classList.add('btn-loading');
        await handleSubmit();
        btn[0].classList.remove('btn-loading');
    }

    const handleSubmit = async () => {
        try {
            const Body = JSON.stringify({ email: data.email });
            const res = await fetch(urlAPI + '/auth/email/password', { method: 'POST', headers: Headers, body: Body });
            if (!res.ok) {
                const error = await res.json();
                if (error.errors) {
                    const er = await handleErrors(error.errors);
                    setErrors(er);
                    return;
                } else { throw new Error("error!"); }
            }
            data.email = '';
            setOpen(true);
        } catch (error) {
        }
    }

    const handleChange = (prop) => (event) => {
        setData({ ...data, [prop]: event.target.value });
    };

    const alOpen = () => { setOpen(false); }

    return (
        <>
            <NavbarProfile />
            <div className="wrapperCard">
                <Card className="cardWidth" variant="outlined">
                    <CardContent>
                        <Typography variant="body2" component="p" className={classes.title}>
                            Te enviaremos un correo para que puedas cambiar tu contraseña.
                        </Typography>
                        <form onSubmit={handleEmail}>
                            <FormControl className={"Mui-input-outlined " + classes.inputOutlined} variant="outlined"
                                error={errors.email ? true : false}>
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <OutlinedInput id="email" type="text" labelWidth={70}
                                    value={data.email}
                                    onChange={handleChange('email')}
                                />
                                {errors.email && <FormHelperText id="name-error">{errors.email}</FormHelperText>}
                            </FormControl>
                            <Button variant="contained" className={"btn-profile smt " + classes.mt16} type="submit">Enviar</Button>
                            {open && <MyAlert open={open} alOpen={alOpen} message="Te hemos enviado un correo." />}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export const ChangePassword = () => {
    const classes = useStyles();
    const [errors, setErrors] = React.useState({ password: '' });
    const [data, setData] = React.useState({ password: '' });
    const [pass, setPass] = React.useState({ showPass1: false, showPass2: false });
    const [open, setOpen] = React.useState(false);
    const [fail, setFail] = React.useState(false);
    const btn = document.getElementsByClassName('smt');
    const { token } = useParams();

    React.useEffect(() => {
        if(!isAuthenticatedExternal(token)) setFail(true);
    },[token])

    const handleClickShowPassword = (prop) => () => {
        setPass({ ...pass, [prop]: !pass[prop] });
    };

    const handleChange = (prop) => (event) => {
        setData({ ...data, [prop]: event.target.value });
    };

    const handleForm = async (e) => {
        e.preventDefault();
        setFail(false);
        errors.password = '';
        btn[0].classList.add('btn-loading');
        await handleSubmit();
        btn[0].classList.remove('btn-loading');
    }

    const handleSubmit = async () => {
        try {
            const Body = JSON.stringify(data);
            const res = await fetch(urlAPI + `/auth/update/password/${token}`, { method: 'PATCH', headers: Headers, body: Body });
            if (res.status === 404) {
                setFail(true);
                return;
            }

            if (!res.ok) {
                const error = await res.json();
                if (error.errors) {
                    const er = await handleErrors(error.errors);
                    setErrors(er);
                    return;
                } else { throw new Error("error!"); }
            }
            data.password = '';
            setOpen(true);
        } catch (error) { }
    }

    const alOpen = () => { setOpen(false); }

    return (
        <>
            <NavbarProfile />
            <div className="wrapperCard">
                <Card className="cardWidth" variant="outlined">
                    <CardContent>
                        <Typography variant="h6" component="h2" className={classes.title}>
                            Cambiar contraseña
                        </Typography>
                        <form onSubmit={handleForm}>
                            <FormControl className={"Mui-input-outlined " + classes.inputOutlined} variant="outlined" error={errors.password ? true : false}>
                                <InputLabel htmlFor="password">Nueva contraseña</InputLabel>
                                <OutlinedInput id="password" type={pass.showPass1 ? 'text' : 'password'}
                                    onChange={handleChange('password')}
                                    value={data.password}
                                    labelWidth={140}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" size="small"
                                                onClick={handleClickShowPassword('showPass1')}
                                            >
                                                <i className="material-icons">{pass.showPass1 ? 'visibility' : 'visibility_off'}</i>
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                {errors.password && <FormHelperText id="name-error">{errors.password}</FormHelperText>}
                            </FormControl>
                            <Button variant="contained" className={"btn-profile smt " + classes.mt16} type="submit">Cambiar</Button>
                            {open && <MyAlert open={open} alOpen={alOpen} message="Se ha cambiado correctamente." />}
                            {fail && <Alert severity="error" className={classes.mt16}>El token ha expirado!</Alert>}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

const MyAlert = ({ open, alOpen, message }) => {

    React.useEffect(() => { setTimeout(() => { alOpen() }, 4000); }, [alOpen]);

    return (
        <Collapse in={open} className="mt16">
            <Alert
                action={
                    <IconButton aria-label="close" color="inherit" size="small" onClick={alOpen}>
                        <i className="material-icons">close</i>
                    </IconButton>
                }
            >
                {message}
            </Alert>
        </Collapse>
    )
}