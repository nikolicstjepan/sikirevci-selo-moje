import Image from "next/future/image";

type UserAvatarProps = {
  user?: {
    name: string | null;
    image: string | null;
  } | null;
  size?: "sm" | "md" | "lg";
};

export default function UserAvatar({ user, size = "sm" }: UserAvatarProps) {
  if (!user) {
    return <UserAvatarLoader />;
  }

  let sizeClass = "w-9 h-9";

  if (size === "md") {
    sizeClass = "w-12 h-12";
  } else if (size === "lg") {
    sizeClass = "w-16 h-16";
  }

  return (
    <div className={`flex-shrink-0 ${sizeClass} rounded-full relative`}>
      <Image
        className="bg-white object-cover rounded-full"
        src={(user.image as string) || "/guest.png"}
        alt={(user.name as string) || ""}
        fill
        sizes="10vw"
      />
    </div>
  );
}

export function UserAvatarLoader() {
  return <div className="flex-shrink-0 w-9 h-9 rounded-full relative bg-white"></div>;
}
