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

  // Direct file upload handler via Firebase Storage
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
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setFormParams({ ...formParams, image: downloadURL });
    } catch (err: any) {
      console.error(err);
      alert("업로드 중 오류 발생: " + err.message);
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
    <div className="p-4 lg:p-6 space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-outline/20 pb-6 mt-4">
        <div className="space-y-4 w-full">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-on-surface flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#5D7964]/10 text-[#5D7964] flex items-center justify-center border border-[#5D7964]/20 shadow-sm md:w-14 md:h-14">
                <Sprout className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              디지털 정원
            </h1>
            <p className="text-on-surface-variant font-medium mt-3">
              나만의 정원 스토리를 자유롭게 기록하고 관리하세요.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-2xl mt-4">
            <div className="relative w-full">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              <input
                type="text"
                placeholder="일지 내용, 태그 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full input-field !pl-12 font-medium"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 sm:pb-0 hide-scrollbar scroll-smooth p-1">
              <button
                onClick={() => setFilterActivity(null)}
                className={`px-4 py-2 whitespace-nowrap rounded-lg text-sm font-bold transition-all shadow-sm ${!filterActivity ? "bg-[#5D7964] text-white" : "bg-surface border border-outline/30 text-on-surface-variant hover:border-[#5D7964]/30 hover:text-[#5D7964]"}`}
              >
                전체
              </button>
              {ACTIVITY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFilterActivity(opt.id)}
                  className={`px-4 py-2 whitespace-nowrap flex items-center gap-2 rounded-lg text-sm font-bold transition-all shadow-sm ${filterActivity === opt.id ? "bg-[#5D7964] text-white" : "bg-surface border border-outline/30 text-on-surface-variant hover:border-[#5D7964]/30 hover:text-[#5D7964]"}`}
                >
                  <opt.icon className="w-4 h-4" />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => openForm()}
          className="bg-[#5D7964] text-white px-8 py-3 rounded-lg font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(93,121,100,0.3)] shrink-0 w-full sm:w-auto h-12"
        >
          <PenSquare className="w-4 h-4" />새 일기 작성
        </button>
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
                  <div className="relative w-full h-56 bg-surface-container-lowest border border-outline/30 rounded-xl overflow-hidden group shadow-inner">
                    {formParams.image ? (
                      <img
                        src={formParams.image}
                        alt="커버 이미지 미리보기"
                        loading="lazy"
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
                        className="px-5 py-2.5 bg-surface hover:bg-surface-dim text-on-surface rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg text-xs"
                      >
                        <Upload className="w-4 h-4" /> 샘플 바꾸기
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Device Upload */}
                    <label className="flex items-center justify-center p-3 border border-dashed border-outline/30 rounded-xl hover:bg-[#5D7964]/5 hover:border-[#5D7964]/50 cursor-pointer transition-all gap-2 text-xs font-bold text-on-surface-variant hover:text-[#5D7964]">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="hidden" 
                        disabled={isUploading}
                      />
                      <Upload className="w-4 h-4" />
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
                  className="px-6 py-3 rounded-lg font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-dim/30 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  disabled={!formParams.title.trim() || !formParams.content.trim()}
                  className={`px-8 py-3 rounded-lg font-bold transition-all shadow-md ${
                    !formParams.title.trim() || !formParams.content.trim()
                      ? "bg-surface-dim text-outline-variant cursor-not-allowed"
                      : "bg-[#5D7964] text-white hover:brightness-110"
                  }`}
                >
                  저장하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feed Area */}
      <div className="space-y-12 mt-8">
        <AnimatePresence>
          {filteredEntries.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 bg-surface border border-outline/20 rounded-2xl border-dashed"
            >
              <Sprout className="w-16 h-16 text-[#5D7964]/40 mx-auto mb-6" />
              <p className="text-on-surface font-display font-bold text-2xl">
                해당 조건에 맞는 일지가 없습니다.
              </p>
              <p className="text-on-surface-variant font-medium text-lg mt-3">
                새로운 생명의 성장을 기록하거나 검색 조건을 변경해보세요.
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
              className="card bg-surface p-0 relative overflow-hidden group border border-outline/20 flex flex-col md:flex-row gap-0"
            >
              <div className="relative z-10 w-full md:w-3/5 p-6 md:p-10 flex flex-col justify-between order-2 md:order-1">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-[#5D7964] text-sm font-bold tracking-widest uppercase bg-[#5D7964]/10 px-3 py-1 rounded-full border border-[#5D7964]/20">
                      {entry.date.replace(/-/g, ". ")}
                    </span>
                    <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openForm(entry)}
                        className="p-2.5 bg-surface-container-lowest hover:bg-surface-dim border border-outline/20 text-on-surface-variant rounded-lg transition-colors shadow-sm"
                        title="수정"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-2.5 bg-surface-container-lowest hover:bg-[#ba1a1a]/10 border border-outline/20 text-on-surface-variant hover:text-[#ba1a1a] hover:border-[#ba1a1a]/20 rounded-lg transition-colors shadow-sm"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-4xl font-display font-bold text-on-surface mb-6 leading-tight max-w-[95%] break-words tracking-tight">
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
              <div className="w-full md:w-2/5 order-1 md:order-2 bg-surface-container-lowest border-b md:border-b-0 md:border-l border-outline/20">
                <div className="relative w-full h-[300px] md:h-full md:min-h-[400px] overflow-hidden">
                  <img
                    src={entry.image}
                    alt={`${entry.title} 이미지`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-700 brightness-95 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none md:hidden" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
