const model = {}
model.currentUser = undefined


model.register = async (data) => {
  try {
    await firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
    firebase.auth().currentUser.updateProfile({
      displayName: data.firstName + ' ' + data.lastName
    })
    firebase.auth().currentUser.sendEmailVerification()
    alert('The email has been registered, please check your email!')
    view.setActiveScreen('loginScreen')
  } catch (err) {
    //alert(err.message)
    console.log(err);
    switch (err.code) {
      case "auth/email-already-in-use":
        document.getElementById('email-error').innerText = err.message
        break;
      case "auth/weak-password":
        document.getElementById('password-error').innerText = err.message
        break;

    }
  }
}

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
    const response = await firebase.auth()
      .signInWithEmailAndPassword(dataLogin.email, dataLogin.password)
    console.log(response)
    if (response.user.emailVerified === false) {
      alert('Please verify your email!')
    } else {
      model.currentUser = {
        displayName: response.user.displayName,
        email: response.user.email
      };

      view.setActiveScreen('chatScreen')
    }
  } catch (err) {
    switch (err.code) {
      case "auth/invalid-email":
        document.getElementById('email-error').innerText = err.message
        break;
      case "auth/user-not-found":
        document.getElementById('email-error').innerText = err.message
        break;
      case "auth/wrong-password":
        document.getElementById('password-error').innerText = err.message
        break;


    }
  }
}