import React, { useEffect, useState } from 'react';
import { Authcontext } from '../AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
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
    
    const Logout = ()=>{
        setLoading(true)
       return signOut(auth)
    }

    const updetedUserProfile = (profile)=>{
        return updateProfile(auth.cruntUser, profile)
    }

   useEffect(()=>{
    const unSuscraibe = onAuthStateChanged(auth,(cruntUser)=>{
        setUser(cruntUser)
    })
    return ()=>{
        unSuscraibe()
    }
   },[])

    const authinfo = {
registerUser,
signInuser,
siginWithGoogle,
user,
loading,
Logout,
updetedUserProfile




    }
    return (
        <Authcontext value={authinfo}>
            {children}
        </Authcontext>
    );
};

export default AuthProvider;