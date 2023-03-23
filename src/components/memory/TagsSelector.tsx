import { trpc } from "../../utils/trpc";

export default function TagsSelector({ tags, onChange }: { tags: string[]; onChange: (newTags: string[]) => void }) {
  const list = trpc.admin.listMemoryTags.useQuery();

  return (
    <div className="block">
      <span>Oznake</span>
      <div className="mt-1 grid grid-cols-2 sm:grid-cols-3">
        {list.data?.map((tag) => {
          const isChecked = tags.includes(tag.id);
          return (
            <label key={tag.id} className="flex items-center">
              <input
                type="checkbox"
                className="rounded-md border-gray-300
                      focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                checked={isChecked}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...tags, tag.id]);
                  } else {
                    onChange(tags.filter((c) => c !== tag.id));
                  }
                }}
              />
              <span className="ml-2">{tag.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
