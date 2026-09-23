"use client";

import { useRef, useState, useTransition } from "react";
import { deleteProjectAction } from "@/lib/actions/projects";

export function DeleteProjectDialog({ id, title }: { id: string; title: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="text-xs font-medium text-red-300 hover:text-red-200 hover:underline"
      >
        Delete
      </button>
      <dialog
        ref={dialogRef}
        className="w-[min(28rem,90vw)] rounded-xl border border-white/10 bg-bg-3 p-6 text-fg backdrop:bg-black/60"
      >
        <p className="mb-1 text-sm font-semibold">Delete &ldquo;{title}&rdquo;?</p>
        <p className="mb-5 text-sm text-white/60">
          This permanently removes the project and its uploaded images. This can&apos;t be undone.
        </p>
        {error && <p className="mb-4 text-sm text-red-300">{error}</p>}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/70 hover:border-white/40"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                try {
                  await deleteProjectAction(id);
                  dialogRef.current?.close();
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Could not delete the project.");
                }
              });
            }}
            className="rounded-full bg-red-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Deleting…" : "Delete project"}
          </button>
        </div>
      </dialog>
    </>
  );
}
