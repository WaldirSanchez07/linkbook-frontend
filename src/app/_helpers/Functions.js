import { setSessionStorage } from "./Session";

/*Establecer el fondo de la app*/
export const AppBackground = (body, mode) => {
    if(!mode){
        setSessionStorage('_m', '1'); //modo oscuro
        body[0].classList.replace("light", "dark"); //modo oscuro
    }else{
        setSessionStorage('_m', '0'); //modo claro
        body[0].classList.replace("dark", "light"); //modo claro
    }
}