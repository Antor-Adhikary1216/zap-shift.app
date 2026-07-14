import useAuth from '../Hooks/useAuth/useAuth';
import { Navigate, useLocation } from 'react-router';
import FloatingLoader from '../Components/LoadingIndicator/FloatingLoader';

const PrivetRoute = ({children}) => {

    const {user,loading}=useAuth()
    const location = useLocation()

    if(loading){
        return <><div className="min-h-screen bg-[#F6F8F8]" /><FloatingLoader message="Preparing your account..." /></>
    }
    if(!user){
        return <Navigate to='/login' state={{ from: location.pathname }} replace />
       

    }
    const usesPassword = user.providerData?.some((provider) => provider.providerId === 'password')
    if(usesPassword && !user.emailVerified){
        return <Navigate to='/login' state={{ from: location.pathname }} replace />
    }
    return children
};

export default PrivetRoute;
