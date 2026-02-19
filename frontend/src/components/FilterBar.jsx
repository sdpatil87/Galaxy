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
        className="input"
      />
      <input
        {...register("organization")}
        placeholder="Organization"
        className="input"
      />
      <div className="flex gap-2">
        <button className="btn-primary" type="submit">
          Apply
        </button>
        <button
          type="button"
          className="btn-outline"
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
