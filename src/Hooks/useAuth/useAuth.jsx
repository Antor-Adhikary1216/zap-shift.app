import { use } from 'react';
import { Authcontext } from '../../Context/AuthContext/AuthContext';

const useAuth = () => {
    const authinfo = use(Authcontext)

    
    return authinfo
};

export default useAuth;
