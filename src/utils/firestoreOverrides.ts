import { db } from "../firebase";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";

export function listenOverrides(callback: (map: Map<string, any>) => void) {
  return onSnapshot(collection(db, "overrides"), (snap) => {
    const map = new Map<string, any>();
    snap.forEach((doc) => {
      map.set(doc.id, doc.data());
    });
    callback(map);
  });
}

export async function saveOverride(key: string, status: string, reason: string) {
  await setDoc(doc(db, "overrides", key), {
    status,
    reason,
    updatedAt: new Date().toISOString()
  });
}
