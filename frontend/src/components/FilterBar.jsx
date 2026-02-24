import { useForm } from "react-hook-form";

export default function FilterBar({ onFilter }) {
  const { register, handleSubmit, reset } = useForm();

  function apply(values) {
    // remove empty values
    const f = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== undefined && v !== ""),
    );
    onFilter(f);
  }

  return (
    <form
      onSubmit={handleSubmit(apply)}
      className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2"
    >
      <input
        {...register("q")}
        placeholder="Search by name or email"
        className="w-full border border-slate-200 dark:border-slate-700 rounded px-3 py-2 bg-transparent"
      />
      <input
        {...register("organization")}
        placeholder="Organization"
        className="w-full border border-slate-200 dark:border-slate-700 rounded px-3 py-2 bg-transparent"
      />
      <div className="flex gap-2">
        <button
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded"
          type="submit"
        >
          Apply
        </button>
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border rounded border-slate-300 text-slate-700"
          onClick={() => {
            reset();
            onFilter({});
          }}
        >
          Clear
        </button>
      </div>
    </form>
  );
}
