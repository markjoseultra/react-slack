import firebase from 'firebase'

var firebaseConfig = {
  apiKey: 'AIzaSyDKIPw0TtZP_7_RSClJMjCEfljxMHRGZgQ',
  authDomain: 'slack-chat-fa621.firebaseapp.com',
  databaseURL: 'https://slack-chat-fa621-default-rtdb.firebaseio.com',
  projectId: 'slack-chat-fa621',
  storageBucket: 'slack-chat-fa621.appspot.com',
  messagingSenderId: '1039417329542',
  appId: '1:1039417329542:web:847592ca13f6c046abce07',
  measurementId: 'G-NVB0DTC6JZ'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export const f = firebase
export const database = firebase.database()
export const auth = firebase.auth()
export const storage = firebase.storage()
