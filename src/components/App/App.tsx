import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "../NoteList/NoteList";
import { Pagination } from "../Pagination/Pagination";
import { SearchBox } from "../SearchBox/SearchBox";
import { Modal } from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./App.module.css";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    handleSearch(value);
  };

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {data && data.total_pages > 1 && (
          <Pagination
            currentPage={page}
            total_pages={data.total_pages}
            onPageChange={(selected) => {
              const nextPage = selected + 1;
              if (nextPage < 1) return;
              setPage(nextPage);
            }}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && data.data.length > 0 && <NoteList notes={data.data} />}

      {isSuccess && data.data.length === 0 && (
        <p className={css.empty}>No notes found. Try a different search.</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
