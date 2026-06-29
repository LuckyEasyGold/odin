"use client"

import { FormEvent, CSSProperties, useRef } from "react";

type DeleteModelButtonProps = {
  id: string;
  label?: string;
  action: (formData: FormData) => Promise<void>;
  buttonStyle?: CSSProperties;
  /** Optional CSS class for uniform button styling */
  className?: string;
};

export default function DeleteModelButton({ id, label = "Excluir", action, buttonStyle, className }: DeleteModelButtonProps) {
  const formRef = useRef<HTMLFormElement>(null);

  function handleClick(event: FormEvent<HTMLButtonElement>) {
    if (!window.confirm("Tem certeza que deseja excluir este modelo? Esta ação não pode ser desfeita.")) {
      event.preventDefault();
      return;
    }

    formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} action={action} style={{ display: "inline" }}>
      <input type="hidden" name="id" value={id} />
      {className ? (
        <button
          type="button"
          onClick={handleClick}
          className={className}
        >
          {label}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          style={{
            fontSize: "0.8rem",
            color: "#dc2626",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            textDecoration: "underline",
            ...buttonStyle
          }}
        >
          {label}
        </button>
      )}
    </form>
  );
}
