const fs = require('fs');

function test(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    'where("status", "==", "approved"),',
    'where("status", "==", "approved"),\n      orderBy("createdAt", "desc"),'
  );
  fs.writeFileSync(file, content);
}
test('src/pages/Guestbook.tsx');
