import { useEffect, useState } from 'react';
import { Authcontext } from '../AuthContext';
import { createUserWithEmailAndPassword, EmailAuthProvider, GoogleAuthProvider, linkWithCredential, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../../../FireBase/Firebase.config';

const apiUrl = import.meta.env.VITE_API_URL || 'https://zap-shift-server-peach-nine.vercel.app'

const saveUserToDatabase = async (firebaseUser, action = 'login') => {
    const response = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: firebaseUser.email,
            name: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            firebaseUid: firebaseUser.uid,
            provider: firebaseUser.providerData?.[0]?.providerId || 'password',
            action,
        }),
    })

    const responseText = await response.text()
    let data = {}

    if (responseText) {
        try {
            data = JSON.parse(responseText)
        } catch {
            throw new Error('The user service returned an invalid response. Please try again shortly.')
        }
    }

    if (!response.ok) throw new Error(data.message || 'Unable to save the user account.')
    return data
}

const ensureUserDoesNotExist = async (email) => {
    const response = await fetch(`${apiUrl}/users/${encodeURIComponent(email)}/role`)

    if (response.ok) {
        throw new Error('An account already exists with this email address. Please log in instead.')
    }

    if (response.status !== 404) {
        throw new Error('Unable to verify this email address. Please try again shortly.')
    }
}

const AuthProvider = ({children}) => {
const [user , setUser] =useState()
const [loading,setLoading ] = useState(true)

const googleProvider = new GoogleAuthProvider()
    const registerUser =(email,password)=> {
        setLoading(true)
        return createUserWithEmailAndPassword(auth,email,password).catch((error) => {
            setLoading(false)
            throw error
        })
    }
    const signInuser = async (email,password)=>{
        setLoading(true)
        try {
            const result = await signInWithEmailAndPassword(auth,email,password)
            saveUserToDatabase(result.user, 'login').catch((error) => {
                console.error('Unable to synchronize the logged-in user:', error)
            })
            return result
        } catch (error) {
            setLoading(false)
            throw error
        }
    }
    const siginWithGoogle = async ()=>{
        setLoading(true)
        try {
            const result = await signInWithPopup(auth,googleProvider)
            saveUserToDatabase(result.user, 'login').catch((error) => {
                console.error('Unable to synchronize the Google user:', error)
            })
            return result
        } catch (error) {
            setLoading(false)
            throw error
        }
    }
    const startGoogleRegistration = async ()=>{
        setLoading(true)

        try {
            const result = await signInWithPopup(auth,googleProvider)
            await ensureUserDoesNotExist(result.user.email)

            if (result.user.providerData.some((provider) => provider.providerId === 'password')) {
                throw new Error('An account already exists with this email address. Please log in instead.')
            }

            return result
        } catch (error) {
            if (auth.currentUser) await signOut(auth)
            setLoading(false)
            throw error
        }
    }
    const completeGoogleRegistration = async (firebaseUser, password)=>{
        try {
            if (typeof password !== 'string' || password.length < 6) {
                throw new Error('Create a password with at least 6 characters.')
            }

            const passwordCredential = EmailAuthProvider.credential(firebaseUser.email, password)
            await linkWithCredential(firebaseUser, passwordCredential)
            await saveUserToDatabase(firebaseUser, 'register')
            return firebaseUser
        } catch (error) {
            if (auth.currentUser) await signOut(auth)
            setLoading(false)
            throw error
        }
    }
    
    const Logout = ()=>{
        setLoading(true)
       return signOut(auth)
    }

    const updetedUserProfile = (profile)=>{
        if (!auth.currentUser) return Promise.reject(new Error('No authenticated user is available.'))
        return updateProfile(auth.currentUser, profile)
    }

   useEffect(()=>{
    const unSuscraibe = onAuthStateChanged(auth,(cruntUser)=>{
        setUser(cruntUser)
        setLoading(false)
    })
    return ()=>{
        unSuscraibe()
    }
   },[])

    const authinfo = {
registerUser,
signInuser,
siginWithGoogle,
startGoogleRegistration,
completeGoogleRegistration,
user,
loading,
Logout,
updetedUserProfile,
saveUserToDatabase




    }
    return (
        <Authcontext value={authinfo}>
            {children}
        </Authcontext>
    );
};

export default AuthProvider;
