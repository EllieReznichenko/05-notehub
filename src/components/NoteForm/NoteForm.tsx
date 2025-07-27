import css from "./NoteForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import * as Yup from "yup";
import { createNote } from "../../services/noteService";
import type { NewNoteData, Note } from "../../types/note";
import type { AxiosError } from "axios";

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Too short")
    .max(50, "Too long")
    .required("Required field"),
  content: Yup.string().max(500, "Too long"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Required field"),
});

const initialValues: NewNoteData = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();
  const fieldId = useId();

  const { mutate, isPending } = useMutation<Note, AxiosError, NewNoteData>({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  const handleSubmit = (
    values: NewNoteData,
    { resetForm }: FormikHelpers<NewNoteData>
  ) => {
    mutate(values);
    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ isSubmitting, resetForm }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-title`}>Title</label>
            <Field id={`${fieldId}-title`} name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-content`}>Content</label>
            <Field
              as="textarea"
              id={`${fieldId}-content`}
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-tag`}>Tag</label>
            <Field
              as="select"
              id={`${fieldId}-tag`}
              name="tag"
              className={css.select}
            >
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => {
                resetForm();
                onCancel();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || isPending}
            >
              {isPending ? "Submitting..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
