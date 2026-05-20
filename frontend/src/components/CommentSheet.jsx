import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/comment-sheet.css";

const LONG_PRESS_MS = 500;

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const CommentSheet = ({ open, foodId, onClose, onCountChange }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [meId, setMeId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const hasFetched = useRef(false);
  const inputRef = useRef(null);
  const longPressTimerRef = useRef(null);

  useEffect(() => {
    if (meId) return;
    axios
      .get("http://localhost:3000/api/auth/user/me", { withCredentials: true })
      .then((r) => setMeId(r.data.user._id))
      .catch(() => {});
  }, [meId]);

  useEffect(() => {
    if (!open || !foodId) return;
    hasFetched.current = false;
    setComments([]);
    setSelectedId(null);
    axios
      .get(`http://localhost:3000/api/comment/${foodId}`, {
        withCredentials: true,
      })
      .then((r) => {
        setComments(r.data.comments);
        hasFetched.current = true;
      })
      .catch(() => {});
  }, [open, foodId]);

  const isOwn = (comment) =>
    meId && comment.user && String(comment.user._id) === String(meId);

  const startLongPress = (comment) => {
    if (!isOwn(comment)) return;
    longPressTimerRef.current = setTimeout(() => {
      setSelectedId(comment._id);
    }, LONG_PRESS_MS);
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handlePointerUp = (comment) => {
    const hadTimer = longPressTimerRef.current !== null;
    cancelLongPress();
    // Short tap on a different comment → deselect current
    if (hadTimer && selectedId && selectedId !== comment._id) {
      setSelectedId(null);
    }
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setText("");
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      text: trimmed,
      user: { _id: meId, fullName: "You" },
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [optimistic, ...prev]);
    onCountChange?.(1);
    try {
      const r = await axios.post(
        `http://localhost:3000/api/comment/${foodId}`,
        { text: trimmed },
        { withCredentials: true }
      );
      setComments((prev) =>
        prev.map((c) => (c._id === tempId ? r.data.comment : c))
      );
    } catch {
      setComments((prev) => prev.filter((c) => c._id !== tempId));
      onCountChange?.(-1);
      setText(trimmed);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (commentId) => {
    setSelectedId(null);
    try {
      await axios.delete(
        `http://localhost:3000/api/comment/${commentId}`,
        { withCredentials: true }
      );
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      onCountChange?.(-1);
    } catch {
      // delete failed silently — selectedId already cleared
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div
        className={`comment-sheet-backdrop${open ? " open" : ""}`}
        onClick={onClose}
      />
      <div className={`comment-sheet${open ? " open" : ""}`}>
        <div className="comment-sheet-handle" />
        <div className="comment-sheet-header">
          <span className="comment-sheet-title">
            Comments {comments.length > 0 ? `(${comments.length})` : ""}
          </span>
          <button
            className="comment-sheet-close"
            onClick={onClose}
            type="button"
            aria-label="Close comments"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <div
          className="comment-sheet-list"
          onPointerDown={(e) => {
            const clickedComment = e.target.closest(".comment-item");
            const clickedDeleteBtn = e.target.closest(".comment-delete-btn");
            if (!clickedComment && !clickedDeleteBtn) {
              setSelectedId(null);
            }
          }}
        >
          {comments.length === 0 ? (
            <div className="comment-sheet-empty">
              No comments yet. Be the first!
            </div>
          ) : (
            comments.map((c) => (
              <div
                key={c._id}
                className={`comment-item${selectedId === c._id ? " selected" : ""}`}
                onPointerDown={() => startLongPress(c)}
                onPointerUp={() => handlePointerUp(c)}
                onPointerLeave={cancelLongPress}
                onPointerCancel={cancelLongPress}
              >
                <div className="comment-avatar">
                  {c.user?.fullName?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="comment-content">
                  <div className="comment-author">
                    {c.user?.fullName || "User"}
                  </div>
                  <div className="comment-text">{c.text}</div>
                </div>
                {selectedId === c._id && isOwn(c) && (
                  <button
                    className="comment-delete-btn"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(c._id);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    aria-label="Delete comment"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="comment-sheet-input-row">
          <textarea
            ref={inputRef}
            className="comment-input"
            placeholder="Add a comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
          />
          <button
            className="comment-send-btn"
            onClick={handleSend}
            disabled={!text.trim() || sending}
            type="button"
            aria-label="Send comment"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default CommentSheet;
