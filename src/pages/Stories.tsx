


import ImageWithFallback from "../components/ImageWithFallback";
import { toast } from "../components/Toast";
import {
  PenSquare,
  Image as ImageIcon,
  Send,
  Heart,
  Share2,
  MoreHorizontal,
  BookOpen,
  Coffee,
  Feather,
  Book,
  Trash2,
  Eye,
  Edit3,
  Save,
  X,
  Upload,
  Globe,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import { useClickOutside } from "../hooks/useClickOutside";
import { db, storage, auth, handleFirestoreError, OperationType } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
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
import { compressAndConvertImage } from "../utils/imageCompressor";

const CATEGORIES = [
  { id: "전체", icon: BookOpen, label: "전체 보기" },
  { id: "일기", icon: Coffee, label: "일기" },
  { id: "칼럼", icon: PenSquare, label: "칼럼" },
  { id: "소설", icon: Book, label: "소설" },
  { id: "이야기", icon: Feather, label: "이야기" },
];

export interface StoryPost {
  id: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  date: string;
  idea?: string;
  worldview?: string;
  chronology?: string;
  characters?: string;
  episodes?: string;
  prompt?: string;
  status?: string;
  image?: string;
  image2?: string;
  images?: string[];
  [key: string]: any;
}

const MOCK_POSTS: StoryPost[] = [];

const PostItem = ({
  post,
  handleEdit,
  handleDelete,
  handleLike,
  isAdmin,
}: {
  post: StoryPost;
  handleEdit: (post: StoryPost) => void;
  handleDelete: (id: string) => void;
  handleLike: (id: string) => void;
  isAdmin: boolean;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showWorldbuilding, setShowWorldbuilding] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const hasWorldbuilding = post.idea || post.worldview || post.chronology || post.characters || post.episodes || post.prompt;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-surface p-8 md:p-12 group/card shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-500 border border-outline/10 rounded-[2rem] relative overflow-hidden"
    >
      {/* Visual Flair */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none transition-all duration-700 group-hover/card:bg-primary/10 group-hover/card:scale-150" />

      <div className="flex flex-col gap-8 relative z-10">
        {/* Post Header */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase bg-primary/10 text-primary px-4 py-1.5 rounded-full font-bold flex items-center gap-2 border border-primary/20 backdrop-blur-sm tracking-widest">
                {CATEGORIES.find((c) => c.id === post.category)?.icon &&
                  (() => {
                    const Icon = CATEGORIES.find((c) => c.id === post.category)!.icon;
                    return <Icon className="w-3.5 h-3.5" />;
                  })()}
                {post.category}
              </span>
              {post.status && (
                <span className="font-mono text-xs uppercase bg-surface-variant text-on-surface-variant px-4 py-1.5 rounded-full font-bold border border-outline/20 backdrop-blur-sm tracking-widest">
                  {post.status}
                </span>
              )}
              {post.content && (
                <span className="font-mono text-xs uppercase bg-surface-variant/50 text-on-surface-variant px-4 py-1.5 rounded-full font-bold border border-outline/10 backdrop-blur-sm tracking-widest" title="공백 제외 글자수">
                  {post.content.replace(/\s+/g, '').length}자
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 opacity-100 md:opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform md:translate-x-4 group-hover/card:translate-x-0">
              <p className="font-mono text-sm text-on-surface-variant font-bold tracking-wider mr-2">
                {post.date}
              </p>
              {isAdmin && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    aria-label={`${post.title} 추가 메뉴`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="text-on-surface-variant hover:text-primary p-2.5 bg-surface hover:bg-surface-dim rounded-full border border-outline/10 transition-colors shadow-sm hover:shadow-md"
                  >
                    <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-surface rounded-xl shadow-xl border border-outline/10 py-2 z-10 text-on-surface overflow-hidden">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleEdit(post);
                        }}
                        className="w-full text-left px-5 py-3 text-sm text-on-surface-variant hover:text-on-surface hover:bg-primary/5 flex items-center gap-3 font-bold transition-colors"
                      >
                        <Edit3 className="w-4 h-4" aria-hidden="true" /> 수정하기
                      </button>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleDelete(post.id);
                        }}
                        className="w-full text-left px-5 py-3 text-sm text-[#ba1a1a] hover:bg-[#ba1a1a]/10 flex items-center gap-3 font-bold transition-colors"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" /> 삭제하기
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-on-surface mb-4 tracking-tight leading-tight">
            {post.title}
          </h2>
        </div>

        {/* Post Content */}
        <div className="text-on-surface-variant font-medium">
          {(() => {
            const hasFirst = !!post.image;
            const hasSecond = !!post.image2;
            
            if (hasFirst && hasSecond) {
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="relative rounded-2xl overflow-hidden h-[300px] md:h-[400px] bg-surface-dim border border-outline/10 shadow-sm hover:shadow-md transition-shadow duration-500">
                    <ImageWithFallback src={post.image!} alt="첫 번째 이미지" loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" containerClassName="w-full h-full" />
                  </div>
                  <div className="relative rounded-2xl overflow-hidden h-[300px] md:h-[400px] bg-surface-dim border border-outline/10 shadow-sm hover:shadow-md transition-shadow duration-500">
                    <ImageWithFallback src={post.image2!} alt="두 번째 이미지" loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" containerClassName="w-full h-full" />
                  </div>
                </div>
              );
            } else if (hasFirst) {
              return (
                <div className="relative rounded-2xl overflow-hidden max-h-[500px] bg-surface-dim border border-outline/10 mb-8 shadow-sm group-hover/card:shadow-md transition-shadow duration-500">
                  <ImageWithFallback src={post.image} alt="게시물 표지 이미지" loading="lazy" decoding="async" fetchPriority="low" className="w-full object-cover h-full min-h-[200px] max-h-[500px]" containerClassName="w-full h-full min-h-[200px] max-h-[500px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent pointer-events-none opacity-50 group-hover/card:opacity-0 transition-opacity duration-500" />
                </div>
              );
            } else if (hasSecond) {
              return (
                <div className="relative rounded-2xl overflow-hidden max-h-[500px] bg-surface-dim border border-outline/10 mb-8 shadow-sm group-hover/card:shadow-md transition-shadow duration-500">
                  <ImageWithFallback src={post.image2!} alt="게시물 이미지" loading="lazy" decoding="async" fetchPriority="low" className="w-full object-cover h-full min-h-[200px] max-h-[500px]" containerClassName="w-full h-full min-h-[200px] max-h-[500px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent pointer-events-none opacity-50 group-hover/card:opacity-0 transition-opacity duration-500" />
                </div>
              );
            }
            return null;
          })()}
          <div className="prose prose-base md:prose-lg max-w-none prose-p:leading-loose prose-h1:font-display prose-headings:font-bold prose-headings:text-on-surface prose-strong:text-primary">
            <Markdown>{post.content}</Markdown>
          </div>
          
          {hasWorldbuilding && (
            <div className="mt-8 border border-outline/20 rounded-2xl bg-surface-container-lowest overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setShowWorldbuilding(!showWorldbuilding)}
                className="w-full flex items-center justify-between p-5 md:p-6 bg-surface-variant/20 hover:bg-surface-variant/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="font-bold text-on-surface text-base">설정 및 세계관 (Worldbuilding)</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-on-surface-variant transition-transform duration-300 ${showWorldbuilding ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {showWorldbuilding && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-outline/10"
                  >
                    <div className="p-5 md:p-6 space-y-6">
                      {post.idea && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-primary flex items-center gap-2 tracking-wide uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> 아이디어
                          </h4>
                          <div className="pl-3.5 border-l-2 border-outline/20 text-on-surface-variant/90 text-sm whitespace-pre-wrap leading-relaxed">
                            {post.idea}
                          </div>
                        </div>
                      )}
                      {post.worldview && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-primary flex items-center gap-2 tracking-wide uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> 설정 및 세계관
                          </h4>
                          <div className="pl-3.5 border-l-2 border-outline/20 text-on-surface-variant/90 text-sm whitespace-pre-wrap leading-relaxed">
                            {post.worldview}
                          </div>
                        </div>
                      )}
                      {post.characters && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-primary flex items-center gap-2 tracking-wide uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> 등장인물
                          </h4>
                          <div className="pl-3.5 border-l-2 border-outline/20 text-on-surface-variant/90 text-sm whitespace-pre-wrap leading-relaxed">
                            {post.characters}
                          </div>
                        </div>
                      )}
                      {post.chronology && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-primary flex items-center gap-2 tracking-wide uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> 연대기
                          </h4>
                          <div className="pl-3.5 border-l-2 border-outline/20 text-on-surface-variant/90 text-sm whitespace-pre-wrap leading-relaxed">
                            {post.chronology}
                          </div>
                        </div>
                      )}
                      {post.episodes && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-primary flex items-center gap-2 tracking-wide uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> 에피소드 메모
                          </h4>
                          <div className="pl-3.5 border-l-2 border-outline/20 text-on-surface-variant/90 text-sm whitespace-pre-wrap leading-relaxed">
                            {post.episodes}
                          </div>
                        </div>
                      )}
                      {post.prompt && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-primary flex items-center gap-2 tracking-wide uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> AI 프롬프트
                          </h4>
                          <div className="pl-3.5 border-l-2 border-outline/20 text-on-surface-variant/90 text-sm font-mono bg-surface-container/50 p-4 rounded-xl whitespace-pre-wrap leading-relaxed border border-outline/5">
                            {post.prompt}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="flex items-center gap-8 pt-8 border-t border-outline/20 text-on-surface-variant font-mono">
          <button
            aria-label="좋아요"
            onClick={() => handleLike(post.id)}
            className="flex items-center gap-2.5 hover:text-[#00C853] transition-colors group"
          >
            <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline/20 group-hover:bg-[#00C853]/10 group-hover:border-[#00C853]/30 transition-colors shadow-sm">
              <Heart
                className="w-5 h-5 group-hover:scale-110 transition-transform group-hover:fill-[#00C853]/20"
                aria-hidden="true"
              />
            </div>
            <span className="text-sm font-bold">{post.likes}</span>
          </button>
          <button
            aria-label="내용 복사하기"
            onClick={() => {
              navigator.clipboard.writeText(post.content);
              toast.error("내용이 클립보드에 복사되었습니다.");
            }}
            className="flex items-center gap-2 hover:text-primary transition-colors group"
            title="소설 내용 복사하기"
          >
            <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline/20 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors shadow-sm">
              <BookOpen className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="text-sm font-bold hidden sm:inline">내용 복사</span>
          </button>
          <button
            aria-label="공유하기"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.error("링크가 복사되었습니다.");
            }}
            className="flex items-center gap-2 hover:text-primary transition-colors group"
          >
            <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline/20 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors shadow-sm">
              <Share2 className="w-5 h-5" aria-hidden="true" />
            </div>
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default function Stories() {
  const [newTitle, setNewTitle] = useState(
    () => localStorage.getItem("story_draft_title") || "",
  );
  const [newPost, setNewPost] = useState(
    () => localStorage.getItem("story_draft_content") || "",
  );
  const [newIdea, setNewIdea] = useState(
    () => localStorage.getItem("story_draft_idea") || "",
  );
  const [newWorldview, setNewWorldview] = useState(
    () => localStorage.getItem("story_draft_worldview") || "",
  );
  const [newChronology, setNewChronology] = useState(
    () => localStorage.getItem("story_draft_chronology") || "",
  );
  const [newCharacters, setNewCharacters] = useState(
    () => localStorage.getItem("story_draft_characters") || "",
  );
  const [newEpisodes, setNewEpisodes] = useState(
    () => localStorage.getItem("story_draft_episodes") || "",
  );
  const [newPrompt, setNewPrompt] = useState(
    () => localStorage.getItem("story_draft_prompt") || "",
  );
  const [newStatus, setNewStatus] = useState(
    () => localStorage.getItem("story_draft_status") || "구상 중",
  );
  const [selectedCategory, setSelectedCategory] = useState("일기");
  const [activeFilter, setActiveFilter] = useState("전체");
  const [isPreview, setIsPreview] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newImage, setNewImage] = useState(
    () => localStorage.getItem("story_draft_image") || "",
  );
  const [newImage2, setNewImage2] = useState(
    () => localStorage.getItem("story_draft_image2") || "",
  );
  const [showImageInput, setShowImageInput] = useState(false);
  const [showSettingsInput, setShowSettingsInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Firestore Feed Integration
  const [feed, setFeed] = useState<StoryPost[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin login status
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && (user.uid === "w02kvOK1b0SiPGgmQRX3g34ArSt2" || user.email === "diopacific1@gmail.com")) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db) {
      // Offline fallback / Config missing fallback
      const saved = localStorage.getItem("personal_writings_v3");
      if (saved) {
        try {
          setFeed(JSON.parse(saved));
        } catch (e) {
          setFeed([]);
        }
      }
      setIsLoadingFeed(false);
      return;
    }

    const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.createdAt?.toDate 
              ? data.createdAt.toDate().toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }).replace(/-/g, ". ")
              : data.date || "방금 전",
          };
        });
        setFeed(postsData as any);
        setIsLoadingFeed(false);
      },
      (error) => {
        setIsLoadingFeed(false);
        try {
          handleFirestoreError(error, OperationType.LIST, "stories");
        } catch (err) {
          console.error("Firestore onSnapshot error:", err);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Save feed to local storage as fallback/cache if offline
  useEffect(() => {
    if (feed.length > 0) {
      localStorage.setItem("personal_writings_v3", JSON.stringify(feed));
    }
  }, [feed]);

  // Save draft to local storage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("story_draft_title", newTitle);
      localStorage.setItem("story_draft_content", newPost);
      localStorage.setItem("story_draft_idea", newIdea);
      localStorage.setItem("story_draft_worldview", newWorldview);
      localStorage.setItem("story_draft_chronology", newChronology);
      localStorage.setItem("story_draft_characters", newCharacters);
      localStorage.setItem("story_draft_episodes", newEpisodes);
      localStorage.setItem("story_draft_prompt", newPrompt);
      localStorage.setItem("story_draft_status", newStatus);
      if (newImage) localStorage.setItem("story_draft_image", newImage);
      if (newImage2) localStorage.setItem("story_draft_image2", newImage2);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [newTitle, newPost, newImage, newImage2, newIdea, newWorldview, newChronology, newCharacters, newEpisodes, newPrompt, newStatus]);

  
  // Direct file upload handler via Firebase Storage with 10s Timeout & Base64 Fallback
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setIsUploading(true);
    
    // If firebase storage is not available, immediately fall back to local Base64
    if (!storage) {
      toast.info(`스토리지 미설정으로 이미지 ${slot}을 로컬 데이터로 처리합니다.`);
      try {
        const file = await compressAndConvertImage(rawFile);
        const base64Url = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (e) => reject(e);
        });
        if (slot === 1) {
          setNewImage(base64Url);
        } else {
          setNewImage2(base64Url);
        }
        toast.success(`이미지 ${slot}이(가) 로컬 데이터로 준비되었습니다!`);
      } catch (fallbackErr) {
        toast.error("이미지 처리 실패: " + (fallbackErr as any).message);
      } finally {
        setIsUploading(false);
      }
      return;
    }

    toast.info(`이미지 ${slot} 업로드를 시작합니다...`);
    try {
      // Compress and convert image (HEIC handling & Resizing to max 1600px, JPEG compression)
      const file = await compressAndConvertImage(rawFile);
      const storageRef = ref(storage, `stories/${Date.now()}_${file.name}`);
      
      // 10-second timeout promise
      const uploadPromise = uploadBytes(storageRef, file);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout (10 seconds Limit exceeded)")), 10000)
      );

      // Race them!
      const snapshot = await Promise.race([uploadPromise, timeoutPromise]);
      const downloadURL = await getDownloadURL(snapshot.ref);
      if (slot === 1) {
        setNewImage(downloadURL);
      } else {
        setNewImage2(downloadURL);
      }
      toast.success(`이미지 ${slot}이(가) 성공적으로 업로드되었습니다!`);
    } catch (err: unknown) {
      console.warn("Storage upload failed/timed out, falling back to local Base64. Error:", err);
      
      // Read file as Base64 data URL fallback
      try {
        const file = await compressAndConvertImage(rawFile);
        const base64Url = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (e) => reject(e);
        });
        if (slot === 1) {
          setNewImage(base64Url);
        } else {
          setNewImage2(base64Url);
        }
        toast.info("업로드가 지연되어 브라우저 로컬 이미지로 대체 준비했습니다.");
      } catch (fallbackErr) {
        toast.error("이미지 처리 실패: " + (fallbackErr as any).message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handlePost = async () => {
    if (!newPost.trim() || !newTitle.trim()) {
      toast.error("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        if (db) {
          const postRef = doc(db, "stories", String(editingId));
          try {
            await updateDoc(postRef, {
              title: newTitle,
              content: newPost,
              idea: newIdea,
              worldview: newWorldview,
              chronology: newChronology,
              characters: newCharacters,
              episodes: newEpisodes,
              prompt: newPrompt,
              status: newStatus,
              category: selectedCategory,
              image: newImage,
              image2: newImage2 || "",
              images: [newImage, newImage2].filter(Boolean),
              updatedAt: serverTimestamp(),
            });
          } catch (dbErr) {
            handleFirestoreError(dbErr, OperationType.UPDATE, `stories/${editingId}`);
          }
        } else {
          setFeed(
            feed.map((p) =>
              p.id === editingId
                ? {
                    ...p,
                    title: newTitle,
                    content: newPost,
                    idea: newIdea,
                    worldview: newWorldview,
                    chronology: newChronology,
                    characters: newCharacters,
                    episodes: newEpisodes,
                    prompt: newPrompt,
                    status: newStatus,
                    category: selectedCategory,
                    image: newImage,
                    image2: newImage2 || "",
                    images: [newImage, newImage2].filter(Boolean),
                  }
                : p
            )
          );
        }
        setEditingId(null);
        toast.success("기록이 수정되었습니다.");
      } else {
        const postData = {
          category: selectedCategory,
          title: newTitle,
          content: newPost,
          idea: newIdea,
          worldview: newWorldview,
          chronology: newChronology,
          characters: newCharacters,
          episodes: newEpisodes,
          prompt: newPrompt,
          status: newStatus,
          likes: 0,
          image: newImage,
          image2: newImage2 || "",
          images: [newImage, newImage2].filter(Boolean),
          createdAt: serverTimestamp(),
        };

        if (db) {
          try {
            await addDoc(collection(db, "stories"), postData);
          } catch (dbErr) {
            handleFirestoreError(dbErr, OperationType.CREATE, "stories");
          }
        } else {
          const localPost = {
            id: String(Date.now()),
            ...postData,
            date: new Date()
              .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/-/g, ". "),
          };
          setFeed([localPost, ...feed]);
        }
        toast.success("새로운 세계가 기록되었습니다.");
      }

      setNewTitle("");
      setNewPost("");
      setNewIdea("");
      setNewWorldview("");
      setNewChronology("");
      setNewCharacters("");
      setNewEpisodes("");
      setNewPrompt("");
      setNewStatus("구상 중");
      setNewImage("");
      setNewImage2("");
      setIsPreview(false);
      setShowImageInput(false);
      setShowSettingsInput(false);
      localStorage.removeItem("story_draft_title");
      localStorage.removeItem("story_draft_content");
      localStorage.removeItem("story_draft_idea");
      localStorage.removeItem("story_draft_worldview");
      localStorage.removeItem("story_draft_chronology");
      localStorage.removeItem("story_draft_characters");
      localStorage.removeItem("story_draft_episodes");
      localStorage.removeItem("story_draft_prompt");
      localStorage.removeItem("story_draft_status");
      localStorage.removeItem("story_draft_image");
      localStorage.removeItem("story_draft_image2");
    } catch (err: Error | unknown) {
      console.error("Post writing error:", err);
      toast.error("글 등록에 실패했습니다: " + (err instanceof Error ? (err as any).message : "알 수 없는 오류"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (post: StoryPost) => {
    setEditingId(post.id);
    setNewTitle(post.title);
    setNewPost(post.content);
    setNewIdea(post.idea || "");
    setNewWorldview(post.worldview || "");
    setNewChronology(post.chronology || "");
    setNewCharacters(post.characters || "");
    setNewEpisodes(post.episodes || "");
    setNewPrompt(post.prompt || "");
    setNewStatus(post.status || "구상 중");
    setNewImage(post.image || "");
    setNewImage2(post.image2 || "");
    setSelectedCategory(post.category);
    setIsPreview(false);
    setShowSettingsInput(!!(post.idea || post.worldview || post.chronology || post.characters || post.episodes || post.prompt));
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("정말로 이 기록을 삭제하시겠습니까?")) return;
    try {
      if (db && typeof id === "string") {
        try {
          await deleteDoc(doc(db, "stories", id));
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.DELETE, `stories/${id}`);
        }
      } else {
        setFeed(feed.filter((p) => p.id !== id));
      }
      setActiveDropdown(null);
      toast.error("기록이 삭제되었습니다.");
    } catch (err: unknown) {
      console.error(err);
      toast.error("삭제 에러가 발생했습니다.");
    }
  };

  const handleLike = async (id: string) => {
    const postToLike = feed.find((p) => p.id === id);
    if (!postToLike) return;

    try {
      if (db && typeof id === "string") {
        const postRef = doc(db, "stories", id);
        try {
          await updateDoc(postRef, {
            likes: (postToLike.likes || 0) + 1,
          });
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.UPDATE, `stories/${id}`);
        }
      } else {
        setFeed(
          feed.map((p) => {
            if (p.id === id) {
              return { ...p, likes: p.likes + 1 };
            }
            return p;
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredFeed = useMemo(() => {
    return activeFilter === "전체"
      ? feed
      : feed.filter((post) => post.category === activeFilter);
  }, [feed, activeFilter]);

  return (
    
      <div className="p-4 lg:py-10 max-w-4xl mx-auto min-h-screen">
      {/* Cinematic Header */}
      <section className="relative px-6 pt-12 md:pt-20 pb-16 flex flex-col items-center text-center max-w-4xl mx-auto border-b border-outline/10 mb-10">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center border border-primary/20 shadow-sm shadow-primary/10 mb-6"
        >
          <Book className="w-8 h-8 md:w-10 md:h-10" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-on-surface mb-6 leading-tight"
        >
          기억의 조각들이 <br className="md:hidden" /> 모이는 곳
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-on-surface-variant/90 font-medium max-w-2xl leading-relaxed mb-4"
        >
          나만의 일상, 생각, 그리고 상상의 나래.<br className="hidden md:block" />
          흘러가는 시간 속 의미 있는 순간들을 하나의 세계로 엮어냅니다.
        </motion.p>
      </section>

      <div className="space-y-10">
        {isAdmin && (
          <div className="bg-surface p-6 md:p-12 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow duration-500 relative overflow-hidden border border-outline/10">
            <div className="mb-8 flex gap-4 overflow-x-auto pb-2 hide-scrollbar items-center justify-between">
            <div className="flex gap-2">
              {CATEGORIES.slice(1).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-sm ${selectedCategory === cat.id ? "bg-primary text-white shadow-primary/20" : "bg-surface-container-lowest text-on-surface-variant border border-outline/20 hover:bg-surface-dim hover:text-on-surface hover:border-outline/40"}`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg text-on-surface-variant border border-outline/20 bg-surface-container-lowest hover:bg-surface-dim hover:text-on-surface transition-colors shrink-0 shadow-sm"
            >
              {isPreview ? (
                <Edit3 className="w-4 h-4 text-primary" />
              ) : (
                <Eye className="w-4 h-4 text-primary" />
              )}
              {isPreview ? "작성하기" : "미리보기"}
            </button>
          </div>

          <div className="space-y-6" role="form" aria-label="기록 작성 양식">
            <label htmlFor="story-title" className="sr-only">
              제목
            </label>
            <input
              id="story-title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full bg-transparent border-b-2 border-outline/20 text-on-surface font-display font-bold text-2xl md:text-4xl focus:outline-none focus:border-primary min-h-[50px] pb-3 placeholder:text-outline-variant transition-all duration-300"
            />
            {isPreview ? (
              <div
                aria-label="마크다운 미리보기"
                className="w-full bg-surface-container-lowest rounded-xl p-6 text-on-surface font-sans text-lg leading-relaxed min-h-[200px] mt-4 border border-outline/20 prose prose-lg prose-headings:text-on-surface prose-p:text-on-surface-variant prose-strong:text-primary max-w-none shadow-inner"
              >
                {newPost.trim() ? (
                  <Markdown>{newPost}</Markdown>
                ) : (
                  <span className="text-outline-variant italic font-medium">
                    내용이 없습니다.
                  </span>
                )}
              </div>
            ) : (
              <>
                <label htmlFor="story-content" className="sr-only">
                  내용
                </label>
                <textarea
                  id="story-content"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="당신의 이야기를 들려주세요... (마크다운 지원)"
                  className="w-full bg-transparent text-on-surface-variant font-sans text-base md:text-lg leading-relaxed resize-none focus:outline-none min-h-[200px] placeholder:text-outline-variant mt-4 font-medium"
                />
              </>
            )}

            {showImageInput && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden bg-surface-container-lowest border border-outline/20 p-5 rounded-2xl space-y-6 shadow-inner"
              >
                <div className="flex justify-between items-center border-b border-outline/10 pb-3">
                  <span className="text-sm font-bold text-on-surface flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    이야기 사진 첨부 (최대 2장 등록 가능)
                  </span>
                  <button 
                    onClick={() => setShowImageInput(false)}
                    className="p-1.5 hover:bg-surface-dim rounded-lg transition-colors text-on-surface-variant"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Slot 1: First Image */}
                  <div className="space-y-3 bg-surface-variant/10 p-4 rounded-xl border border-outline/5">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      첫 번째 사진 (대표 이미지)
                    </span>
                    <div className="grid grid-cols-1 gap-3">
                      {/* File Upload Slot 1 */}
                      <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-outline/30 rounded-xl hover:bg-primary/5 hover:border-primary/50 cursor-pointer transition-all gap-1.5 group min-h-[100px]">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileChange(e, 1)} 
                          className="hidden" 
                          disabled={isUploading}
                        />
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-1.5 justify-center">
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-[11px] font-bold text-primary animate-pulse">업로드 중...</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                            <span className="text-[11px] font-bold text-on-surface-variant group-hover:text-on-surface transition-colors text-center">컴퓨터/스마트폰 사진 선택 (1)</span>
                          </>
                        )}
                      </label>

                      {/* URL Input Slot 1 */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-on-surface-variant">인터넷 주소(URL) 직접 입력</span>
                        <input
                          type="url"
                          value={newImage}
                          onChange={(e) => setNewImage(e.target.value)}
                          placeholder="https://example.com/image1.jpg"
                          className="w-full bg-surface border border-outline/20 rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-xs font-sans font-medium"
                        />
                      </div>
                    </div>

                    {newImage && (
                      <div className="relative rounded-xl overflow-hidden h-28 bg-surface-dim border border-outline/20 shadow-inner mt-2">
                        <ImageWithFallback src={newImage} alt="첫 번째 이미지 미리보기" referrerPolicy="no-referrer" loading="lazy" decoding="async" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" containerClassName="w-full h-full" />
                        <button 
                          onClick={() => setNewImage("")}
                          className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
                          title="이미지 제거"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Slot 2: Second Image */}
                  <div className="space-y-3 bg-surface-variant/10 p-4 rounded-xl border border-outline/5">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      두 번째 사진 (선택 사항)
                    </span>
                    <div className="grid grid-cols-1 gap-3">
                      {/* File Upload Slot 2 */}
                      <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-outline/30 rounded-xl hover:bg-primary/5 hover:border-primary/50 cursor-pointer transition-all gap-1.5 group min-h-[100px]">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileChange(e, 2)} 
                          className="hidden" 
                          disabled={isUploading}
                        />
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-1.5 justify-center">
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-[11px] font-bold text-primary animate-pulse">업로드 중...</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                            <span className="text-[11px] font-bold text-on-surface-variant group-hover:text-on-surface transition-colors text-center">컴퓨터/스마트폰 사진 선택 (2)</span>
                          </>
                        )}
                      </label>

                      {/* URL Input Slot 2 */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-on-surface-variant">인터넷 주소(URL) 직접 입력</span>
                        <input
                          type="url"
                          value={newImage2}
                          onChange={(e) => setNewImage2(e.target.value)}
                          placeholder="https://example.com/image2.jpg"
                          className="w-full bg-surface border border-outline/20 rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-xs font-sans font-medium"
                        />
                      </div>
                    </div>

                    {newImage2 && (
                      <div className="relative rounded-xl overflow-hidden h-28 bg-surface-dim border border-outline/20 shadow-inner mt-2">
                        <ImageWithFallback src={newImage2} alt="두 번째 이미지 미리보기" referrerPolicy="no-referrer" loading="lazy" decoding="async" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" containerClassName="w-full h-full" />
                        <button 
                          onClick={() => setNewImage2("")}
                          className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
                          title="이미지 제거"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {showSettingsInput && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden bg-surface-container-lowest border border-outline/20 p-5 rounded-2xl space-y-4 shadow-inner"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    세계관 및 설정 (소설/이야기용)
                  </span>
                  <button 
                    onClick={() => setShowSettingsInput(false)}
                    className="p-1.5 hover:bg-surface-dim rounded-lg transition-colors text-on-surface-variant"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">아이디어 (Idea)</label>
                    <textarea
                      value={newIdea}
                      onChange={(e) => setNewIdea(e.target.value)}
                      placeholder="핵심 아이디어나 영감을 메모하세요"
                      className="w-full bg-surface border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-sans font-medium resize-none min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">설정/세계관 (Worldview)</label>
                    <textarea
                      value={newWorldview}
                      onChange={(e) => setNewWorldview(e.target.value)}
                      placeholder="배경, 세계의 규칙, 주요 설정"
                      className="w-full bg-surface border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-sans font-medium resize-none min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">등장인물 (Characters)</label>
                    <textarea
                      value={newCharacters}
                      onChange={(e) => setNewCharacters(e.target.value)}
                      placeholder="주요 인물들의 성격, 외양, 동기"
                      className="w-full bg-surface border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-sans font-medium resize-none min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">연대기 (Chronology)</label>
                    <textarea
                      value={newChronology}
                      onChange={(e) => setNewChronology(e.target.value)}
                      placeholder="주요 사건의 흐름이나 시간선"
                      className="w-full bg-surface border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-sans font-medium resize-none min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">에피소드 (Episodes)</label>
                    <textarea
                      value={newEpisodes}
                      onChange={(e) => setNewEpisodes(e.target.value)}
                      placeholder="개별 에피소드의 시놉시스나 요약"
                      className="w-full bg-surface border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-sans font-medium resize-none min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">AI 프롬프트 (AI Prompt) - 소설 생성 등에 사용한 프롬프트 기록용</label>
                    <textarea
                      value={newPrompt}
                      onChange={(e) => setNewPrompt(e.target.value)}
                      placeholder="이 글을 생성하거나 보조받을 때 사용한 프롬프트를 기록해두세요."
                      className="w-full bg-surface border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-sans font-medium resize-none min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">작업 상태 (Status)</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full bg-surface border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-sans font-medium"
                    >
                      <option value="구상 중">💡 구상 중</option>
                      <option value="집필 중">✍️ 집필 중</option>
                      <option value="발행됨">✅ 발행됨</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-6 border-t border-outline/20 gap-4 mt-6">
              <div className="flex flex-wrap items-center justify-between sm:justify-start gap-4">
                <button
                  onClick={() => setShowImageInput(!showImageInput)}
                  className={`p-3.5 rounded-full border shadow-sm transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${showImageInput || newImage || newImage2 ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-white text-on-surface hover:bg-blue-50 hover:text-blue-600 border-outline/20 hover:border-blue-200 hover:shadow-md"}`}
                  title="이미지 첨부"
                  aria-label="이미지 첨부 토글"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowSettingsInput(!showSettingsInput)}
                  className={`p-3.5 rounded-full border shadow-sm transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${showSettingsInput || newIdea || newWorldview || newChronology || newCharacters || newEpisodes || newPrompt ? "bg-purple-50 text-purple-600 border-purple-200" : "bg-white text-on-surface hover:bg-purple-50 hover:text-purple-600 border-outline/20 hover:border-purple-200 hover:shadow-md"}`}
                  title="세계관 및 설정"
                  aria-label="세계관 및 설정 토글"
                >
                  <Globe className="w-5 h-5" />
                </button>
                {(newImage || newImage2) && !showImageInput && (
                  <span className="text-xs text-blue-600 font-bold truncate max-w-[150px] hidden sm:inline-block">
                    {(newImage && newImage2) ? "이미지 2장 첨부됨" : "이미지 1장 첨부됨"}
                  </span>
                )}
                {(newIdea || newWorldview || newChronology || newCharacters || newEpisodes || newPrompt) && !showSettingsInput && (
                  <span className="text-xs text-purple-600 font-bold truncate max-w-[150px] hidden sm:inline-block">
                    설정 첨부됨
                  </span>
                )}
                <div className="text-sm text-on-surface-variant font-semibold flex items-center gap-2 px-4 py-3 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-full border border-outline/20 hover:border-blue-200 shadow-sm transition-all duration-300 ease-out hover:shadow-md cursor-default">
                  <Save className="w-4 h-4 text-blue-600" />{" "}
                  <span className="hidden sm:inline">{editingId ? "수정 중..." : "자동 임시저장"}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setNewTitle("");
                      setNewPost("");
                      setNewImage("");
                      setNewImage2("");
                      setShowImageInput(false);
                    }}
                    className="px-6 py-4 rounded-full font-semibold text-lg transition-all duration-300 ease-out hover:bg-gray-100 hover:scale-105 active:scale-95 border border-transparent hover:border-gray-200 text-on-surface-variant hover:text-on-surface"
                  >
                    취소
                  </button>
                )}
                <button
                  onClick={handlePost}
                  disabled={isSaving || isUploading || !newPost.trim() || !newTitle.trim()}
                  className={`px-8 py-4 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 ease-out flex items-center justify-center gap-2 shadow-sm border w-full sm:w-auto ${
                    isSaving || isUploading || !newPost.trim() || !newTitle.trim()
                      ? "bg-surface-dim text-outline-variant cursor-not-allowed border-outline/20"
                      : "bg-white text-on-surface hover:bg-blue-50 hover:text-blue-600 hover:scale-105 active:scale-95 border-outline/20 hover:border-blue-200 hover:shadow-md"
                  }`}
                >
                  {isSaving || isUploading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isUploading 
                    ? "이미지 업로드 중..." 
                    : isSaving 
                      ? (editingId ? "수정 중..." : "저장 중...") 
                      : (editingId ? "수정 저장하기" : "저장하기")}
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Filter */}
        <div className="flex items-center gap-6 py-6 border-b border-outline/20 overflow-x-auto hide-scrollbar">
          <div className="flex gap-6 px-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`text-base font-bold pb-3 border-b-[3px] transition-all whitespace-nowrap -mb-[27px] ${activeFilter === cat.id ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline/40"}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Feed */}
        <div className="space-y-10 pb-20 pt-4">
          <AnimatePresence>
            {isLoadingFeed ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="space-y-10"
              >
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-surface rounded-[2rem] p-8 md:p-12 border border-outline/10 shadow-sm animate-pulse min-h-[300px] flex flex-col justify-between">
                    <div>
                      <div className="w-24 h-8 bg-surface-variant/50 rounded-full mb-6" />
                      <div className="w-2/3 h-12 bg-surface-variant/50 rounded-lg mb-6" />
                      <div className="w-full h-4 bg-surface-variant/50 rounded-md mb-3" />
                      <div className="w-5/6 h-4 bg-surface-variant/50 rounded-md mb-3" />
                      <div className="w-4/6 h-4 bg-surface-variant/50 rounded-md" />
                    </div>
                    <div className="mt-8 pt-6 border-t border-outline/20 flex gap-4">
                      <div className="w-12 h-8 bg-surface-variant/50 rounded-lg" />
                      <div className="w-12 h-8 bg-surface-variant/50 rounded-lg" />
                      <div className="w-12 h-8 bg-surface-variant/50 rounded-lg" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : feed.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-32 flex flex-col items-center justify-center text-center relative bg-surface-container-lowest border border-outline/10 rounded-[2rem] shadow-sm overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10" />
                <div className="w-28 h-28 bg-gradient-to-br from-primary/20 to-primary/5 rounded-[2rem] flex items-center justify-center mb-8 border border-primary/20 shadow-inner -rotate-3 hover:-rotate-6 transition-transform duration-500">
                  <BookOpen className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-4 tracking-tight">
                  기록의 공간이 비어있습니다
                </h3>
                <p className="text-lg text-on-surface-variant max-w-md font-medium leading-relaxed z-10">
                  {isAdmin
                    ? "첫 번째 문장을 시도해볼 시간입니다. 당신만의 특별한 세계를 자유롭게 스케치해보세요."
                    : "아직 작성된 이야기가 없습니다. 곧 신비로운 세계가 펼쳐질 예정입니다."}
                </p>
              </motion.div>
            ) : filteredFeed.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-20 bg-surface-container-lowest border border-outline/10 rounded-[2rem] shadow-sm relative overflow-hidden"
              >
                <BookOpen className="w-16 h-16 text-outline-variant mx-auto mb-4" />
                <p className="text-on-surface font-display font-bold text-2xl tracking-tight mb-2">
                  해당 카테고리의 기록이 없습니다
                </p>
                <p className="text-on-surface-variant text-base">
                  다른 카테고리를 선택해보세요.
                </p>
              </motion.div>
            ) : (
              filteredFeed.map((post) => (
                <PostItem 
                  key={post.id} 
                  post={post} 
                  handleEdit={handleEdit} 
                  handleDelete={handleDelete} 
                  handleLike={handleLike} 
                  isAdmin={isAdmin}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
