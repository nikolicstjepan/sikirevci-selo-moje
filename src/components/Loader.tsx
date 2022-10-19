const sizes = {
  xs: [25, 25],
  sm: [50, 50],
  md: [100, 100],
  lg: [150, 150],
};

export default function Loader({ size = "md" }: { size?: "sm" | "md" | "lg" | "xs" }) {
  const [width, height] = sizes[size];

  if (!width || !height) {
    return null;
  }

  return (
    <div className="mx-auto">
      <svg
        version="1.1"
        id="L9"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox={`0 0 ${width} ${height}`}
        enableBackground="new 0 0 0 0"
        xmlSpace="preserve"
        width={`${width}px`}
        height={`${height}px`}
      >
        <circle
          cx={width / 2}
          cy={height / 2}
          r={width / 4}
          fill="none"
          strokeWidth={width / 10}
          stroke="#fff"
          strokeLinecap="round"
          strokeDasharray={`${width / 5}, ${width / 5}`}
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            dur="1.8s"
            from={`0 ${width / 2} ${height / 2}`}
            to={`360 ${width / 2} ${height / 2}`}
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}
