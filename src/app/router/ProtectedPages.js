import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../_helpers/Session';

const ProtectedPages = ({ component: Component, ...rest }) => {
    const auth = isAuthenticated();
    return (
        <Route {...rest}
            render={(props) => auth ?
                (
                    <Component {...rest} {...props} />
                ) :
                (
                    <Redirect to="/" />
                )
            }
        />
    )
}

export default ProtectedPages;