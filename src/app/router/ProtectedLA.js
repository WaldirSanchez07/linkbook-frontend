import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../_helpers/Session';

const ProtectedLA = ({ component: Component,user, ...rest }) => {
    const auth = isAuthenticated();
    return (
        <Route {...rest}
            render={() => !auth && user.email ?
                (
                    <Component user={user}/>
                ) :
                (
                    <Redirect to="/home" />
                )
            }
        />
    )
}

export default ProtectedLA;