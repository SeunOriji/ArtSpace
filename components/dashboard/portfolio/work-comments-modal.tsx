"use client";

import { useState, type FormEvent } from "react";
import { MessageCircle, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInteractionsStore, type WorkComment } from "@/store/interactions.store";

// Selectors must return a referentially stable value when the underlying state
// is unchanged, or useSyncExternalStore re-renders in an infinite loop. A `?? []`
// fallback inline in the selector creates a new array every call, so it's hoisted here.
const EMPTY_COMMENTS: WorkComment[] = [];

interface WorkCommentsModalProps {
  workId: string;
  workTitle: string;
  seedComments?: WorkComment[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorkCommentsModal({
  workId,
  workTitle,
  seedComments = [],
  open,
  onOpenChange,
}: WorkCommentsModalProps) {
  const storedComments = useInteractionsStore((s) => s.commentsByWork[workId] ?? EMPTY_COMMENTS);
  const addComment = useInteractionsStore((s) => s.addComment);
  const [draft, setDraft] = useState("");
  const comments = [...seedComments, ...storedComments];

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    addComment(workId, text);
    setDraft("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex h-full min-h-0 flex-col">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <p className="mt-1 truncate text-sm text-foreground-muted">{workTitle}</p>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-7">
            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2.5 py-12 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-overlay text-foreground-subtle">
                  <MessageCircle size={18} />
                </span>
                <p className="text-sm font-semibold text-foreground">No comments yet</p>
                <p className="text-xs text-foreground-subtle">Be the first to share your thoughts.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-4">
                {comments.map((comment) => (
                  <li key={comment.id} className="flex items-start gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-gold text-xs font-bold text-background">
                      {comment.authorInitials}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-foreground">{comment.author}</span>
                        <span className="text-xs text-foreground-subtle">{comment.timeLabel}</span>
                      </div>
                      <p className="mt-0.5 text-sm leading-relaxed text-foreground-muted">{comment.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-none items-center gap-2.5 border-t border-border bg-surface-raised px-6 py-4 sm:px-7"
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a comment…"
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent placeholder:text-foreground-subtle"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Post comment"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-surface-overlay disabled:text-foreground-subtle"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
