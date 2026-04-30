import type { ReactElement, SVGProps } from 'react';

type IconName =
  | 'plus'
  | 'trash'
  | 'copy'
  | 'check'
  | 'home'
  | 'refresh'
  | 'logo';

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
};

const PATHS: Record<IconName, ReactElement> = {
  plus: (
    <path
      d="M10 4.5v11M4.5 10h11"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  ),
  trash: (
    <>
      <path
        d="M3.5 5.5h13M8 5.5V4.25A1.25 1.25 0 0 1 9.25 3h1.5A1.25 1.25 0 0 1 12 4.25V5.5M5 5.5l.75 9.5A1.5 1.5 0 0 0 7.25 16.5h5.5A1.5 1.5 0 0 0 14.25 15L15 5.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),
  copy: (
    <>
      <rect
        x="6.5"
        y="6.5"
        width="9"
        height="10"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d="M4.5 13V5.25A1.75 1.75 0 0 1 6.25 3.5H12.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
  check: (
    <path
      d="M4.5 10.5l3.5 3.5 7.5-8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  home: (
    <path
      d="M3.5 9.5 10 4l6.5 5.5V15a1.5 1.5 0 0 1-1.5 1.5h-2.5V12h-5v4.5H5A1.5 1.5 0 0 1 3.5 15Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  refresh: (
    <path
      d="M15.5 7.5A6 6 0 1 0 16 12.5M15.5 4v3.5H12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  logo: (
    <>
      <path
        d="M3 13.5c2.7-2 4.7-3 6-3s3.3 1 6 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M3 9.5c2.7-2 4.7-3 6-3s3.3 1 6 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M3 5.5c2.7-2 4.7-3 6-3s3.3 1 6 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.25"
      />
    </>
  ),
};

export function Icon({ name, size = 20, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
