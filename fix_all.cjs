const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // We have something like:
  // {loadingCrypto && <DashboardSkeleton />
  // {fetchError && ( ... )}
  // )}
  //
  // Let's just fix the JSX block directly using string splitting or regex.
  
  content = content.replace('{loadingCrypto && <DashboardSkeleton />', '{loadingCrypto && <DashboardSkeleton />}\n');
  
  // also, we need to remove the trailing `)}` that was left over from the original `loadingCrypto && (`
  
  const badPart = `                </div>
              </div>
            )}
            )}
            <div className="lg:col-span-8 space-y-6 lg:space-y-8">`;
            
  const goodPart = `                </div>
              </div>
            )}
            <div className="lg:col-span-8 space-y-6 lg:space-y-8">`;

  content = content.replace(badPart, goodPart);
  
  // Actually, maybe I can just do a regex replace to clean up `)}` followed by another `)}`
  content = content.replace(/\)\}\s*\)\}/g, ')}');
  
  fs.writeFileSync(file, content);
}

fix('src/pages/CryptoDashboard.tsx');
fix('src/pages/StockDashboard.tsx');
