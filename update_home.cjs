const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Replace Crypto Dashboard card entirely with two new cards
const cryptoCardRegex = /\{\/\* Crypto Dashboard \*\/\}([\s\S]*?)<\/BentoCard>/;

const newCards = `{/* Crypto Market */}
          <BentoCard 
            to="/crypto" 
            label="크립토시장으로 이동" 
            className="md:col-span-4 bg-surface/40 backdrop-blur-xl border border-outline/10 hover:bg-surface/60 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-primary/10 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -bottom-36 -left-36 w-[300px] h-[300px] bg-primary/15 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
            
            <div className="absolute right-[-5%] bottom-[-5%] opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-1000 group-hover:-translate-x-2 group-hover:rotate-12 pointer-events-none">
              <Activity className="w-48 h-48 text-on-surface" />
            </div>

            <div className="flex flex-col h-full p-6 md:p-8 relative z-10 w-full justify-between">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20 group-hover:scale-110 group-hover:bg-primary/20 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                <LineChart className="w-7 h-7" />
              </div>
              
              <div className="mt-8 max-w-sm">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-on-surface mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">
                  크립토시장
                </h2>
                <p className="text-sm sm:text-base text-on-surface-variant/90 leading-relaxed font-medium break-keep">
                  실시간 가상자산의 파동 관측.<br />
                  심연의 데이터를 탐색하세요.
                </p>
                
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 w-fit px-5 py-2.5 rounded-full group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-[0_0_0_rgba(var(--color-primary),0)] group-hover:shadow-[0_8px_20px_rgba(var(--color-primary),0.25)]">
                  관측소 접속 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Stock Market */}
          <BentoCard 
            to="/stock" 
            label="주식시장으로 이동" 
            className="md:col-span-4 bg-surface/40 backdrop-blur-xl border border-outline/10 hover:bg-surface/60 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -bottom-36 -left-36 w-[300px] h-[300px] bg-emerald-500/15 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
            
            <div className="absolute right-[-5%] bottom-[-5%] opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-1000 group-hover:-translate-x-2 group-hover:rotate-12 pointer-events-none">
              <BarChart2 className="w-48 h-48 text-on-surface" />
            </div>

            <div className="flex flex-col h-full p-6 md:p-8 relative z-10 w-full justify-between">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                <TrendingUp className="w-7 h-7" />
              </div>
              
              <div className="mt-8 max-w-sm">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-on-surface mb-3 tracking-tight group-hover:text-emerald-500 transition-colors duration-300">
                  주식시장
                </h2>
                <p className="text-sm sm:text-base text-on-surface-variant/90 leading-relaxed font-medium break-keep">
                  글로벌 기업의 가치 흐름.<br />
                  자본의 동향을 파악하세요.
                </p>
                
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 w-fit px-5 py-2.5 rounded-full group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-[0_0_0_rgba(16,185,129,0)] group-hover:shadow-[0_8px_20px_rgba(16,185,129,0.25)]">
                  관측소 접속 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </BentoCard>`;

content = content.replace(cryptoCardRegex, newCards);

// Change Guestbook md:col-span-7 to md:col-span-4 to fit in the same row
content = content.replace(/className="md:col-span-7 bg-surface\/40 backdrop-blur-xl border border-outline\/10 hover:bg-surface\/65 transition-colors shadow-sm hover:shadow-2xl hover:shadow-\[\#7D91B4\]\/10 group overflow-hidden"/g, 'className="md:col-span-4 bg-surface/40 backdrop-blur-xl border border-outline/10 hover:bg-surface/65 transition-colors shadow-sm hover:shadow-2xl hover:shadow-[#7D91B4]/10 group overflow-hidden"');

// Fix vertical text stretching by removing `break-keep` or adding `break-words` in Garden and Stories
content = content.replace(/break-keep/g, 'break-words break-keep');

// Also update the icon imports if necessary
if (!content.includes('TrendingUp')) {
    content = content.replace(/import \{([\s\S]*?)\} from "lucide-react";/, 'import { TrendingUp, BarChart2, $1 } from "lucide-react";');
}

fs.writeFileSync('src/pages/Home.tsx', content);
