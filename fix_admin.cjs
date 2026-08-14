const fs = require('fs');

let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Replace the fallback sorting logic block entirely for safety
const regex1 = /entries\.sort\(\(a, b\) => \{[\s\S]*?\}\);/g;
const replacement1 = `entries.sort((a, b) => {
        const getMillis = (item: unknown) => {
          const createdAt = (item as { createdAt?: any }).createdAt;
          if (!createdAt) return 0;
          if (typeof createdAt.toMillis === 'function') return createdAt.toMillis();
          return new Date(createdAt).getTime() || 0;
        };
        return getMillis(b) - getMillis(a);
      });`;
content = content.replace(regex1, replacement1);

const regex2 = /setAdminData\(pSnap\.docs\.map.*?as any\)\.sort\(\(a: any, b: any\) => \{[\s\S]*?\}\)\);/g;
const replacement2 = `setAdminData(pSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as object) })).sort((a, b) => {
          const getMillis = (item: unknown) => {
            const createdAt = (item as { createdAt?: any }).createdAt;
            if (!createdAt) return 0;
            if (typeof createdAt.toMillis === 'function') return createdAt.toMillis();
            return new Date(createdAt).getTime() || 0;
          };
          return getMillis(b) - getMillis(a);
        }));`;
content = content.replace(regex2, replacement2);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
