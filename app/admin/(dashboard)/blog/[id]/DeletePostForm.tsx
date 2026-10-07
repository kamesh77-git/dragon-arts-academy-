"use client";

export default function DeletePostForm({ id, action }: { id: string; action: (formData: FormData) => Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this post permanently? This can't be undone.")) e.preventDefault();
      }}
      className="mt-8 border-t border-slate-200 pt-6"
    >
      <input type="hidden" name="id" value={id} />
      <button className="text-sm text-red-600 underline hover:text-red-700">Delete this post permanently</button>
    </form>
  );
}
