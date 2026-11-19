/* firebase-config.js — configuração do Firebase, separada do index.php.
   Nota: a "apiKey" do Firebase para a web identifica o projeto e NÃO é
   um segredo (qualquer site com Firebase a mostra). A proteção está nas
   Regras da base de dados, nos Domínios autorizados e, se quiseres,
   em restringir a chave por domínio no Google Cloud. */
window.FIREBASE_CONFIGS = {
  comentarios: {
  apiKey: "AIzaSyBZHTkEHdj9z3Du5inOFvMH4Y-vjMM72P4",
  authDomain: "comentarios-54d87.firebaseapp.com",
  databaseURL: "https://comentarios-54d87-default-rtdb.firebaseio.com",
  projectId: "comentarios-54d87",
  storageBucket: "comentarios-54d87.firebasestorage.app",
  messagingSenderId: "936419999279",
  appId: "1:936419999279:web:751dcd4c94a52d2d1790da"
},
  feed: {
  apiKey: "AIzaSyDBeLW3gMFPVU8CgvVrTcvfYvcZ_tAI5ZE",
  authDomain: "feed-app-fa204.firebaseapp.com",
  databaseURL: "https://feed-app-fa204-default-rtdb.firebaseio.com",
  projectId: "feed-app-fa204",
  storageBucket: "feed-app-fa204.firebasestorage.app",
  messagingSenderId: "490385185989",
  appId: "1:490385185989:web:87ef4324d59400488ae4ac"
}
};
