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
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import { useClickOutside } from "../hooks/useClickOutside";

const CATEGORIES = [
  { id: "전체", icon: BookOpen, label: "전체 보기" },
  { id: "일기", icon: Coffee, label: "일기" },
  { id: "칼럼", icon: PenSquare, label: "칼럼" },
  { id: "소설", icon: Book, label: "소설" },
  { id: "이야기", icon: Feather, label: "이야기" },
];

const MOCK_POSTS: any[] = [];

const PostItem = ({
  post,
  handleEdit,
  handleDelete,
  handleLike,
  showToast,
}: {
  post: any;
  handleEdit: (post: any) => void;
  handleDelete: (id: number) => void;
  handleLike: (id: number) => void;
  showToast: (msg: string) => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-surface p-6 md:p-12 group/card shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] border border-outline/20 rounded-2xl relative overflow-hidden"
    >
      {/* Visual Flair */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />

      <div className="flex flex-col gap-8 relative z-10">
        {/* Post Header */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-xs uppercase bg-primary/10 text-primary px-3 py-1.5 rounded-md font-bold flex items-center gap-2 w-fit border border-primary/20 letter-spacing-widest">
              {CATEGORIES.find((c) => c.id === post.category)?.icon &&
                (() => {
                  const Icon = CATEGORIES.find((c) => c.id === post.category)!.icon;
                  return <Icon className="w-3.5 h-3.5" />;
                })()}
              {post.category}
            </span>
            <div className="flex items-center gap-4">
              <p className="font-mono text-xs text-on-surface-variant font-semibold tracking-wider bg-surface-container-lowest px-3 py-1 rounded border border-outline/20">
                {post.date}
              </p>
              <div className="relative" ref={dropdownRef}>
                <button
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  aria-label={`${post.title} 추가 메뉴`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-on-surface-variant hover:text-on-surface p-1.5 bg-surface hover:bg-surface-dim rounded-md border border-transparent hover:border-outline/20 transition-all shadow-none hover:shadow-sm"
                >
                  <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-surface rounded-lg shadow-xl border border-outline/20 py-2 z-10 text-on-surface">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleEdit(post);
                      }}
                      className="w-full text-left px-5 py-2.5 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-dim flex items-center gap-3 font-bold transition-colors"
                    >
                      <Edit3 className="w-4 h-4" aria-hidden="true" /> 수정하기
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleDelete(post.id);
                      }}
                      className="w-full text-left px-5 py-2.5 text-sm text-[#ba1a1a] hover:bg-[#ba1a1a]/10 flex items-center gap-3 font-bold transition-colors"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" /> 삭제하기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <h2 className="text-2xl md:text-4xl font-display font-bold text-on-surface mb-4 tracking-tight">
            {post.title}
          </h2>
        </div>

        {/* Post Content */}
        <div className="text-on-surface-variant font-medium">
          {post.image && (
            <div className="relative rounded-xl overflow-hidden max-h-[500px] border border-outline/20 mb-8 shadow-sm">
              <img
                src={post.image}
                alt="게시물 표지 이미지"
                loading="lazy"
                className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
              />
            </div>
          )}
          <div className="prose prose-base md:prose-lg max-w-none prose-p:leading-loose prose-h1:font-display prose-headings:font-bold prose-headings:text-on-surface prose-strong:text-primary">
            <Markdown>{post.content}</Markdown>
          </div>
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
            aria-label="공유하기"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              showToast("링크가 복사되었습니다.");
            }}
            className="flex items-center gap-2 hover:text-primary transition-colors group"
          >
            <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline/20 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors shadow-sm">
              <Share2 className="w-5 h-5" aria-hidden="true" />
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function Stories() {
  const [newTitle, setNewTitle] = useState(
    () => localStorage.getItem("story_draft_title") || "",
  );
  const [newPost, setNewPost] = useState(
    () => localStorage.getItem("story_draft_content") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState("일기");
  const [activeFilter, setActiveFilter] = useState("전체");
  const [isPreview, setIsPreview] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newImage, setNewImage] = useState(
    () => localStorage.getItem("story_draft_image") || "",
  );

  const [feed, setFeed] = useState(() => {
    const saved = localStorage.getItem("personal_writings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MOCK_POSTS;
      }
    }
    return MOCK_POSTS;
  });

  // Save feed to local storage
  useEffect(() => {
    localStorage.setItem("personal_writings", JSON.stringify(feed));
  }, [feed]);

  // Save draft to local storage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("story_draft_title", newTitle);
      localStorage.setItem("story_draft_content", newPost);
      if (newImage) localStorage.setItem("story_draft_image", newImage);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [newTitle, newPost, newImage]);

  const showToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handlePost = () => {
    if (!newPost.trim() || !newTitle.trim()) {
      showToast("제목과 내용을 모두 입력해주세요.");
      return;
    }

    if (editingId) {
      setFeed(
        feed.map((p: any) =>
          p.id === editingId
            ? {
                ...p,
                title: newTitle,
                content: newPost,
                category: selectedCategory,
                image: newImage,
              }
            : p,
        ),
      );
      setEditingId(null);
      showToast("기록이 수정되었습니다.");
    } else {
      const post = {
        id: Date.now(),
        category: selectedCategory,
        title: newTitle,
        date: new Date()
          .toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/-/g, ". "),
        content: newPost,
        likes: 0,
        image: newImage,
      };
      setFeed([post, ...feed]);
      showToast("새로운 세계가 기록되었습니다.");
    }

    setNewTitle("");
    setNewPost("");
    setNewImage("");
    setIsPreview(false);
    localStorage.removeItem("story_draft_title");
    localStorage.removeItem("story_draft_content");
    localStorage.removeItem("story_draft_image");
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setNewTitle(post.title);
    setNewPost(post.content);
    setNewImage(post.image || "");
    setSelectedCategory(post.category);
    setIsPreview(false);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    setFeed(feed.filter((p: any) => p.id !== id));
    setActiveDropdown(null);
    showToast("기록이 삭제되었습니다.");
  };

  const handleLike = (id: number) => {
    setFeed(
      feed.map((p: any) => {
        if (p.id === id) {
          return { ...p, likes: p.likes + 1 };
        }
        return p;
      }),
    );
  };

  const filteredFeed =
    activeFilter === "전체"
      ? feed
      : feed.filter((post: any) => post.category === activeFilter);

  return (
    <div className="p-4 lg:py-10 max-w-4xl mx-auto min-h-screen">
      {/* Cinematic Header */}
      <div className="flex flex-col gap-4 pb-10 mb-10 border-b border-outline/20">
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-on-surface flex items-center gap-4">
          나의 세계
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant font-sans max-w-2xl font-medium">
          나만의 일상, 생각, 그리고 상상의 나래를 기록하는 공간입니다.
        </p>
      </div>

      <div className="space-y-10">
        {/* Compose Box */}
        <div className="bg-surface p-5 md:p-10 rounded-2xl shadow-[0_4px_12px_-2px_rgba(70,72,212,0.05)] border border-outline/30">
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

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-6 border-t border-outline/20 gap-4">
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <button
                  onClick={() => {
                    const url = prompt("이미지 URL을 입력하세요:", newImage);
                    if (url !== null) setNewImage(url);
                  }}
                  className={`p-2.5 rounded-lg border shadow-sm transition-colors ${newImage ? "bg-primary-light/50 text-primary border-primary/30" : "bg-surface-container hover:bg-primary-light/50 text-on-surface-variant hover:text-primary border-outline/10"}`}
                  title="이미지 첨부"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                {newImage && (
                  <span className="text-xs text-primary font-bold truncate max-w-[150px]">
                    이미지 첨부됨
                  </span>
                )}
                <div className="text-xs text-on-surface-variant font-mono font-semibold flex items-center gap-2 px-3 py-1.5 bg-surface-dim/30 rounded-full border border-outline/10 shadow-inner">
                  <Save className="w-3.5 h-3.5 text-primary" />{" "}
                  {editingId ? "수정 중..." : "자동 임시저장"}
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
                    }}
                    className="px-6 py-3 rounded-lg font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-dim/30 transition-colors"
                  >
                    취소
                  </button>
                )}
                <button
                  onClick={handlePost}
                  disabled={!newPost.trim() || !newTitle.trim()}
                  className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 tracking-wide ${
                    !newPost.trim() || !newTitle.trim()
                      ? "bg-surface-dim text-outline-variant cursor-not-allowed"
                      : "bg-on-surface text-surface hover:bg-primary hover:shadow-lg shadow-md"
                  }`}
                >
                  <Send className="w-4 h-4" />{" "}
                  {editingId ? "수정 저장하기" : "저장하기"}
                </button>
              </div>
            </div>
          </div>
        </div>

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
            {filteredFeed.map((post: any) => (
              <PostItem 
                key={post.id} 
                post={post} 
                handleEdit={handleEdit} 
                handleDelete={handleDelete} 
                handleLike={handleLike} 
                showToast={showToast} 
              />
            ))}
          </AnimatePresence>

          {filteredFeed.length === 0 && (
            <div className="text-center py-24 text-on-surface-variant bg-surface border border-outline/20 rounded-2xl border-dashed">
              <BookOpen className="w-16 h-16 mx-auto mb-6 opacity-30" />
              <p className="text-xl font-display font-bold text-on-surface mb-2">
                아직 작성된 세계가 없습니다.
              </p>
              <p className="text-sm font-medium">새로운 기록을 남겨보세요.</p>
            </div>
          )}
        </div>
      </div>

      {/* Toasts */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-on-surface text-surface px-8 py-3.5 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.2)] font-bold text-sm tracking-wide border border-outline-variant/30 text-center pointer-events-auto flex items-center justify-center gap-2"
            >
              <Feather className="w-4 h-4 opacity-50" />
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
