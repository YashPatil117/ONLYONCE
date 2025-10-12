// DOM Elements
const createBtn = document.getElementById("createBtn");
const messageWall = document.getElementById("messageWall");
const msgText = document.getElementById("msgText");
const msgFile = document.getElementById("msgFile");
const linkOutput = document.getElementById("linkOutput");
const privateMessagesList = document.getElementById("privateMessagesList");
const messageView = document.getElementById("messageView");
const messageText = document.getElementById("messageText");
const messageImage = document.getElementById("messageImage");
const status = document.getElementById("status");
const charCount = document.querySelector('.char-count');

// URL parameters
const params = new URLSearchParams(window.location.search);
const messageId = params.get("id");

// Test Firestore connection
async function testFirestore() {
  try {
    console.log("🧪 Testing Firestore connection...");
    const testId = 'test-' + Math.random().toString(36).substring(2, 5);
    await firebase.firestore().collection("messages").doc(testId).set({
      text: "Test message",
      isPublic: true,
      createdAt: new Date().toISOString()
    });
    console.log("✅ Firestore write successful");
    
    const snap = await firebase.firestore().collection("messages").doc(testId).get();
    if (snap.exists) {
      console.log("✅ Firestore read successful");
      await firebase.firestore().collection("messages").doc(testId).delete();
      console.log("✅ Firestore delete successful");
    }
  } catch (error) {
    console.error("❌ Firestore error:", error);
  }
}

// Character count for textarea
msgText.addEventListener('input', () => {
  charCount.textContent = `${msgText.value.length}/500`;
});

// Initialize app
if (messageId) {
  console.log("📨 Message ID found in URL:", messageId);
  showMessage(messageId);
} else {
  console.log("🏠 Loading main page...");
  testFirestore();
  loadPublicMessages();
  loadPrivateMessages();
}

// Create message
createBtn.addEventListener("click", async () => {
  const text = msgText.value.trim();
  const file = msgFile.files[0];
  const visibility = document.querySelector('input[name="visibility"]:checked').value;
  const id = Math.random().toString(36).substring(2, 10);

  console.log("🔄 Creating message:", { text: text?.substring(0, 50), hasFile: !!file, visibility, id });

  if (!text && !file) {
    alert("Please add a message or image!");
    return;
  }

  let fileURL = null;
  if (file) {
    try {
      console.log("📤 Uploading file...");
      const storageRef = firebase.storage().ref(`files/${id}-${file.name}`);
      await storageRef.put(file);
      fileURL = await storageRef.getDownloadURL();
      console.log("✅ File uploaded:", fileURL);
    } catch (error) {
      console.error("❌ File upload failed:", error);
      alert("Failed to upload image. Please try again.");
      return;
    }
  }

  try {
    console.log("💾 Saving to Firestore...");
    await firebase.firestore().collection("messages").doc(id).set({
      text,
      fileURL,
      isPublic: visibility === "public",
      createdAt: new Date().toISOString(),
      creator: localStorage.getItem('userId') || generateUserId()
    });
    console.log("✅ Message saved to Firestore");

    if (visibility === "private") {
      const messageUrl = `${window.location.origin}${window.location.pathname}?id=${id}`;
      linkOutput.innerHTML = `
        <strong>Private message created!</strong><br>
        Share this link: <br>
        <input type="text" value="${messageUrl}" readonly class="url-input">
        <button onclick="copyUrl('${messageUrl}')" class="copy-btn">Copy</button>
      `;
      linkOutput.style.display = 'block';
      
      addPrivateMessageToList(id, text, fileURL);
    } else {
      alert("Your public message is now visible!");
      loadPublicMessages();
    }

    msgText.value = "";
    msgFile.value = "";
    charCount.textContent = "0/500";
    
  } catch (error) {
    console.error("❌ Error creating message:", error);
    alert("Failed to create message. Please try again.");
  }
});

// Load public messages
async function loadPublicMessages() {
  try {
    console.log("📥 Loading public messages...");
    const snapshot = await firebase.firestore().collection("messages").get();
    const all = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    console.log("📦 All messages from Firestore:", all);
    
    const publicMsgs = all.filter(m => m.isPublic);
    console.log("👥 Public messages:", publicMsgs);
    
    messageWall.innerHTML = "";
    
    if (publicMsgs.length === 0) {
      messageWall.innerHTML = '<div class="no-messages">No public messages yet. Be the first to share!</div>';
      return;
    }
    
    publicMsgs.forEach(msg => {
      const messageCard = createMessageCard(msg, false);
      messageWall.appendChild(messageCard);
    });
  } catch (error) {
    console.error("❌ Error loading public messages:", error);
    messageWall.innerHTML = '<div class="error">Failed to load messages</div>';
  }
}

// Load private messages
async function loadPrivateMessages() {
  const userId = localStorage.getItem('userId') || generateUserId();
  localStorage.setItem('userId', userId);
  console.log("👤 User ID:", userId);
  
  try {
    const snapshot = await firebase.firestore().collection("messages").get();
    const all = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    const privateMsgs = all.filter(m => !m.isPublic && m.creator === userId);
    
    console.log("🔒 Private messages for user:", privateMsgs);
    
    privateMessagesList.innerHTML = "";
    
    if (privateMsgs.length === 0) {
      privateMessagesList.innerHTML = '<div class="no-messages">Your private messages will appear here</div>';
      return;
    }
    
    privateMsgs.forEach(msg => {
      addPrivateMessageToList(msg.id, msg.text, msg.fileURL);
    });
  } catch (error) {
    console.error("❌ Error loading private messages:", error);
  }
}

// Add private message to the list
function addPrivateMessageToList(id, text, fileURL) {
  const messageCard = document.createElement('div');
  messageCard.className = 'message-card private';
  messageCard.innerHTML = `
    <div class="message-content">${text ? text.substring(0, 50) + (text.length > 50 ? '...' : '') : '📷 Image message'}</div>
    <div class="message-meta">
      <span>Private</span>
      ${fileURL ? '<span class="has-image"></span>' : ''}
    </div>
    <div class="private-dropdown">
      <button class="forward-btn" onclick="forwardMessage('${id}')">Forward Message URL</button>
    </div>
  `;
  
  messageCard.onclick = () => previewPrivateMessage(id);
  privateMessagesList.appendChild(messageCard);
}

// Create message card element
function createMessageCard(msg, isPrivate = false) {
  const messageCard = document.createElement('div');
  messageCard.className = `message-card ${isPrivate ? 'private' : ''}`;
  messageCard.innerHTML = `
    <div class="message-content">${msg.text ? msg.text.substring(0, 50) + (msg.text.length > 50 ? '...' : '') : '📷 Image message'}</div>
    <div class="message-meta">
      <span>${isPrivate ? 'Private' : 'Public'}</span>
      ${msg.fileURL ? '<span class="has-image"></span>' : ''}
    </div>
    ${isPrivate ? `
    <div class="private-dropdown">
      <button class="forward-btn" onclick="forwardMessage('${msg.id}')">Forward Message URL</button>
    </div>
    ` : ''}
  `;
  
  messageCard.onclick = () => {
    console.log("🖱️ Clicked message:", msg.id);
    if (isPrivate) {
      previewPrivateMessage(msg.id);
    } else {
      window.location.href = `?id=${msg.id}`;
    }
  };
  
  return messageCard;
}

// Show message (when URL has ID)
async function showMessage(id) {
  console.log("🔄 Loading message with ID:", id);
  
  document.querySelector(".main-layout").classList.add("hidden");
  messageView.classList.remove("hidden");

  try {
    const docRef = firebase.firestore().collection("messages").doc(id);
    console.log("📡 Fetching from Firestore...");
    
    const snap = await docRef.get();
    console.log("📄 Firestore response:", snap.exists ? "EXISTS" : "NOT FOUND");
    
    if (snap.exists) {
      const data = snap.data();
      console.log("📦 Message data:", data);
      
      messageText.textContent = data.text || "No text content";
      
      if (data.fileURL) {
        console.log("🖼️ Loading image:", data.fileURL);
        messageImage.src = data.fileURL;
        messageImage.style.display = "block";
      } else {
        messageImage.style.display = "none";
      }
      
      status.textContent = "⚠️ This message has now been deleted forever.";
      
      console.log("🗑️ Deleting message...");
      await docRef.delete();
      console.log("✅ Message deleted successfully");
    } else {
      console.log("❌ Message not found in Firestore");
      messageText.textContent = "This message was already opened or deleted.";
      status.textContent = "";
    }
  } catch (error) {
    console.error("💥 Error showing message:", error);
    messageText.textContent = "Failed to load message. Check console for errors.";
    status.textContent = "";
  }
}

// Preview private message
async function previewPrivateMessage(id) {
  try {
    console.log("👀 Previewing private message:", id);
    const docRef = firebase.firestore().collection("messages").doc(id);
    const snap = await docRef.get();
    
    if (snap.exists) {
      const data = snap.data();
      
      document.querySelector(".main-layout").classList.add("hidden");
      messageView.classList.remove("hidden");
      
      messageText.textContent = data.text || "";
      messageImage.style.display = "none";
      
      if (data.fileURL) {
        messageImage.src = data.fileURL;
        messageImage.style.display = "block";
      }
      
      status.textContent = "This is a preview. The message will self-destruct when someone opens it via the shared link.";
    } else {
      alert("Message not found or already deleted.");
    }
  } catch (error) {
    console.error("Error previewing message:", error);
    alert("Failed to preview message.");
  }
}

// Forward message URL
function forwardMessage(id) {
  const messageUrl = `${window.location.origin}${window.location.pathname}?id=${id}`;
  console.log("📤 Forwarding message URL:", messageUrl);
  
  const tempInput = document.createElement('input');
  tempInput.value = messageUrl;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  
  alert('Message URL copied to clipboard! Share it with anyone.');
}

// Copy URL to clipboard
function copyUrl(url) {
  const tempInput = document.createElement('input');
  tempInput.value = url;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  alert('URL copied to clipboard!');
}

// Generate user ID
function generateUserId() {
  return 'user_' + Math.random().toString(36).substring(2, 15);
}

// Go back home
function goHome() {
  window.location.href = window.location.pathname;
}

// Make functions globally available
window.forwardMessage = forwardMessage;
window.copyUrl = copyUrl;
window.goHome = goHome;
window.previewPrivateMessage = previewPrivateMessage;