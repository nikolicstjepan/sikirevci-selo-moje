type CommentProps = {
  width: string;
  height?: string;
  color?: string;
};

export default function Comment({ width, height, color }: CommentProps) {
  return (
    <svg
      version="1.1"
      baseProfile="tiny"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={`${width}`}
      height={`${height || width}`}
      fill={color || "white"}
      viewBox="-0.5 0.5 42 42"
    >
      <path
        d="M29.5,30.5h7c2.529,0,3-0.529,3-3v-21c0-2.41-0.59-3-3-3h-32c-2.47,0-3,0.53-3,3v20.971c0,2.469,0.41,3.029,3,3.029h13
	c0,0,9.562,8.756,10.75,9.812c0.422,0.375,1.281,0.172,1.25-0.812V30.5z M7.5,21.5h21v3h-21V21.5z M7.5,15.5h13v3h-13V15.5z
	 M7.5,9.5h26v3h-26V9.5z"
      />
    </svg>
  );
}
