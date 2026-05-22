import { PenSquare, Sprout, Image as ImageIcon, ArrowRight, X, Upload, MoreVertical, Edit3, Trash2, Hash } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_ENTRIES = [
  {
    id: 1,
    title: "베란다 정원의 소중한 첫 만남",
    date: "2026. 05. 12",
    content: "상추와 고추, 그리고 대파는 우리 집 작은 베란다 정원에서 함께 자라나는 단짝 친구들입니다.\n\n먼저 상추는 이 화분의 평화주의자입니다. 연둣빛 잎사귀를 보들보들하게 펼치고 있는 모습은 마치 누구든 안아줄 준비가 된 포근한 성격임을 말해주는 것 같습니다.\n\n대파는 이 정원의 든든한 파수꾼 같은 존재입니다. 꼿꼿하게 서서 위로 뻗어나가는 모습이 꽤나 멋집니다.\n\n이 세 단짝이 어떻게 자라날지 매일 물을 주며 지켜보려고 합니다.",
    image: "https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?q=80&w=2574&auto=format&fit=crop",
    tags: ["상추", "고추", "대파"],
    type: "Balcony Garden"
  },
  {
    id: 2,
    title: "새싹이 돋아나다",
    date: "2026. 05. 18",
    content: "아침에 일어나보니 고추 싹이 흙을 뚫고 올라왔습니다! 생명의 신비란 정말 놀랍습니다. 물만 줬을 뿐인데 저렇게 혼자 힘으로 빛을 향해 뻗어나오다니요. 주말에는 영양제도 조금 챙겨줘야겠습니다.",
    image: "https://images.unsplash.com/photo-1599598425947-33002629fb10?w=800&auto=format&fit=crop",
    tags: ["고추", "새싹", "생명의신비"],
    type: "Balcony Garden"
  }
];

const PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1466692476877-396416fd8b22?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1416879598555-220b8fcc5a44?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518731306385-d6d7ac5c15ab?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?w=800&auto=format&fit=crop"
];

export default function PlantJournal() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('plant_journal_entries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_ENTRIES;
      }
    }
    return INITIAL_ENTRIES;
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Save to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('plant_journal_entries', JSON.stringify(entries));
  }, [entries]);

  const [formParams, setFormParams] = useState({
    title: '',
    content: '',
    image: '',
    tags: '',
    type: 'Balcony Garden'
  });

  const openForm = (entry?: any) => {
    if (entry) {
      setEditingId(entry.id);
      setFormParams({
        title: entry.title,
        content: entry.content,
        image: entry.image,
        tags: entry.tags.join(', '),
        type: entry.type
      });
    } else {
      setEditingId(null);
      setFormParams({
        title: '',
        content: '',
        image: '',
        tags: '',
        type: 'Balcony Garden'
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  const handleSave = () => {
    if (!formParams.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!formParams.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const newTags = formParams.tags.split(',').map(t => t.trim()).filter(Boolean);
    const dateStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/-/g, '. ');

    if (editingId) {
      setEntries(entries.map(e => e.id === editingId ? {
        ...e,
        title: formParams.title,
        content: formParams.content,
        image: formParams.image || PRESET_IMAGES[2],
        tags: newTags,
        type: formParams.type
      } : e));
    } else {
      setEntries([{
        id: Date.now(),
        title: formParams.title,
        date: dateStr,
        content: formParams.content,
        image: formParams.image || PRESET_IMAGES[Math.floor(Math.random() * PRESET_IMAGES.length)],
        tags: newTags,
        type: formParams.type
      }, ...entries]);
    }
    closeForm();
  };

  const handleDelete = (id: number) => {
    if (confirm("정말 이 기록을 삭제하시겠습니까? (되돌릴 수 없습니다)")) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const handleImageRandomize = () => {
    const randomImg = PRESET_IMAGES[Math.floor(Math.random() * PRESET_IMAGES.length)];
    setFormParams({ ...formParams, image: randomImg });
  };

  return (
    <div className="p-4 lg:p-6 space-y-12 animate-in fade-in duration-700 max-w-5xl mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mt-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
             <div className="w-10 h-10 rounded-[4px] bg-sage/20 text-sage flex items-center justify-center">
               <Sprout className="w-6 h-6" />
             </div>
             디지털 식물 일지
          </h2>
          <p className="text-slate-500 mt-2">나만의 식물 성장 스토리를 자유롭게 기록하고 관리하세요.</p>
        </div>
        <button 
          onClick={() => openForm()} 
          className="bg-sage text-white px-6 py-3 rounded-[4px] font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-sm shrink-0"
        >
          <PenSquare className="w-4 h-4" />
          새 일기 작성
        </button>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-white/90 backdrop-blur-md overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 w-full max-w-2xl rounded-[8px] p-6 md:p-8 shadow-xl relative my-auto box-border"
            >
              <button onClick={closeForm} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-[4px] transition-colors z-10">
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                {editingId ? <Edit3 className="w-5 h-5 text-sage" /> : <PenSquare className="w-5 h-5 text-sage" />}
                {editingId ? '일기 수정하기' : '새 일기 작성하기'}
              </h3>

              <div className="space-y-5">
                {/* Image Section */}
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Cover Image</label>
                  <div className="relative w-full h-48 bg-slate-50 border border-slate-200 rounded-[4px] overflow-hidden group">
                    {formParams.image ? (
                      <img src={formParams.image} alt="Preview" className="w-full h-full object-cover opacity-90" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 flex-col gap-2">
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-sm">이미지를 추가해주세요</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button onClick={handleImageRandomize} className="px-4 py-2 bg-white/80 hover:bg-white text-slate-900 rounded-[4px] backdrop-blur-md font-medium flex items-center gap-2 transition-colors border border-slate-200 shadow-sm">
                        <Upload className="w-4 h-4" /> 샘플 바꾸기
                      </button>
                      <button onClick={() => setFormParams({...formParams, image: prompt('이미지 URL을 입력하세요:', formParams.image) || formParams.image})} className="px-4 py-2 bg-white/80 hover:bg-white text-slate-900 rounded-[4px] backdrop-blur-md font-medium flex items-center gap-2 transition-colors border border-slate-200 shadow-sm">
                        URL 링크
                      </button>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Title</label>
                  <input 
                    type="text" 
                    value={formParams.title}
                    onChange={(e) => setFormParams({...formParams, title: e.target.value})}
                    placeholder="제목을 입력하세요" 
                    className="w-full bg-white border border-slate-200 rounded-[4px] px-4 py-3 text-slate-900 focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/20 transition-all font-bold text-lg"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Story</label>
                  <textarea 
                    value={formParams.content}
                    onChange={(e) => setFormParams({...formParams, content: e.target.value})}
                    placeholder="어떤 일들이 있었나요?" 
                    className="w-full bg-white border border-slate-200 rounded-[4px] px-4 py-3 text-slate-900 h-40 resize-none focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/20 transition-all leading-relaxed"
                  />
                </div>

                {/* Tags & Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Tags</label>
                    <input 
                      type="text" 
                      value={formParams.tags}
                      onChange={(e) => setFormParams({...formParams, tags: e.target.value})}
                      placeholder="콤마(,)로 구분 (예: 상추, 거름)" 
                      className="w-full bg-white border border-slate-200 rounded-[4px] px-4 py-3 text-slate-900 focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/20 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Garden Type</label>
                    <input 
                      type="text" 
                      value={formParams.type}
                      onChange={(e) => setFormParams({...formParams, type: e.target.value})}
                      placeholder="장소 타입" 
                      className="w-full bg-white border border-slate-200 rounded-[4px] px-4 py-3 text-slate-900 focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/20 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3">
                <button onClick={closeForm} className="px-6 py-2.5 rounded-[4px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                  취소
                </button>
                <button onClick={handleSave} className="bg-sage text-white px-8 py-2.5 rounded-[4px] font-bold hover:brightness-110 transition-all shadow-sm">
                  저장하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feed Area */}
      <div className="space-y-12">
        <AnimatePresence>
          {entries.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-20 bg-slate-50 border border-slate-200 rounded-[8px] border-dashed"
            >
              <Sprout className="w-12 h-12 text-sage/50 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">아직 작성된 일지가 없습니다.</p>
              <p className="text-slate-500 text-sm mt-2">새로운 생명의 성장을 기록해보세요.</p>
            </motion.div>
          )}

          {entries.map(entry => (
            <motion.div 
              key={entry.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
              className="glass-card bg-white/80 p-6 md:p-10 relative overflow-hidden group shadow-sm border border-slate-200"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-sage/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />

              <div className="relative z-10 grid md:grid-cols-5 gap-8">
                
                {/* Meta & Actions block (Mobile view: on top) */}
                <div className="md:col-span-2 order-2 md:order-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                       <span className="font-mono text-sage text-sm">{entry.date}</span>
                       <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => openForm(entry)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-[4px] transition-colors" title="수정">
                           <Edit3 className="w-4 h-4" />
                         </button>
                         <button onClick={() => handleDelete(entry.id)} className="p-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-500 rounded-[4px] transition-colors" title="삭제">
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6 leading-tight max-w-[90%]">
                      {entry.title}
                    </h3>
                    
                    <div className="prose prose-p:leading-relaxed prose-p:text-slate-700 max-w-none text-base whitespace-pre-wrap">
                      {entry.content}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                       <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 text-slate-700 rounded-[4px] text-xs font-bold">
                         <Sprout className="w-3.5 h-3.5 text-sage" /> {entry.type}
                       </span>
                       
                       <div className="flex gap-2">
                         {entry.tags.map((tag, idx) => (
                           <span key={idx} className="text-xs font-mono text-sage/70">#{tag}</span>
                         ))}
                       </div>
                    </div>
                  </div>
                </div>

                {/* Hero Image (Mobile view: bottom or top depending on order) */}
                <div className="md:col-span-3 order-1 md:order-2">
                   <div className="relative w-full h-[300px] md:h-full min-h-[300px] rounded-[4px] overflow-hidden border border-slate-200 shadow-sm">
                      {/* Placeholder style if image fails, handled by img tag but assume good URL */}
                      <img 
                        src={entry.image} 
                        alt="Journal Image" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                      />
                   </div>
                </div>

              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
    </div>
  );
}
