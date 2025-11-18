import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {

    apiKey: "AIzaSyDoaZBrEGZLDVg6JSCgwsVwDnhKXm-1WTM",

    authDomain: "floresact06.firebaseapp.com",

    projectId: "floresact06",

    storageBucket: "floresact06.firebasestorage.app",

    messagingSenderId: "569445955012",

    appId: "1:569445955012:web:c0ab4504943741c5fe6091"

};



const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);