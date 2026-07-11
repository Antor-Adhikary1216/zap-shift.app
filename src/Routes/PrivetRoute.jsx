import useAuth from '../Hooks/useAuth/useAuth';
import { Navigate, useLocation } from 'react-router';

const PrivetRoute = ({children}) => {

    const {user,loading}=useAuth()
    const location = useLocation()

    if(loading){
        return <div className="flex min-h-screen items-center justify-center" role="status">
            <span className="loading loading-spinner loading-lg" aria-label="Checking authentication"></span>
        </div>
    }
    if(!user){
        return <Navigate to='/login' state={{ from: location.pathname }} replace />
       

    }
    return children
};

export default PrivetRoute;
