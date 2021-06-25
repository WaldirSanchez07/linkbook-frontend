export const urlAPI = process.env.REACT_APP_API || "http://localhost:5000/api";
export let Headers = { 'Content-Type': 'application/json', 'x-access-token': '' };

export function Sorting(data) {
    return data.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
}

export const handleErrors = (err) => {
    let Errors = { email: '', password: '' }
    Object.keys(err).forEach(key => {
        Errors[key] = err[key];
    });
    return Errors;
}