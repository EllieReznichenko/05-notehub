import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  total_pages: number;
  currentPage: number;
  onPageChange: (selected: number) => void;
}

export const Pagination = ({
  total_pages,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  return (
    <ReactPaginate
      pageCount={total_pages}
      forcePage={currentPage - 1}
      onPageChange={({ selected }) => onPageChange(selected)}
      containerClassName={css.pagination}
      pageClassName={css.page}
      activeClassName={css.active}
      previousLabel={"←"}
      nextLabel={"→"}
      previousClassName={css.nav}
      nextClassName={css.nav}
      disabledClassName={css.disabled}
      breakLabel="..."
    />
  );
};
