import { IconSvgProps } from "@/types/types";

export const LandAreaIcon: React.FC<IconSvgProps> = ({
  size,
  width = 48,
  height = 48,
  strokeWidth = 2,
  color = "#292D32",
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 48 48"
    fill="none"
    {...props}
  >
    {/* Outer plot boundary */}
    <rect
      x="6"
      y="6"
      width="36"
      height="36"
      rx="4"
      stroke={color}
      strokeWidth={strokeWidth}
    />

    {/* Diagonal land division */}
    <path
      d="M6 30L18 18L30 30L42 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Measurement lines */}
    <path
      d="M14 10V14M34 10V14M10 34H14M34 34H38"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);
