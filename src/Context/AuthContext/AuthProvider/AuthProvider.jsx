import React, { useEffect, useState } from 'react';
import { Authcontext } from '../AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../../../../FireBase/Firebase.config';

const AuthProvider = ({children}) => {
const [user , setUser] =useState()
const [loading,setLoading ] = useState(true)

const googleProvider = new GoogleAuthProvider()
    const registerUser =(email,password)=> {
        setLoading(true)
return createUserWithEmailAndPassword(auth,email,password)
    }
    const signInuser = (email,password)=>{
        setLoading(true)
        return signInWithEmailAndPassword(auth,email,password)
    }
    const  siginWithGoogle =()=>{
        setLoading(true)
        return signInWithPopup(auth,googleProvider)
    }

   useEffect(()=>{
    
   },[])

    const authinfo = {
registerUser,
signInuser,
siginWithGoogle,
user,
loading

    }
    return (
        <Authcontext value={authinfo}>
            {children}
        </Authcontext>
    );
};

export default AuthProvider;