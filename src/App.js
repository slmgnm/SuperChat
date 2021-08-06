import React, { useRef, useState } from 'react';
import './App.css';
//firebase SDK
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
//Hooks
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';


//Firebase project 
firebase.initializeApp({
  apiKey: "AIzaSyA3RdFe5Y9opJV4rbXaiVeSBGttBOq2Vio",
  authDomain: "superchat-56b64.firebaseapp.com",
  projectId: "superchat-56b64",
  storageBucket: "superchat-56b64.appspot.com",
  messagingSenderId: "451884401570",
  appId: "1:451884401570:web:93b00b7cc767565086a8fb",
  measurementId: "G-KBK6XBSQKS"
})
//global variables to refer to the auth and SDK
const auth = firebase.auth();
const firestore =firebase.firestore();

function App() {
  // if user is signed in user is an object if signed out user is null
  const [user]= useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
       
      </header>
      
      <section>
        {/*  if the user is signed in show  ChatRoom else show SignIn */}
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
function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}
function ChatRoom(){
  const dummy = useRef();
  // reference to a firestore collection database
  const messagesRef = firestore.collection('messages');
  // query subset of documents in a collection orderedby time and limited with the maximum number of items to return
  const query = messagesRef.orderBy('createdAt').limit(25);
  // Listen to data with a hook, it returns an array of objects where each object is the chat message.
  // reacts to changes in realtime
  const [messages] = useCollectionData(query,{idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;
 // Create new document in firestore
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
 // reset the form value back to empty string
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>
}
    <form onSubmit={sendMessage}>
   
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}
// shows the real message by accessing it from the props
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  // it compares the messages if sent or received, using conditional CSS.
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}

export default App;
