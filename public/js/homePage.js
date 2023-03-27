function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("logging out user");
      localStorage.clear();
    })
    .catch((error) => {
      // An error happened.
    });
}
