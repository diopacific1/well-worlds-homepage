import {
  PenSquare,
  Sprout,
  Image as ImageIcon,
  X,
  Upload,
  Edit3,
  Trash2,
  Search,
  Sun,
  Cloud,
  CloudRain,
  Droplets,
  Leaf,
  Scissors,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { db, storage, handleFirestoreError, OperationType } from "../../firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const INITIAL_ENTRIES: any[] = [];

const PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1466692476877-396416fd8b22?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1416879598555-220b8fcc5a44?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518731306385-d6d7ac5c15ab?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?w=800&auto=format&fit=crop",
];

const WEATHER_OPTIONS = [
  { id: "sun", icon: Sun, label: "맑음" },
  { id: "cloud", icon: Cloud, label: "흐림" },
  { id: "rain", icon: CloudRain, label: "비" },
];

const ACTIVITY_OPTIONS = [
  { id: "observation", icon: Sprout, label: "관찰" },
  { id: "watering", icon: Droplets, label: "물주기" },
  { id: "fertilizing", icon: Leaf, label: "영양제" },
  { id: "repotting", icon: Scissors, label: "분갈이/관리" },
];

export default function PlantJournal() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActivity, setFilterActivity] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Firestore Feed Integration for Plants
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);

  useEffect(() => {
    if (!db) {
      const saved = localStorage.getItem("plant_journal_entries_v3");
      if (saved) {
        try {
          setEntries(JSON.parse(saved));
        } catch (e) {
          setEntries([]);
        }
      }
      setIsLoadingEntries(false);
      return;
    }

    const q = query(collection(db, "plant_journal"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date || (data.createdAt?.toDate 
              ? data.createdAt.toDate().toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0]),
          };
        });
        setEntries(postsData);
        setIsLoadingEntries(false);
      },
      (error) => {
        setIsLoadingEntries(false);
        try {
          handleFirestoreError(error, OperationType.LIST, "plant_journal");
        } catch (err) {
          console.error("Firestore plant_journal error: ", err);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Save to localStorage as backup/cache
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem("plant_journal_entries_v3", JSON.stringify(entries));
    }
  }, [entries]);

  const [formParams, setFormParams] = useState({
    title: "",
    content: "",
    image: "",
    tags: "",
    type: "Balcony Garden",
    date: new Date().toISOString().split("T")[0],
    weather: "sun",
    activity: "observation",
  });

  const openForm = (entry?: any) => {
    if (entry) {
      setEditingId(entry.id);
      setFormParams({
        title: entry.title,
        content: entry.content,
        image: entry.image,
        tags: entry.tags.join(", "),
        type: entry.type,
        date: entry.date,
        weather: entry.weather || "sun",
        activity: entry.activity || "observation",
      });
    } else {
      setEditingId(null);
      setFormParams({
        title: "",
        content: "",
        image: "",
        tags: "",
        type: "Balcony Garden",
        date: new Date().toISOString().split("T")[0],
        weather: "sun",
        activity: "observation",
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  // Direct file upload handler via Firebase Storage with 10s Timeout & Base64 Fallback
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!storage) {
      alert("Firebase Storage 설정이 완료되지 않았습니다.");
      return;
    }

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `plants/${Date.now()}_${file.name}`);
      
      // 10-second timeout promise
      const uploadPromise = uploadBytes(storageRef, file);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout (10 seconds Limit exceeded)")), 10000)
      );

      // Race them!
      const snapshot = await Promise.race([uploadPromise, timeoutPromise]);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setFormParams({ ...formParams, image: downloadURL });
      alert("이미지가 파이어베이스 스토리지에 성공적으로 업로드되었습니다!");
    } catch (err: any) {
      console.warn("Storage upload failed/timed out, falling back to local Base64. Error:", err);
      
      // Read file as Base64 data URL fallback
      try {
        const base64Url = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (e) => reject(e);
        });
        setFormParams({ ...formParams, image: base64Url });
        alert(
          "안내: 파이어베이스 스토리지 업로드(CORS 또는 버킷 주소 불일치 등)가 실패하여, 브라우저 로컬 이미지(Base64) 데이터로 임시 자동 전환하여 적용했습니다.\n\n" +
          "💡 세팅하신 스토리지 버킷 '" + ((import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || "미지정") + "' 주소가 파이어베이스 콘솔 Storage 탭의 실제 주소(예: home-page-1-b923f.appspot.com 또는 home-page-1-b923f.firebasestorage.app)와 100% 일치하는지 꼭 확인하고, Secrets 탭에서 다시 저장 후 'Apply changes' 해주세요!"
        );
      } catch (fallbackErr) {
        alert("이미지 처리 실패: " + err.message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formParams.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!formParams.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const newTags = formParams.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const dataToSave = {
      title: formParams.title,
      content: formParams.content,
      image: formParams.image || PRESET_IMAGES[Math.floor(Math.random() * PRESET_IMAGES.length)],
      tags: newTags,
      type: formParams.type,
      date: formParams.date,
      weather: formParams.weather,
      activity: formParams.activity,
      updatedAt: serverTimestamp(),
    };

    setIsSaving(true);
    try {
      if (editingId) {
        if (db) {
          try {
            await updateDoc(doc(db, "plant_journal", String(editingId)), dataToSave);
          } catch (dbErr) {
            handleFirestoreError(dbErr, OperationType.UPDATE, `plant_journal/${editingId}`);
          }
        } else {
          setEntries(
            entries.map((e: any) =>
              e.id === editingId
                ? {
                    ...e,
                    ...dataToSave,
                  }
                : e
            )
          );
        }
      } else {
        const newData = {
          ...dataToSave,
          createdAt: serverTimestamp(),
        };
        if (db) {
          try {
            await addDoc(collection(db, "plant_journal"), newData);
          } catch (dbErr) {
            handleFirestoreError(dbErr, OperationType.CREATE, "plant_journal");
          }
        } else {
          const localEntry = {
            id: Date.now(),
            ...newData,
          };
          setEntries([localEntry, ...entries]);
        }
      }
      closeForm();
    } catch (error: any) {
      console.error("Error saving plant journal entry: ", error);
      alert("작성 실패: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm("정말로 이 정원 일지를 삭제하시겠습니까?")) return;
    try {
      if (db && typeof id === "string") {
        try {
          await deleteDoc(doc(db, "plant_journal", id));
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.DELETE, `plant_journal/${id}`);
        }
      } else {
        setEntries(entries.filter((e: any) => e.id !== id));
      }
    } catch (err: any) {
      console.error(err);
      alert("삭제 실패!");
    }
  };

  const handleImageRandomize = () => {
    const randomImg =
      PRESET_IMAGES[Math.floor(Math.random() * PRESET_IMAGES.length)];
    setFormParams({ ...formParams, image: randomImg });
  };

  const filteredEntries = entries
    .filter((e: any) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.tags.some((t: string) =>
          t.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchesActivity = filterActivity
        ? e.activity === filterActivity
        : true;
      return matchesSearch && matchesActivity;
    })
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

  const WeatherIcon = ({ weather }: { weather: string }) => {
    const option =
      WEATHER_OPTIONS.find((w) => w.id === weather) || WEATHER_OPTIONS[0];
    const Icon = option.icon;
    return <Icon className="w-4 h-4" />;
  };

  const ActivityIcon = ({ activity }: { activity: string }) => {
    const option =
      ACTIVITY_OPTIONS.find((a) => a.id === activity) || ACTIVITY_OPTIONS[0];
    const Icon = option.icon;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="animate-in fade-in duration-700 min-h-screen pb-24 overflow-x-hidden">
      {/* Hero Header */}
      <section className="relative px-6 pt-12 md:pt-20 pb-16 flex flex-col items-center text-center max-w-4xl mx-auto">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#5D7964]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] bg-gradient-to-br from-[#5D7964]/20 to-[#5D7964]/5 text-[#5D7964] flex items-center justify-center border border-[#5D7964]/20 shadow-sm shadow-[#5D7964]/10 mb-6"
        >
          <Sprout className="w-8 h-8 md:w-10 md:h-10" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-on-surface mb-6 leading-tight"
        >
          마음이 머무는 <br className="md:hidden" /> 푸른 아카이브
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-on-surface-variant/90 font-medium max-w-2xl leading-relaxed mb-10"
        >
          조용히 피어나는 일상 속 반려 식물의 숨결.<br className="hidden md:block" />
          시간의 흐름에 따라 변화하는 나만의 관찰 일지를 기록하세요.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          onClick={() => openForm()}
          className="bg-[#5D7964] text-white px-8 py-5 rounded-full font-bold hover:bg-[#4a6351] transition-all flex items-center justify-center gap-3 shadow-[0_8px_24px_rgba(93,121,100,0.3)] hover:shadow-[0_12px_32px_rgba(93,121,100,0.4)] hover:-translate-y-1 w-full sm:w-auto min-w-[240px] text-lg"
        >
          <PenSquare className="w-5 h-5" /> 새 추억 기록하기
        </motion.button>
      </section>

      {/* Sticky Tool & Filter Bar */}
      <div className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-y border-outline/10 shadow-sm py-4 px-4 lg:px-8 mb-8 mt-4 transition-all w-full">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
            <input
              type="text"
              placeholder="일지 내용, 태그 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline/20 focus:border-[#5D7964]/50 focus:ring-2 focus:ring-[#5D7964]/20 rounded-full py-2.5 pl-12 pr-4 text-sm font-medium transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar scroll-smooth">
            <button
              onClick={() => setFilterActivity(null)}
              className={`px-5 py-2.5 whitespace-nowrap rounded-full text-sm font-bold transition-all ${!filterActivity ? "bg-[#5D7964] text-white shadow-md shadow-[#5D7964]/20" : "bg-transparent text-on-surface-variant hover:bg-surface-dim border border-outline/10"}`}
            >
              전체 보기
            </button>
            {ACTIVITY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFilterActivity(opt.id)}
                className={`px-5 py-2.5 whitespace-nowrap flex items-center gap-2 rounded-full text-sm font-bold transition-all ${filterActivity === opt.id ? "bg-[#5D7964] text-white shadow-md shadow-[#5D7964]/20" : "bg-transparent text-on-surface-variant hover:bg-surface-dim border border-outline/10"}`}
              >
                <opt.icon className="w-4 h-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-on-surface/40 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-surface border border-outline/20 w-full max-w-2xl rounded-2xl p-5 md:p-8 shadow-2xl relative my-auto box-border"
            >
              <button
                onClick={closeForm}
                className="absolute top-6 right-6 p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-dim/30 rounded-xl transition-colors z-10 bg-surface/50 backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl md:text-3xl font-display font-bold text-on-surface mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5D7964]/10 text-[#5D7964] flex items-center justify-center border border-[#5D7964]/20">
                  {editingId ? (
                    <Edit3 className="w-5 h-5" />
                  ) : (
                    <PenSquare className="w-5 h-5" />
                  )}
                </div>
                {editingId ? "일기 수정하기" : "새 일기 작성하기"}
              </h3>

              <div className="space-y-8">
                {/* Image Section */}
                <div>
                  <span className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                    Cover Image
                  </span>
                  <div className="relative w-full h-56 bg-surface-dim border border-outline/30 rounded-xl overflow-hidden group shadow-inner">
                    {formParams.image ? (
                      <img
                        src={formParams.image}
                        alt="커버 이미지 미리보기"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-outline-variant flex-col gap-3">
                        <ImageIcon className="w-10 h-10" />
                        <span className="text-sm font-semibold">
                          커버 이미지를 선택해주세요
                        </span>
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-on-surface/50 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-white z-20">
                        <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-bold tracking-wider animate-pulse">이미지 업로드 중...</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-on-surface/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm z-10">
                      <button
                        type="button"
                        onClick={handleImageRandomize}
                        className="px-6 py-3 bg-white text-on-surface hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg text-sm hover:scale-105 active:scale-95 border border-transparent"
                      >
                        <Upload className="w-4 h-4" /> 샘플 바꾸기
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Device Upload */}
                    <label className="flex items-center justify-center p-4 border border-outline/20 bg-white rounded-2xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 cursor-pointer transition-all duration-300 ease-out hover:shadow-md hover:scale-[1.02] active:scale-[0.98] gap-3 text-sm font-semibold text-on-surface-variant shadow-sm w-full">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="hidden" 
                        disabled={isUploading}
                      />
                      <Upload className="w-5 h-5" />
                      <span>컴퓨터 / 스마트폰 사진 올리기</span>
                    </label>

                    {/* Image URL Manual input */}
                    <input
                      type="url"
                      value={formParams.image}
                      onChange={(e) => setFormParams({...formParams, image: e.target.value})}
                      placeholder="이미지 주소(URL)를 직접 입력하셔도 됩니다"
                      className="w-full input-field text-xs font-medium"
                    />
                  </div>
                </div>

                {/* Date & Title */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-1/3">
                    <label
                      htmlFor="journal-date"
                      className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-3"
                    >
                      Date
                    </label>
                    <input
                      id="journal-date"
                      type="date"
                      value={formParams.date}
                      onChange={(e) =>
                        setFormParams({ ...formParams, date: e.target.value })
                      }
                      className="w-full input-field font-semibold text-[15px]"
                    />
                  </div>
                  <div className="w-full sm:w-2/3">
                    <label
                      htmlFor="journal-title"
                      className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-3"
                    >
                      Title
                    </label>
                    <input
                      id="journal-title"
                      type="text"
                      value={formParams.title}
                      onChange={(e) =>
                        setFormParams({ ...formParams, title: e.target.value })
                      }
                      placeholder="제목을 입력하세요"
                      className="w-full input-field font-semibold text-[15px]"
                    />
                  </div>
                </div>

                {/* Weather & Activity row */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-1/2">
                    <span className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                      Weather
                    </span>
                    <div
                      className="flex gap-2"
                      role="group"
                      aria-label="날씨 선택"
                    >
                      {WEATHER_OPTIONS.map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          aria-pressed={formParams.weather === w.id}
                          onClick={() =>
                            setFormParams({ ...formParams, weather: w.id })
                          }
                          className={`flex-1 py-3 border rounded-lg flex items-center justify-center gap-2 transition-all font-bold shadow-sm ${formParams.weather === w.id ? "bg-[#5D7964] border-[#5D7964] text-white shadow-[#5D7964]/20" : "bg-surface-container-lowest border-outline/30 text-on-surface-variant hover:border-[#5D7964]/30 hover:text-[#5D7964]"}`}
                        >
                          <w.icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{w.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <span className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                      Activity
                    </span>
                    <div
                      className="grid grid-cols-2 gap-2"
                      role="group"
                      aria-label="활동 상태 선택"
                    >
                      {ACTIVITY_OPTIONS.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          aria-pressed={formParams.activity === a.id}
                          onClick={() =>
                            setFormParams({ ...formParams, activity: a.id })
                          }
                          className={`py-2 px-1 border rounded-lg flex items-center justify-center gap-2 transition-all font-bold text-xs shadow-sm ${formParams.activity === a.id ? "bg-[#5D7964] border-[#5D7964] text-white shadow-[#5D7964]/20" : "bg-surface-container-lowest border-outline/30 text-on-surface-variant hover:border-[#5D7964]/30 hover:text-[#5D7964]"}`}
                        >
                          <a.icon className="w-3.5 h-3.5" />
                          <span>{a.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label
                    htmlFor="journal-story"
                    className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-3"
                  >
                    Story
                  </label>
                  <textarea
                    id="journal-story"
                    value={formParams.content}
                    onChange={(e) =>
                      setFormParams({ ...formParams, content: e.target.value })
                    }
                    placeholder="어떤 일들이 있었나요?"
                    className="w-full input-field h-40 resize-none font-medium leading-relaxed"
                  />
                </div>

                {/* Tags & Type */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="journal-tags"
                      className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-3"
                    >
                      Tags
                    </label>
                    <input
                      id="journal-tags"
                      type="text"
                      value={formParams.tags}
                      onChange={(e) =>
                        setFormParams({ ...formParams, tags: e.target.value })
                      }
                      placeholder="콤마(,)로 구분 (예: 상추, 거름)"
                      className="w-full input-field font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="journal-type"
                      className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-3"
                    >
                      Garden Type
                    </label>
                    <input
                      id="journal-type"
                      type="text"
                      value={formParams.type}
                      onChange={(e) =>
                        setFormParams({ ...formParams, type: e.target.value })
                      }
                      placeholder="장소 타입"
                      className="w-full input-field font-medium text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-outline/20 flex justify-end gap-3">
                <button
                  onClick={closeForm}
                  className="px-6 py-4 rounded-full font-semibold text-lg transition-all duration-300 ease-out hover:bg-gray-100 hover:scale-105 active:scale-95 border border-transparent hover:border-gray-200 text-on-surface-variant hover:text-on-surface"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || isUploading || !formParams.title.trim() || !formParams.content.trim()}
                  className={`px-8 py-4 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 ease-out flex items-center justify-center gap-2 shadow-sm border w-full sm:w-auto ${
                    isSaving || isUploading || !formParams.title.trim() || !formParams.content.trim()
                      ? "bg-surface-dim text-outline-variant cursor-not-allowed border-outline/20"
                      : "bg-white text-on-surface hover:bg-blue-50 hover:text-blue-600 hover:scale-105 active:scale-95 border-outline/20 hover:border-blue-200 hover:shadow-md"
                  }`}
                >
                  {isSaving || isUploading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : null}
                  {isUploading 
                    ? "이미지 업로드 중..." 
                    : isSaving 
                      ? (editingId ? "수정 중..." : "저장 중...") 
                      : (editingId ? "수정 저장하기" : "저장하기")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feed Area */}
      <div className="max-w-5xl mx-auto px-4 lg:px-8 space-y-12 mt-8 relative">
        <AnimatePresence>
          {filteredEntries.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-32 bg-surface-container-lowest border border-outline/10 rounded-[2rem] shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#5D7964]/5 rounded-full blur-3xl pointer-events-none" />
              <Sprout className="w-20 h-20 text-[#5D7964]/30 mx-auto mb-6 relative z-10 animate-bounce" />
              <p className="text-on-surface font-display font-extrabold text-3xl relative z-10 tracking-tight mb-4">
                기다림의 공간이 비어있습니다
              </p>
              <p className="text-on-surface-variant font-medium text-lg relative z-10 max-w-md mx-auto">
                첫 번째 잎사귀가 돋아날 시간입니다. 
                당신의 정원에 새로운 생명의 흔적을 남겨주세요.
              </p>
            </motion.div>
          )}

          {filteredEntries.map((entry: any) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
              className="bg-surface rounded-[2rem] relative overflow-hidden group border border-outline/10 flex flex-col md:flex-row gap-0 shadow-sm hover:shadow-2xl hover:shadow-[#5D7964]/10 hover:-translate-y-1 transition-all duration-500"
            >
              <div className="relative z-10 w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-between order-2 md:order-1">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-[#5D7964] text-sm font-bold tracking-widest uppercase bg-[#5D7964]/10 px-4 py-1.5 rounded-full border border-[#5D7964]/20 backdrop-blur-sm">
                      {entry.date.replace(/-/g, ". ")}
                    </span>
                    <div className="flex items-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 lg:translate-x-4 group-hover:translate-x-0">
                      <button
                        onClick={() => openForm(entry)}
                        className="p-3 bg-surface hover:bg-surface-dim border border-outline/10 text-on-surface-variant hover:text-[#5D7964] transition-colors rounded-full shadow-sm hover:shadow-md"
                        title="수정"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-3 bg-surface hover:bg-[#ba1a1a]/10 border border-outline/10 text-on-surface-variant hover:text-[#ba1a1a] hover:border-[#ba1a1a]/20 transition-colors rounded-full shadow-sm hover:shadow-md"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-on-surface mb-6 leading-tight max-w-[95%] break-words tracking-tight">
                    {entry.title}
                  </h3>

                  <div className="prose prose-p:leading-relaxed prose-p:text-on-surface-variant max-w-none text-base md:text-lg whitespace-pre-wrap break-words font-medium">
                    {entry.content}
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-outline/20">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center divide-x divide-outline/30">
                      {entry.weather && (
                        <span className="inline-flex items-center gap-2 pr-4 text-on-surface-variant text-sm font-bold tracking-wide">
                          <WeatherIcon weather={entry.weather} />
                          {
                            WEATHER_OPTIONS.find((w) => w.id === entry.weather)
                              ?.label
                          }
                        </span>
                      )}
                      {entry.activity && (
                        <span className="inline-flex items-center gap-2 pl-4 text-on-surface-variant text-sm font-bold tracking-wide">
                          <ActivityIcon activity={entry.activity} />
                          <span>
                            {
                              ACTIVITY_OPTIONS.find(
                                (a) => a.id === entry.activity,
                              )?.label
                            }
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface-container-lowest border border-outline/20 text-on-surface-variant rounded-md text-xs font-bold whitespace-nowrap shadow-sm">
                        <Leaf className="w-3.5 h-3.5 text-[#5D7964]" />{" "}
                        {entry.type}
                      </span>
                      <div className="flex gap-2 flex-wrap justify-end">
                        {entry.tags?.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs font-mono font-semibold text-[#5D7964] block bg-[#5D7964]/5 px-2 py-0.5 rounded border border-[#5D7964]/10"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="w-full md:w-2/5 order-1 md:order-2 bg-surface-dim border-b md:border-b-0 md:border-l border-outline/10 relative">
                <div className="relative w-full h-[300px] md:h-[420px] lg:h-full lg:min-h-[420px] overflow-hidden">
                  <img
                    src={entry.image}
                    alt={`${entry.title} 이미지`}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    className="w-full h-full object-cover group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-1000 ease-out brightness-95 group-hover:brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent pointer-events-none opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
