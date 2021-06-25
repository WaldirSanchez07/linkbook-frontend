import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../_helpers/Session';

const ProtectedLogin = ({ component: Component, ...rest }) => {
    const auth = isAuthenticated();
    return (
        <Route {...rest}
            render={() => !auth ?
                (
                    <Component />
                ) :
                (
                    <Redirect to="/" />
                )
            }
        />
    )
}

export default ProtectedLogin;