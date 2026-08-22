import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  color?: string;
}

export const IconUser: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M12 4a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V8a4 4 0 0 1 4-4Z" fill={color} />
    <path d="M4 20v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2H4Z" fill={color} />
  </svg>
);

export const IconBriefcase: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M9 3h6v3H9V3Z" fill={color} />
    <path fillRule="evenodd" clipRule="evenodd" d="M3 6h18v14H3V6Zm2 2v10h14V8H5Z" fill={color} />
    <path d="M9 11h6v2H9v-2Z" fill={color} />
  </svg>
);

export const IconSettings: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M10 2h4v3h-4V2Zm0 17h4v3h-4v-3ZM2 10h3v4H2v-4Zm17 0h3v4h-3v-4Zm-9-3h4v10h-4V7Zm-3 3h10v4H7v-4Z" fill={color} />
  </svg>
);

export const IconDice: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="3" fill="#17162E" stroke={color} strokeWidth="2" />
    <rect x="7" y="7" width="3" height="3" fill={color} />
    <rect x="14" y="7" width="3" height="3" fill={color} />
    <rect x="10.5" y="10.5" width="3" height="3" fill={color} />
    <rect x="7" y="14" width="3" height="3" fill={color} />
    <rect x="14" y="14" width="3" height="3" fill={color} />
  </svg>
);

export const IconMic: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M8 5a4 4 0 0 1 8 0v6a4 4 0 0 1-8 0V5Z" fill={color} />
    <path d="M4 11v1a8 8 0 0 0 7 7.93V22h2v-2.07A8 8 0 0 0 20 12v-1h-2v1a6 6 0 0 1-12 0v-1H4Z" fill={color} />
  </svg>
);

export const IconCamera: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M9 4h6l2 3h4v13H3V7h4l2-3Z" fill={color} />
    <circle cx="12" cy="13" r="4" fill="#070816" />
    <circle cx="12" cy="13" r="2" fill={color} />
  </svg>
);

export const IconLock: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M7 10V7a5 5 0 0 1 10 0v3h2v11H5V10h2Zm2 0h6V7a3 3 0 0 0-6 0v3Z" fill={color} />
  </svg>
);

export const IconShieldCheck: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M12 2 3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4Zm-1 14-4-4 1.41-1.41L11 13.17l5.59-5.58L18 9l-7 7Z" fill={color} />
  </svg>
);

export const IconCheck: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z" fill={color} />
  </svg>
);

export const IconAlert: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M12 2 1 21h22L12 2Zm1 15h-2v-2h2v2Zm0-4h-2V9h2v4Z" fill={color} />
  </svg>
);

export const IconSearch: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z" fill={color} />
  </svg>
);

export const IconSparkles: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2Zm7 14-1.25 3.75L14 21l3.75 1.25L19 26l1.25-3.75L24 21l-3.75-1.25L19 16Z" fill={color} />
  </svg>
);

export const IconCompass: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm2-12-6 2 2 6 6-2-2-6Z" fill={color} />
  </svg>
);

export const IconClock: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 11h-4v-2h2V6h2v7Z" fill={color} />
  </svg>
);

export const IconBroadcast: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M12 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-6.36-4.95a9 9 0 0 0 0 12.73l1.41-1.41a7 7 0 0 1 0-9.91L5.64 6.05Zm12.72 0-1.41 1.41a7 7 0 0 1 0 9.91l1.41 1.41a9 9 0 0 0 0-12.73ZM3.51 3.93a12 12 0 0 0 0 16.97l1.42-1.41a10 10 0 0 1 0-14.15L3.51 3.93Zm16.98 0-1.42 1.41a10 10 0 0 1 0 14.15l1.42 1.41a12 12 0 0 0 0-16.97Z" fill={color} />
  </svg>
);

export const IconRefresh: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35Z" fill={color} />
  </svg>
);

export const IconArrowRight: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8Z" fill={color} />
  </svg>
);

export const IconMail: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" fill={color} />
  </svg>
);

export const IconPhone: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2Z" fill={color} />
  </svg>
);

export const IconCode: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="m9.4 16.6-4.6-4.6 4.6-4.6L8 6l-6 6 6 6 1.4-1.4Zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4Z" fill={color} />
  </svg>
);
