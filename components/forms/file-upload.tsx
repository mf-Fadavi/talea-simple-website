"use client";

import { useId, useRef, useState } from "react";
import { Upload } from "lucide-react";

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  files,
  onChange,
  validate,
  accept,
  title,
  copy,
  actionLabel,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  validate: (files: File[]) => string;
  accept: string;
  title: string;
  copy: string;
  actionLabel: string;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  return (
    <div className="rounded-2xl border border-dashed border-black/15 bg-gray-50 p-5 transition-colors hover:border-brand hover:bg-brand-soft/40">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        multiple
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          const picked = Array.from(event.target.files ?? []);
          const message = validate(picked);
          setError(message);
          if (message) {
            if (inputRef.current) inputRef.current.value = "";
            onChange([]);
          } else {
            onChange(picked);
          }
        }}
      />
      <label htmlFor={inputId} className="flex cursor-pointer items-center justify-between gap-4">
        <div>
          <strong className="block text-sm font-semibold text-ink">{title}</strong>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">{copy}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-xs font-semibold text-ink">
          <Upload className="h-3.5 w-3.5" aria-hidden="true" />
          {actionLabel}
        </span>
      </label>
      {files.length > 0 && (
        <div className="mt-3.5 grid gap-2 border-t border-black/5 pt-3">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-3 text-xs text-gray-600"
            >
              <span className="truncate">{file.name}</span>
              <span className="shrink-0 text-gray-400">{formatBytes(file.size)}</span>
            </div>
          ))}
        </div>
      )}
      {error && <p className="mt-2.5 text-xs leading-relaxed text-brand">{error}</p>}
    </div>
  );
}
