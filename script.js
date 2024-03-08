// Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Selecting elements
const chatWindow = document.getElementById("chat-window");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

// Function to add a message to the chat window
function addMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
    // Scroll to bottom of chat window
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Function to send a message
function sendMessage() {
    const message = messageInput.value.trim();
    if (message !== "") {
        db.collection("messages").add({
            text: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            messageInput.value = "";
        }).catch(error => {
            console.error("Error sending message: ", error);
        });
    }
}

// Event listener for send button click
sendBtn.addEventListener("click", sendMessage);

// Event listener for Enter key press in message input
messageInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

// Function to load messages from Firestore
function loadMessages() {
    db.collection("messages")
        .orderBy("timestamp")
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === "added") {
                    addMessage(change.doc.data().text);
                }
            });
        });
}

// Load messages when the page loads
loadMessages();
