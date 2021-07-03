import React from 'react';
import { Headers, urlAPI } from '../_helpers/Config';
import {
    FormControl, InputLabel, OutlinedInput, FormHelperText, Avatar,
    Button, InputAdornment, IconButton, Card, CardContent, Typography, CardActions, makeStyles
} from '@material-ui/core';
import { getSessionStorage } from '../_helpers/Session';
import { deepPurple } from '@material-ui/core/colors';

const initialize = { email: '', name: '', password: '', password_new: '' };

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        marginBottom: '.5rem'
    },
    pos: {
        marginBottom: 12,
    },
    large: {
        width: '128px !important',
        height: '128px !important',
        margin: '0 auto',
        fontSize: '3rem !important',
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
    },
    textCenter: {
        textAlign: 'center'
    },
    inputOutlined: {
        margin: '8px 0 !important'
    }
}));

const Profile = () => {
    const classes = useStyles();
    const [data, setData] = React.useState(initialize);
    const [errors, setErrors] = React.useState(initialize);
    const [pass, setPass] = React.useState({ showPass1: false, showPass2: false });
    const btn = document.getElementsByClassName('smt');
    const name = getSessionStorage('_n');

    const getUser = async() => {
        const user = getSessionStorage('_u');
        try {
            const res = await fetch(urlAPI + `/auth/user/${user}`, { method: 'GET', headers: Headers });
            const datos = await res.json();
            setData(datos);
        } catch (error) { console.log(error);}
    }

    React.useEffect(() => {
        getUser();
    }, []);

    const handleClickShowPassword = (prop) => () => {
        setPass({ ...pass, [prop]: !pass[prop] });
    };

    const handleChange = (prop) => (event) => {
        setData({ ...data, [prop]: event.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setErrors({ ...initialize });
        btn[0].classList.add('btn-loading');
        await updateUsuario();
        btn[0].classList.remove('btn-loading');
    }

    const updateUsuario = async() => {
        try {
            const Body = JSON.stringify(data);
            const res = await fetch(urlAPI + '/auth/update/user', { method: 'PATCH', headers: Headers, body: Body });
            if (!res.ok) {
                const error = await res.json();
                if (error.errors) {
                    const er = await handleErrors(error.errors);
                    setErrors(er);
                    return;
                } else { throw new Error("error!"); }
            }
            alert('Actualizado!');
        } catch (err) {
        }
    }

    const handleErrors = (err) => {
        let Errors = { name: '', password: '', password_new: '' }
        Object.keys(err).forEach(key => {
            Errors[key] = err[key];
        });
        return Errors;
    }

    const events = {
        errors, data, handleChange, pass, handleClickShowPassword
    }

    return (
        <>
        <section className="profileSection">
            <div className="profileContainer">
                <div className="profile1">
                    <Card className="cardContainer">
                        <CardContent>
                            <Avatar alt="Remy Sharp" className={classes.large}>{name ? name.charAt() : <i className="material-icons">person</i>}</Avatar>
                        </CardContent>
                        <CardContent>
                            <Typography variant="body2" component="p" className={classes.textCenter}>
                                {data.email}
                            </Typography>
                        </CardContent>
                    </Card>
                </div>
                <div className="profile2">
                    <Card className="cardContainer">
                        <CardContent>
                            <Typography variant="h6" component="h2" className={classes.title}>
                                Cambiar datos
                            </Typography>
                            <form onSubmit={handleUpdate}>
                            <PerfilForm {...events}/>
                            <CardActions>
                            <Button variant="contained" size="medium" className="btn-profile smt" type="submit">Actualizar</Button>
                            </CardActions>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
        </>
    )
}

const PerfilForm = ({handleClickShowPassword, errors, data, handleChange, pass}) => {
    const classes = useStyles();
    return (
        <>
            <FormControl className={"Mui-input-outlined "+ classes.inputOutlined} variant="outlined" error={errors.name ? true : false}>
                <InputLabel htmlFor="name">Nombre</InputLabel>
                <OutlinedInput id="name" type="text" labelWidth={70}
                    value={data.name}
                    onChange={handleChange('name')}
                />
                {errors.name && <FormHelperText id="name-error">{errors.name}</FormHelperText>}
            </FormControl>
            <FormControl className={"Mui-input-outlined "+ classes.inputOutlined} variant="outlined" error={errors.password ? true : false}>
                <InputLabel htmlFor="password">Contraseña actual</InputLabel>
                <OutlinedInput id="password" type={pass.showPass1 ? 'text' : 'password'}
                    onChange={handleChange('password')}
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
            <FormControl className={"Mui-input-outlined "+ classes.inputOutlined} variant="outlined" 
            error={errors.password_new ? true : false}>
                <InputLabel htmlFor="password_new">Nueva contraseña</InputLabel>
                <OutlinedInput id="password_new" type={pass.showPass2 ? 'text' : 'password'}
                    onChange={handleChange('password_new')}
                    labelWidth={140}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton aria-label="toggle password visibility" size="small"
                                onClick={handleClickShowPassword('showPass2')}
                            >
                                <i className="material-icons">{pass.showPass2 ? 'visibility' : 'visibility_off'}</i>
                            </IconButton>
                        </InputAdornment>
                    }
                />
                {errors.password_new && <FormHelperText id="name-error">{errors.password_new}</FormHelperText>}
            </FormControl>
        </>
    )
}

export default Profile;