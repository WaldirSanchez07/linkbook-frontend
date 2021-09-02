import React from 'react'
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Helper from './pages/Helper';
import NotFound from './pages/NotFound';
import { VerifyEmail, ChangePassword, EmailChangePass, VerifiedEmail } from './pages/auth/VerifyEmail';
import { AppContext } from './_helpers/Context';
import { getSessionStorage, isAuthenticated } from './_helpers/Session';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ProtectedLogin from './router/ProtectedLogin';
import ProtectedPages from './router/ProtectedPages';
import ProtectedLA from './router/ProtectedLA';
import IconButton from '@material-ui/core/IconButton';
import { AppBackground } from './_helpers/Functions';
//import { Loading } from './pages/layouts/Elements';

const App = () => {
    const [auth, setAuth] = React.useState(false);
    const [mode, setMode] = React.useState(false); //for mode light or dark
    const [email, setEmail] = React.useState('');
    //const [loading, setLoading] = React.useState(true);
    const body = document.getElementsByTagName("body"); //etq for mode
    
    const fnMode = () => {
        setMode(!mode);
        AppBackground(body, mode);
    }

    //establecé modo claro, si m = 1 establece modo oscuro 
    React.useEffect(() => {
        const m = getSessionStorage('_m');
        if (m === '1') {
            body[0].classList.replace("light", "dark");
            setMode(true);
        }  
        //setTimeout(() => {setLoading(false);}, 3000);
    }, [body]);

    React.useEffect(() => { handleAuth(); }, []);

    //define si esta autentificado => auth = true
    const handleAuth = () => { setAuth(isAuthenticated()); }

    //establecemos email para ser usado en el componente VerifyEmail
    const fnEmail = (correo) => { setEmail(correo); };

    return (
        <AppContext.Provider value={{ handleAuth, fnEmail }}>
            <Router>
                <Switch>
                    <ProtectedLogin exact path='/login' component={Login} handleAuth={handleAuth} />
                    <ProtectedLogin exact path='/register' component={Register} />
                    <ProtectedLA exact path='/verify' component={VerifyEmail} email={email} />
                    <ProtectedLogin exact path='/verified/:token' component={VerifiedEmail} />
                    <ProtectedLogin exact path='/change-password' component={EmailChangePass} />
                    <ProtectedLogin exact path='/change-password/:token' component={ChangePassword} />
                    {!auth && <ProtectedLogin exact path='/' component={Welcome}/>}
                    <ProtectedPages exact path='/' component={Home} />
                    <Route exact path='/helper' component={Helper} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
            {auth && <ModeView fnMode={fnMode} mode={mode} />}
        </AppContext.Provider>
    )
}

const ModeView = ({ fnMode, mode }) => {
    return (
        <div className="flotating-buttons">
            <IconButton aria-label="delete" className="btn-mod" onClick={fnMode}>
                <i className="material-icons-round">{mode ? 'light_mode' : 'dark_mode'}</i>
            </IconButton>
        </div>
    )
}

export default App;
