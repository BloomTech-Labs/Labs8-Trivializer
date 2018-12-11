<script src="https://www.gstatic.com/firebasejs/5.7.0/firebase.js" />;
var config = {
  apiKey: "AIzaSyCWagGc-I72tiBhJL7FJCdOCfCNzeSrH9g",
  authDomain: "bar-trivializer.firebaseapp.com",
  databaseURL: "https://bar-trivializer.firebaseio.com",
  projectId: "bar-trivializer",
  storageBucket: "bar-trivializer.appspot.com",
  messagingSenderId: "427746073809"
};
firebase.initializeApp(config);

var storage = firebase.storage();
