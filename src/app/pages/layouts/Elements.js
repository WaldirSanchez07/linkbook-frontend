import { InputAdornment, IconButton, FormHelperText, CircularProgress } from "@material-ui/core";
import imgWelcome from '../../../assets/image/welcome.svg';

export const IconPassword = ({ show, fnShowPassword }) => {
    return (
        <InputAdornment position="end">
            <IconButton aria-label="toggle password visibility" size="small" onClick={(e) => fnShowPassword()}>
                <i className="material-icons">{show ? 'visibility' : 'visibility_off'}</i>
            </IconButton>
        </InputAdornment>
    )
}

export const TextError = ({ error }) => {
    if(error) return <FormHelperText id="name-error">{error}</FormHelperText>
    return ""
}

export const SpinnerHome = ({loadingCa}) => {
    if(loadingCa === true) return <CircularProgress className="spinner" />
    return "";
}

export const HomeBanner = () => {
    return(
        <div className="bannerHome">
            <img src={imgWelcome} alt="linkbook-img-welcome" />
        </div>
    )
}