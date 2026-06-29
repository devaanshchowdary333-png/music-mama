import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, doc,
  updateDoc, deleteDoc, query, where, orderBy, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDii76uzTJnr99XQnh8_OBdH5WnUMxFZPQ",
  authDomain: "music-mama-ea4ef.firebaseapp.com",
  projectId: "music-mama-ea4ef",
  storageBucket: "music-mama-ea4ef.firebasestorage.app",
  messagingSenderId: "58013551347",
  appId: "1:58013551347:web:e7cd6805c997f971ca8586"
};

const app     = initializeApp(firebaseConfig);
const db      = getFirestore(app);
const storage = getStorage(app);

// ─── MOVIES ──────────────────────────────────────────────

export async function getMovies({ language, year } = {}) {
  const constraints = [orderBy("year", "desc"), orderBy("name")];
  if (language) constraints.unshift(where("language", "==", language));
  if (year)     constraints.unshift(where("year", "==", Number(year)));
  const q    = query(collection(db, "movies"), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getMovie(id) {
  const snap = await getDoc(doc(db, "movies", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function searchMovies(term, language = "telugu") {
  const all = await getMovies({ language });
  const t   = term.toLowerCase();
  return all.filter(m => m.name.toLowerCase().includes(t));
}

export async function addMovie(data) {
  const docRef = await addDoc(collection(db, "movies"), {
    ...data,
    nameLower: data.name.toLowerCase(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return docRef.id;
}

export async function updateMovie(id, data) {
  await updateDoc(doc(db, "movies", id), {
    ...data,
    nameLower: (data.name || "").toLowerCase(),
    updatedAt: new Date().toISOString()
  });
}

export async function deleteMovie(id) {
  await deleteDoc(doc(db, "movies", id));
}

// ─── SONGS ───────────────────────────────────────────────

export async function getSongs(movieId) {
  const q    = query(collection(db, "movies", movieId, "songs"), orderBy("track"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addSong(movieId, songData) {
  const docRef = await addDoc(collection(db, "movies", movieId, "songs"), {
    ...songData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
}

export async function updateSong(movieId, songId, data) {
  await updateDoc(doc(db, "movies", movieId, "songs", songId), data);
}

export async function deleteSong(movieId, songId) {
  await deleteDoc(doc(db, "movies", movieId, "songs", songId));
}

// ─── STORAGE (Firebase) ──────────────────────────────────

export async function uploadSong(movieId, file) {
  const storageRef = ref(storage, `songs/${movieId}/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

export async function deleteSongFile(path) {
  await deleteObject(ref(storage, path));
}

// ─── GOOGLE DRIVE HELPER ─────────────────────────────────
// Converts a Google Drive share link to a direct download link.
// Input:  https://drive.google.com/file/d/FILE_ID/view?usp=sharing
// Output: https://drive.google.com/uc?export=download&id=FILE_ID

export function convertDriveLink(url) {
  if (!url) return url;
  if (url.includes("uc?export=download")) return url;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  return url;
}

export { db, storage };
