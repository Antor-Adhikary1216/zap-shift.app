import { useEffect, useState } from 'react';
import { Authcontext } from '../AuthContext';
import { createUserWithEmailAndPassword, deleteUser, EmailAuthProvider, GoogleAuthProvider, linkWithCredential, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../../../FireBase/Firebase.config';
import { startGlobalLoading } from '../../../Utilities/globalLoading';

const apiUrl = import.meta.env.VITE_API_URL || 'https://zap-shift-server-peach-nine.vercel.app'

const saveUserToDatabase = async (firebaseUser, action = 'login', { showLoading = true } = {}) => {
    const stopLoading = showLoading
        ? startGlobalLoading(action === 'register' ? 'Creating your account...' : 'Synchronizing your account...')
        : () => {}
    try {
    const idToken = await firebaseUser.getIdToken()
    const response = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
        },
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
    } finally {
        stopLoading()
    }
}

const synchronizeUserInBackground = async (firebaseUser) => {
    for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
            await saveUserToDatabase(firebaseUser, 'login', { showLoading: false })
            return
        } catch {
            if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 750))
        }
    }
}

const ensureUserDoesNotExist = async (firebaseUser) => {
    const stopLoading = startGlobalLoading('Checking your account...')
    try {
    const idToken = await firebaseUser.getIdToken()
    const response = await fetch(
        `${apiUrl}/users/${encodeURIComponent(firebaseUser.email)}/role?createIfMissing=false`,
        { headers: { Authorization: `Bearer ${idToken}` } }
    )

    if (response.ok) {
        throw new Error('An account already exists with this email address. Please log in instead.')
    }

    if (response.status !== 404) {
        throw new Error('Unable to verify this email address. Please try again shortly.')
    }
    } finally {
        stopLoading()
    }
}

const AuthProvider = ({children}) => {
const [user , setUser] =useState()
const [loading,setLoading ] = useState(true)
const [, setProfileVersion] = useState(0)

const googleProvider = new GoogleAuthProvider()
    const registerUser = async (email,password)=> {
        const stopLoading = startGlobalLoading('Creating your account...')
        setLoading(true)
        try {
            return await createUserWithEmailAndPassword(auth,email,password)
        } catch (error) {
            setLoading(false)
            throw error
        } finally {
            stopLoading()
        }
    }
    const signInuser = async (email,password)=>{
        const stopLoading = startGlobalLoading('Signing you in...')
        setLoading(true)
        try {
            const result = await signInWithEmailAndPassword(auth,email,password)
            void synchronizeUserInBackground(result.user)
            return result
        } catch (error) {
            setLoading(false)
            throw error
        } finally {
            stopLoading()
        }
    }
    const siginWithGoogle = async ()=>{
        const stopLoading = startGlobalLoading('Connecting with Google...')
        setLoading(true)
        try {
            const result = await signInWithPopup(auth,googleProvider)
            void synchronizeUserInBackground(result.user)
            return result
        } catch (error) {
            setLoading(false)
            throw error
        } finally {
            stopLoading()
        }
    }
    const startGoogleRegistration = async ()=>{
        const stopLoading = startGlobalLoading('Preparing Google registration...')
        setLoading(true)

        try {
            const result = await signInWithPopup(auth,googleProvider)
            await ensureUserDoesNotExist(result.user)

            if (result.user.providerData.some((provider) => provider.providerId === 'password')) {
                throw new Error('An account already exists with this email address. Please log in instead.')
            }

            return result
        } catch (error) {
            if (auth.currentUser) await signOut(auth)
            setLoading(false)
            throw error
        } finally {
            stopLoading()
        }
    }
    const completeGoogleRegistration = async (firebaseUser, password)=>{
        const stopLoading = startGlobalLoading('Completing your account...')
        try {
            if (typeof password !== 'string' || password.length < 6) {
                throw new Error('Create a password with at least 6 characters.')
            }

            const passwordCredential = EmailAuthProvider.credential(firebaseUser.email, password)
            await linkWithCredential(firebaseUser, passwordCredential)
            await saveUserToDatabase(firebaseUser, 'register', { showLoading: false })
            return firebaseUser
        } catch (error) {
            if (auth.currentUser) await signOut(auth)
            setLoading(false)
            throw error
        } finally {
            stopLoading()
        }
    }
    
    const Logout = async ()=>{
        const stopLoading = startGlobalLoading('Signing you out...')
        setLoading(true)
        try {
            return await signOut(auth)
        } finally {
            stopLoading()
        }
    }

    const updetedUserProfile = async (profile)=>{
        if (!auth.currentUser) return Promise.reject(new Error('No authenticated user is available.'))
        await updateProfile(auth.currentUser, profile)
        setProfileVersion((version) => version + 1)
        return auth.currentUser
    }

    const deleteIncompleteRegistration = async (firebaseUser)=>{
        if (firebaseUser && !firebaseUser.emailVerified) await deleteUser(firebaseUser)
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
deleteIncompleteRegistration,
saveUserToDatabase




    }
    return (
        <Authcontext value={authinfo}>
            {children}
        </Authcontext>
    );
};

export default AuthProvider;
