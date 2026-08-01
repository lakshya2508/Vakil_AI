import React from "react";

interface IconProps {
  d:           string;
  size?:       number;
  color?:      string;
  fill?:       string;
  strokeWidth?: number;
  className?:  string;
  style?:      React.CSSProperties;
}

export default function Icon({
  d,
  size        = 18,
  color       = "currentColor",
  fill        = "none",
  strokeWidth = 1.6,
  className,
  style,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d={d} />
    </svg>
  );
}
