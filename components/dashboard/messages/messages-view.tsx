"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  ChevronLeft,
  ImageIcon,
  MoreHorizontal,
  Phone,
  Search,
  SendHorizontal,
  SquarePen,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMessagesStore, type Thread } from "@/store/messages.store";

function ThreadRow({
  thread,
  isActive,
  onSelect,
}: {
  thread: Thread;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left transition-colors lg:px-5",
        isActive ? "border-accent bg-surface-raised" : "border-transparent hover:bg-surface-raised"
      )}
    >
      <span className="relative flex h-12 w-12 flex-none items-center justify-center rounded-full bg-surface-overlay font-heading text-sm font-bold text-gold">
        {thread.initials}
        <span
          className={cn(
            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface",
            thread.isOnline ? "bg-emerald-400" : "bg-foreground-subtle"
          )}
        />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "truncate text-sm text-foreground",
              thread.unreadCount > 0 ? "font-bold" : "font-semibold"
            )}
          >
            {thread.name}
          </p>
          <span className="flex-shrink-0 text-[11px] font-medium text-foreground-subtle">
            {thread.timeLabel}
          </span>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p
            className={cn(
              "truncate text-[13px]",
              thread.unreadCount > 0 ? "font-semibold text-foreground" : "text-foreground-muted"
            )}
          >
            {thread.preview}
          </p>
          {thread.unreadCount > 0 && (
            <span className="flex h-[18px] min-w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-accent px-1.5 font-heading text-[10px] font-extrabold text-white">
              {thread.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function ChatBubble({ message }: { message: Thread["messages"][number] }) {
  const isMine = message.from === "me";

  if (message.sharedArtwork) {
    return (
      <div className={cn("flex flex-col", isMine ? "items-end" : "items-start")}>
        <div
          className={cn(
            "max-w-[75%] rounded-2xl p-1.5",
            isMine ? "rounded-br-md bg-accent" : "rounded-bl-md bg-surface-raised"
          )}
        >
          <div className="flex items-center gap-3 rounded-xl bg-background p-2">
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-surface-overlay">
              <ImageIcon size={18} className="text-foreground-subtle" />
            </span>
            <div className="min-w-0">
              <p className="font-heading text-sm font-bold text-foreground">
                {message.sharedArtwork.title}
              </p>
              <p className="text-xs text-foreground-subtle">{message.sharedArtwork.subtitle}</p>
            </div>
          </div>
        </div>
        {message.readLabel && (
          <span className="mt-1 text-[11px] font-medium text-foreground-subtle">{message.readLabel}</span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", isMine ? "items-end" : "items-start")}>
      <div className={cn("flex max-w-[75%] items-end gap-2", isMine ? "flex-row-reverse" : "flex-row")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isMine
              ? "rounded-br-md bg-accent text-white"
              : "rounded-bl-md bg-surface-raised text-foreground"
          )}
        >
          {message.text}
        </div>
      </div>
      {message.readLabel && (
        <span className="mt-1 text-[11px] font-medium text-foreground-subtle">{message.readLabel}</span>
      )}
    </div>
  );
}

function ThreadPanel({ thread, onBack }: { thread: Thread | undefined; onBack: () => void }) {
  const sendMessage = useMessagesStore((s) => s.sendMessage);
  const [draft, setDraft] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !thread) return;
    sendMessage(thread.id, text);
    setDraft("");
  }

  if (!thread) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-foreground-subtle">
        Select a conversation to start messaging.
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header */}
      <header className="flex flex-none items-center justify-between gap-3 border-b border-border-subtle px-4 py-3.5 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to conversations"
            className="flex-shrink-0 text-foreground-muted transition-colors hover:text-foreground lg:hidden"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="relative flex h-10 w-10 flex-none items-center justify-center rounded-full bg-surface-overlay font-heading text-sm font-bold text-gold">
            {thread.initials}
            <span
              className={cn(
                "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                thread.isOnline ? "bg-emerald-400" : "bg-foreground-subtle"
              )}
            />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">{thread.name}</p>
            {thread.isOnline && <p className="text-xs font-medium text-emerald-400">Active now</p>}
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-4 text-foreground-muted">
          <Phone size={18} className="hidden sm:block" />
          <Video size={18} className="hidden sm:block" />
          <MoreHorizontal size={18} />
        </div>
      </header>

      {/* Messages */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-5 lg:px-6">
        <p className="text-center text-[11px] font-semibold text-foreground-subtle">Today</p>
        {thread.messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-none items-center gap-3 border-t border-border-subtle px-4 py-3.5 lg:px-6"
      >
        <div className="flex flex-1 items-center rounded-full border border-border bg-surface px-4 py-2.5">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message ${thread.name.split(" ")[0]}…`}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-subtle"
          />
        </div>
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label="Send message"
          className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
        >
          <SendHorizontal size={17} />
        </button>
      </form>
    </div>
  );
}

export function MessagesView() {
  const threads = useMessagesStore((s) => s.threads);
  const markThreadRead = useMessagesStore((s) => s.markThreadRead);

  const [selectedId, setSelectedId] = useState<string | null>(threads[0]?.id ?? null);
  const [query, setQuery] = useState("");

  const selectedThread = useMemo(
    () => threads.find((t) => t.id === selectedId),
    [threads, selectedId]
  );

  const filteredThreads = useMemo(() => {
    if (!query.trim()) return threads;
    const q = query.toLowerCase();
    return threads.filter((t) => t.name.toLowerCase().includes(q));
  }, [threads, query]);

  function handleSelect(id: string) {
    setSelectedId(id);
    markThreadRead(id);
  }

  return (
    <div className="flex h-full min-h-0">
      {/* Conversation list */}
      <div
        className={cn(
          "min-h-0 w-full flex-col border-r border-border-subtle lg:flex lg:w-[340px] lg:flex-none",
          selectedId ? "hidden lg:flex" : "flex"
        )}
      >
        <div className="flex-none px-4 py-4 lg:px-5">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="font-heading text-2xl font-extrabold text-foreground">Messages</h1>
            <button
              type="button"
              aria-label="New message"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-subtle bg-surface text-gold transition-colors hover:bg-surface-raised"
            >
              <SquarePen size={15} />
            </button>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-border-subtle bg-surface px-3.5 py-2.5">
            <Search size={14} className="flex-shrink-0 text-foreground-subtle" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search messages"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-subtle"
            />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {filteredThreads.length > 0 ? (
            filteredThreads.map((thread) => (
              <ThreadRow
                key={thread.id}
                thread={thread}
                isActive={thread.id === selectedId}
                onSelect={() => handleSelect(thread.id)}
              />
            ))
          ) : (
            <p className="px-5 py-10 text-center text-sm text-foreground-subtle">No conversations found.</p>
          )}
        </div>
      </div>

      {/* Active chat */}
      <div className={cn("min-h-0 w-full flex-col lg:flex", selectedId ? "flex" : "hidden lg:flex")}>
        <ThreadPanel thread={selectedThread} onBack={() => setSelectedId(null)} />
      </div>
    </div>
  );
}
