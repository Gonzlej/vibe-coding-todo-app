import { useState } from "react";
import type { Tag as TagType, TagCreateData, Item } from "../types";
import TagSelector from "./TagSelector";

interface TaskFormProps {
  availableTags: TagType[];
  onSubmit: (data: {
    name: string;
    description: string;
    tag_ids: number[];
    expiration_date: string | null;
  }) => Promise<void>;
  onCancel: () => void;
  onCreateTag: (tagData: TagCreateData) => Promise<TagType>;
  mode?: "create" | "edit";
  initialData?: Item;
}

export default function TaskForm({
  availableTags,
  onSubmit,
  onCancel,
  onCreateTag,
  mode = "create",
  initialData,
}: TaskFormProps) {
  const [name, setName] = useState(
    mode === "edit" && initialData ? initialData.name : "",
  );
  const [description, setDescription] = useState(
    mode === "edit" && initialData ? initialData.description || "" : "",
  );
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    mode === "edit" && initialData
      ? initialData.tags?.map((tag) => tag.id) || []
      : [],
  );
  const [expirationDate, setExpirationDate] = useState(
    mode === "edit" && initialData ? initialData.expiration_date || "" : "",
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onSubmit({
      name,
      description,
      tag_ids: selectedTagIds,
      expiration_date: expirationDate || null,
    });

    // Reset form
    setName("");
    setDescription("");
    setSelectedTagIds([]);
    setExpirationDate("");
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setSelectedTagIds([]);
    setExpirationDate("");
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="task-name"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Task name
        </label>
        <input
          id="task-name"
          data-testid="task-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter task name"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          autoFocus
        />
      </div>
      <div>
        <label
          htmlFor="task-description"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Description (optional)
        </label>
        <textarea
          id="task-description"
          data-testid="task-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          rows={3}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div>
        <label
          htmlFor="task-expiration-date"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Expiration date (optional)
        </label>
        <input
          id="task-expiration-date"
          data-testid="task-expiration-date-input"
          type="date"
          value={expirationDate || ""}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div>
        <TagSelector
          availableTags={availableTags}
          selectedTagIds={selectedTagIds}
          onTagsChange={setSelectedTagIds}
          onCreateTag={onCreateTag}
        />
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <button
          data-testid="cancel-task-button"
          type="button"
          onClick={handleCancel}
          className="rounded-md bg-slate-200 text-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-300"
        >
          Cancel
        </button>
        <button
          data-testid={
            mode === "edit" ? "update-task-button" : "create-task-button"
          }
          type="submit"
          className="rounded-md bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-500"
        >
          {mode === "edit" ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
}
