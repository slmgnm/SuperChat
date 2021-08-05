import React from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionDate} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyA3RdFe5Y9opJV4rbXaiVeSBGttBOq2Vio",
  authDomain: "superchat-56b64.firebaseapp.com",
  projectId: "superchat-56b64",
  storageBucket: "superchat-56b64.appspot.com",
  messagingSenderId: "451884401570",
  appId: "1:451884401570:web:93b00b7cc767565086a8fb",
  measurementId: "G-KBK6XBSQKS"
})

const auth = firebase.auth();
const firebase =firebase.firestore();

function App() {
  const [user]= useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
       
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}
function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )

}

export default App;
