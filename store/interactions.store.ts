import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WorkComment {
  id: string;
  author: string;
  authorInitials: string;
  text: string;
  timeLabel: string;
}

interface InteractionsState {
  likedWorkIds: Record<string, boolean>;
  commentsByWork: Record<string, WorkComment[]>;
  reportedWorkIds: Record<string, boolean>;
  toggleLike: (workId: string) => void;
  addComment: (workId: string, text: string) => void;
  reportWork: (workId: string) => void;
}

export const useInteractionsStore = create<InteractionsState>()(
  persist(
    (set) => ({
      likedWorkIds: {},
      commentsByWork: {},
      reportedWorkIds: {},
      toggleLike: (workId) =>
        set((s) => ({ likedWorkIds: { ...s.likedWorkIds, [workId]: !s.likedWorkIds[workId] } })),
      addComment: (workId, text) =>
        set((s) => {
          const comment: WorkComment = {
            id: `${workId}-${Date.now()}`,
            author: "You",
            authorInitials: "Y",
            text,
            timeLabel: "Just now",
          };
          return {
            commentsByWork: {
              ...s.commentsByWork,
              [workId]: [...(s.commentsByWork[workId] ?? []), comment],
            },
          };
        }),
      reportWork: (workId) => set((s) => ({ reportedWorkIds: { ...s.reportedWorkIds, [workId]: true } })),
    }),
    { name: "artspace-interactions", skipHydration: true }
  )
);
