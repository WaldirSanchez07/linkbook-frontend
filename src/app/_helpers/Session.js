import jwt from 'jsonwebtoken';

export const setSessionStorage = (key, value) => {
    localStorage.setItem(key, value);
};

export const getSessionStorage = (key) => {
    return localStorage.getItem(key);
};

export const removeSessionStorage = (key) => {
    localStorage.removeItem(key);
}; 

export const SignIn = (token, user) => {
    setSessionStorage('_t', token);
    setSessionStorage('_u', user.id);
    setSessionStorage('_n', user.name);
    setSessionStorage('_m', '0');
}

export const xLogout = () => {
    removeSessionStorage('_t');
    removeSessionStorage('_u');
    removeSessionStorage('_n');
    removeSessionStorage('_m');
}

export const isAuthenticated = () => {
    const token = getSessionStorage('_t');
    try {
        jwt.verify(token, process.env.REACT_APP_SECRET_KEY)
        return true;
    } catch (error) {
        return false;
    }
};

export const isAuthenticatedExternal = (token) => {
    try {
        jwt.verify(token, process.env.REACT_APP_SECRET_KEY)
        return true;
    } catch (error) {
        return false;
    }
};