
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>()
 /*==============RECUPERANDO OS DADOS DE AUTENTICAÇÃO DO USER============= */
  useEffect(() => {
    /* =====Variável para desligar o event listener ======================= */
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user) {
        const { displayName, photoURL, uid } = user
        if(!displayName || !photoURL) {
          throw new Error('Missing informations from google Account')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    }) 
    
    return () => { /* boa prática, sempre q declarar um event listener, vc tem que desativar ele */
      unsubscribe();
    }

  }, [])
  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider)
    
      if(result.user) {
        const {displayName, photoURL, uid} = result.user
/*======================Autenticação do Usuário======================= */
        if(!displayName || !photoURL) {
          throw new Error('Missing some informations from google account');
        }
/*======================DADOS DO USUÁRIO================================= */
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
      })
      }
  }
  
  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}