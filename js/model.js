const model = {};
model.currentUser = undefined

//Storing all conversation that currentUser loggged in
model.conversations = undefined
model.currentConversation = undefined

model.collectionName = 'conversations'


model.register = async (data) => {
  try {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(data.email, data.password);
    firebase.auth().currentUser.updateProfile({
      displayName: data.firstName + " " + data.lastName,
    });
    firebase.auth().currentUser.sendEmailVerification();
    alert("The email has been registered, please check your email!");
    view.setActiveScreen("loginScreen");
  } catch (err) {
    //alert(err.message)
    console.log(err);
    switch (err.code) {
      case "auth/email-already-in-use":
        document.getElementById("email-error").innerText = err.message;
        break;
      case "auth/weak-password":
        document.getElementById("password-error").innerText = err.message;
        break;
    }
  }
};

// .then((res) => {
//   firebase.auth().currentUser.updateProfile({
//     displayName: data.firstName + ' ' + data.lastName
//   })
//   firebase.auth().currentUser.sendEmailVerification()
// }).catch((err) => {
//   console.log(err)
// })

model.login = async (dataLogin) => {
  try {
    const response = await firebase
      .auth()
      .signInWithEmailAndPassword(dataLogin.email, dataLogin.password);
    console.log(response);
    if (response.user.emailVerified === false) {
      alert("Please verify your email!");
    } else {
      model.currentUser = {
        displayName: response.user.displayName,
        email: response.user.email,
      };
      view.setActiveScreen("chatScreen");
    }
  } catch (err) {
    switch (err.code) {
      case "auth/invalid-email":
        document.getElementById("email-error").innerText = err.message;
        break;
      case "auth/user-not-found":
        document.getElementById("email-error").innerText = err.message;
        break;
      case "auth/wrong-password":
        document.getElementById("password-error").innerText = err.message;
        break;
    }
  }
};

model.chat = async () => {
  try {
    const authState = await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        if (user.emailVerified) {
          model.currentUser = {
            displayName: user.displayName,
            email: user.email
          }
          view.setActiveScreen('chatScreen')
        } else {
          view.setActiveScreen('loginScreen')
          alert('Please verify your email')
        }
      } else {
        view.setActiveScreen('loginScreen')
      }
    });

  } catch (error) {
    alert(error.message)

  }
}

model.addMessage = (msg) => {
  const dataToUpdate = {
    messages: firebase.firestore.FieldValue.arrayUnion(msg)
  }
  firebase.firestore().collection(model.collectionName)
    .doc('hd8MN25AWH0GZ33nKVwW').update(dataToUpdate);
};

//loading all conversations
model.loadConversations = async () => {
  const response = await firebase.firestore().collection(model.collectionName)
    .where('users', 'array-contains', model.currentUser.email)
    .get()
  model.conversations = getDataFromDocs(response.docs)
  if (model.conversations.length > 0) {
    model.currentConversation = model.conversations[0]
    view.showCurrentConversation()

  }

}

model.listenConversationsChange = () => {
  let isFirstRun = true
  firebase.firestore().collection(model.collectionName)
    .where('users', 'array-contains', model.currentUser.email)
    .onSnapshot((res) => {
      if (isFirstRun) {
        isFirstRun = false
        return

      }
      const docChanges = res.docChanges()


      for (const oneChange of docChanges) {
        const type = oneChange.type
        if (type === 'modified') {
          const docData = getDataFromDoc(oneChange.doc)
          //update model.conversations
          for (let index = 0; index < model.conversations.length; index++) {
            if (model.conversations[index].id === docData.id) {
              model.conversations[index] = docData
            }

          }
          //update model.currentConversation
          if (docData.id === model.currentConversation.id) {
            model.currentConversation = docData
            const lastMessage = docData.messages[docData.messages.length - 1]
            view.addMessage(lastMessage)
            view.scrollToEndElement()

          }


          console.log(model.conversations)
        }

      }
    })
}
/* model.statusUser = () => {
  // ...
  var userStatusFirestoreRef = firebase.firestore().doc('/status/' + model.currentUser.email);

  // Firestore uses a different server timestamp value, so we'll 
  // create two more constants for Firestore state.
  var isOfflineForFirestore = {
    state: 'offline',
    last_changed: firebase.firestore.FieldValue.serverTimestamp(),
  };

  var isOnlineForFirestore = {
    state: 'online',
    last_changed: firebase.firestore.FieldValue.serverTimestamp(),
  };

  firebase.database().ref('.info/connected').on('value', function (snapshot) {
    if (snapshot.val() == false) {
      // Instead of simply returning, we'll also set Firestore's state
      // to 'offline'. This ensures that our Firestore cache is aware
      // of the switch to 'offline.'
      userStatusFirestoreRef.set(isOfflineForFirestore);
      return;
    };

    userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
      userStatusDatabaseRef.set(isOnlineForDatabase);

      // We'll also add Firestore set here for when we come online.
      userStatusFirestoreRef.set(isOnlineForFirestore);
    });
  })
} */