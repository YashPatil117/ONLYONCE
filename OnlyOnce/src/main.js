import { 
  db, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  collection 
} from "./firebase.js";

const createBtn = document.getElementById("createBtn");
const messageWall = document.getElementById("messageWall");
const msgText = document.getElementById("msgText");
const msgFile = document.getElementById("msgFile");
const linkOutput = document.getElementById("linkOutput");

const messageView = document.getElementById("messageView");
const messageText = document.getElementById("messageText");
const messageImage = document.getElementById("messageImage");
const status = document.getElementById("status");

const params = new URLSearchParams(window.location.search);
const messageId = params.get("id");

// Hide file input since we can't use storage
msgFile.style.display = "none";

if (messageId) {
  showMessage(messageId);
} else {
  loadPublicMessages();
}

createBtn.addEventListener("click", async () => {
  const text = msgText.value;
  const visibility = document.querySelector('input[name="visibility"]:checked').value;
  const id = Math.random().toString(36).substring(2, 10);

  await setDoc(doc(db, "messages", id), {
    text,
    fileURL: null, // No file uploads
    isPublic: visibility === "public",
    createdAt: new Date().toISOString()
  });

  if (visibility === "private") {
    linkOutput.innerHTML = `Private link: <a href="?id=${id}" target="_blank">Open Message</a>`;
  } else {
    alert("Your public message is now visible!");
    loadPublicMessages();
  }

  msgText.value = "";
});

async function loadPublicMessages() {
  const snapshot = await getDocs(collection(db, "messages"));
  const all = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  const publicMsgs = all.filter(m => m.isPublic);
  messageWall.innerHTML = "";
  publicMsgs.forEach(msg => {
    const div = document.createElement("div");
    div.className = "ticket";
    div.textContent = msg.text ? msg.text.substring(0, 30) : "Text message";
    div.onclick = () => (window.location.href = `?id=${msg.id}`);
    messageWall.appendChild(div);
  });
}

async function showMessage(id) {
  document.getElementById("create-section").classList.add("hidden");
  document.getElementById("wall-section").classList.add("hidden");
  messageView.classList.remove("hidden");

  const docRef = doc(db, "messages", id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const data = snap.data();
    messageText.textContent = data.text || "";
    // Hide image section since we can't upload files
    messageImage.style.display = "none";
    status.textContent = "⚠️ This message has now been deleted forever.";
    await deleteDoc(docRef);
  } else {
    messageText.textContent = "This message was already opened or deleted.";
    status.textContent = "";
  }
}