const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Change to lazy import of motion
  // We'll leave it as is if it's too much refactoring for motion.
}
