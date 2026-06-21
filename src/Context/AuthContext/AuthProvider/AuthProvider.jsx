import React from 'react';
import { Authcontext } from '../AuthContext';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../../FireBase/Firebase.config';

const AuthProvider = ({children}) => {

    const registerUser =(email,password)=> {
return createUserWithEmailAndPassword(auth,email,password)
    }
    const signInuser = (email,password)=>{
        return signInWithEmailAndPassword(auth,email,password)
    }

    const authinfo = {
registerUser,
signInuser
    }
    return (
        <Authcontext value={authinfo}>
            {children}
        </Authcontext>
    );
};

export default AuthProvider;