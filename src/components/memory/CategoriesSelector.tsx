import { trpc } from "../../utils/trpc";

export default function CategoriesSelector({
  categories,
  onChange,
}: {
  categories: string[];
  onChange: (newCategories: string[]) => void;
}) {
  const list = trpc.admin.listMemoryCategories.useQuery();

  return (
    <div className="block">
      <span>Kategorije</span>
      <div className="mt-1 grid grid-cols-2 sm:grid-cols-3">
        {list.data
          ?.sort((a, b) => (a.name === "Ostalo" ? 1 : b.name === "Ostalo" ? -1 : 0))
          .map((category) => {
            const isChecked = categories.includes(category.id);
            return (
              <label key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded-md border-gray-300
                      focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  checked={isChecked}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...categories, category.id]);
                    } else {
                      onChange(categories.filter((c) => c !== category.id));
                    }
                  }}
                />
                <span className="ml-2">{category.name}</span>
              </label>
            );
          })}
      </div>
    </div>
  );
}
