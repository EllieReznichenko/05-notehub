export interface Note {
  id: number;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export type NewNoteData = {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
};

export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
