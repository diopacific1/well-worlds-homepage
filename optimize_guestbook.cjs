const fs = require('fs');

// We want to add limit to Guestbook snapshot query to improve performance
function optimizeGuestbook(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add limit to firestore import
  if (!content.includes('limit')) {
    content = content.replace(
      'import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where, doc, deleteDoc } from "firebase/firestore";',
      'import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where, doc, deleteDoc, limit } from "firebase/firestore";'
    );
  }

  // Update query
  if (!content.includes('limit(100)')) {
    content = content.replace(
      'where("status", "==", "approved")',
      'where("status", "==", "approved"),\n      limit(100)'
    );
  }

  fs.writeFileSync(file, content);
}

optimizeGuestbook('src/pages/Guestbook.tsx');
