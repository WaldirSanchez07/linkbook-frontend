import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../_helpers/Session';

const ProtectedLA = ({ component: Component,email, ...rest }) => {
    const auth = isAuthenticated();
    return (
        <Route {...rest}
            render={() => !auth && email ?
                (
                    <Component email={email}/>
                ) :
                (
                    <Redirect to="/home" />
                )
            }
        />
    )
}

export default ProtectedLA;