import axios from "axios";
import type { NewNoteData, Note } from "../types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

axios.defaults.headers.common.Authorization = `Bearer ${token}`;

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

interface RawFetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: FetchNotesParams = { page, perPage };

  if (search && search.trim() !== "") {
    params.search = search;
  }

  const { data } = await axios.get<RawFetchNotesResponse>("/notes", {
    params,
  });

  return {
    notes: data.notes,
    totalPages: data.totalPages,
  };
};

export const createNote = async (noteData: NewNoteData): Promise<Note> => {
  const { data } = await axios.post<Note>("/notes", noteData);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await axios.delete<Note>(`/notes/${id}`);
  return data;
};
