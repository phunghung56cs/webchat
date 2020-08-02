const init = () => {
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCbAGZe7F0cMuYf3OGnKUCOBx85pC579os",
    authDomain: "web-chat-455cb.firebaseapp.com",
    databaseURL: "https://web-chat-455cb.firebaseio.com",
    projectId: "web-chat-455cb",
    storageBucket: "web-chat-455cb.appspot.com",
    messagingSenderId: "399784407490",
    appId: "1:399784407490:web:1cd4d7ff4ba7dd5b45665b"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log(firebase.app().name)
  //firestoreFunction()
  messageFunc()
  model.chat()

}
window.onload = init

//CRUD Database

const messageFunc = async () => {
  const docId = 'hd8MN25AWH0GZ33nKVwW'
  const res = await firebase.firestore().collection('conversations')
    .doc(docId).get()
  const msgList = getDataFromDoc(res)
  console.log(msgList);

}
firestoreFunction = async () => {
  //get one document
  const documentId = 'uLfKNAsIPieEZs76hxV6'
  const response = await firebase.firestore()
    .collection('users').doc(documentId).get()
  const user = getDataFromDoc(response)
  //response.data()
  //user.id = response.id
  //console.log(user);

  //get many document


  const response2 = await firebase.firestore()
    .collection('users').where('name', '==', 'Hoai Linh').get()

  const listUser = getDataFromDocs(response2.docs)
  console.log(listUser);
  //console.log(getDataFromDoc(response2.docs[0]));


  /* add document */
  const userToAdd = {
    name: 'ABC',
    age: 23,
    email: 'trinhtrungdung@gmail.com'

  }
  //firebase.firestore().collection('users').add(userToAdd)

  /* update document */


  /* delete document */
  //const docToDelete = 'dhYrH8vYs9cC2Qjbrmbr'
  //firebase.firestore().collection('users').doc(docToDelete).delete()

}
const getDataFromDoc = (doc) => {
  const data = doc.data()
  data.id = doc.id
  return data
}

const getDataFromDocs = (docs) => {
  /*  const listData = []
   for (let index = 0; index < docs.length; index++) {
     const element = getDataFromDoc(docs[index]);
     listData.push(element)
   };
   return listData */
  return listData = docs.map(element => getDataFromDoc(element))
}