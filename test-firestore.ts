import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from "fs";

const configStr = fs.readFileSync("./firebase-applet-config.json", "utf8");
const config = JSON.parse(configStr);

console.log("Config:", config.projectId, config.firestoreDatabaseId);

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId || "(default)");

async function test() {
  console.log("Connecting...");
  try {
    const docRef = await addDoc(collection(db, "guestbook"), {
      nickname: "TestAgent",
      message: "Testing connection",
      status: "pending",
      createdAt: new Date().toISOString()
    });
    console.log("Success! ID:", docRef.id);
    process.exit(0);
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}

test();
