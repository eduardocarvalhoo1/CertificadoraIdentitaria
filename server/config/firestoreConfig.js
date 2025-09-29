// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASbwBKn6X8KBsF8KfP3deNr8UmERjc5_c",
  authDomain: "gerenciador-de-oficinas.firebaseapp.com",
  databaseURL: "https://gerenciador-de-oficinas-default-rtdb.firebaseio.com",
  projectId: "gerenciador-de-oficinas",
  storageBucket: "gerenciador-de-oficinas.firebasestorage.app",
  messagingSenderId: "189651583965",
  appId: "1:189651583965:web:af5144a7fdf33820316c34",
  measurementId: "G-PD9TTGX21W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Export Realime Database                    
const db = getDatabase(app);
module.exports = db;