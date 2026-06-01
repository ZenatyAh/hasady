// src/components/merchant/icons.tsx

import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export function FarmsIcon(props: IconProps) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Monitor outline */}
      <rect
        x="4"
        y="5"
        width="20"
        height="14"
        rx="3"
        stroke="#265C38"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Base stand */}
      <path
        d="M11 19L9 23H19L17 19"
        stroke="#265C38"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Plant inside monitor */}
      <path d="M14 9V14" stroke="#265C38" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M14 11C14 11 11.5 11 11.5 10"
        stroke="#265C38"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 12C14 12 16.5 12 16.5 11"
        stroke="#265C38"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Plant pot */}
      <path d="M12 14H16L15.5 16.5H12.5L12 14Z" fill="#265C38" />
    </svg>
  );
}

export function AddFarmIcon(props: IconProps) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Land outline */}
      <path
        d="M4 21C7 17.5 11 16 15 17.5C19 19 21 17.5 23 21"
        stroke="#265C38"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3 23C7 20.5 13 20.5 17 21.5C21 22.5 25 23 25 23"
        stroke="#265C38"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Plant growing */}
      <path d="M9 13V18" stroke="#265C38" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 15C9 15 7.5 15.5 7 15" stroke="#265C38" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M9 16C9 16 10.5 16.5 11 16"
        stroke="#265C38"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Main plant */}
      <path d="M15 10V18" stroke="#265C38" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M15 12C15 12 13 12.5 12.5 12"
        stroke="#265C38"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15 13C15 13 17.5 13.5 18 13"
        stroke="#265C38"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Plus badge on top right */}
      <path d="M21 4V10M18 7H24" stroke="#265C38" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function ManageCropsIcon(props: IconProps) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Soil */}
      <path
        d="M4 22C8 20.5 14 20.5 18 21.5C21 22.5 24 22"
        stroke="#265C38"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Plant 1 */}
      <path d="M8 14V21" stroke="#265C38" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 16C8 16 6.5 16.5 6 16" stroke="#265C38" strokeWidth="1.2" strokeLinecap="round" />
      <path
        d="M8 17.5C8 17.5 9.5 18 10 17.5"
        stroke="#265C38"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Plant 2 (center) */}
      <path d="M14 9V21" stroke="#265C38" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M14 11.5C14 11.5 11.5 12 11 11.5"
        stroke="#265C38"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 13.5C14 13.5 16.5 14 17 13.5"
        stroke="#265C38"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 16C14 16 12 16.5 11.5 16"
        stroke="#265C38"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Plant 3 */}
      <path d="M20 14V21" stroke="#265C38" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M20 16.5C20 16.5 18.5 17 18 16.5"
        stroke="#265C38"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M20 18C20 18 21.5 18.5 22 18"
        stroke="#265C38"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AddCropIcon(props: IconProps) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Tractor outline */}
      <rect
        x="4"
        y="14"
        width="10"
        height="7"
        rx="1.5"
        stroke="#265C38"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="14"
        y="10"
        width="8"
        height="11"
        rx="2"
        stroke="#265C38"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wheels */}
      <circle cx="9" cy="21" r="3" stroke="#265C38" strokeWidth="2" fill="#ffffff" />
      <circle cx="18" cy="21" r="3.5" stroke="#265C38" strokeWidth="2" fill="#ffffff" />
      {/* Chimney */}
      <path
        d="M7 10V14"
        stroke="#265C38"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 10H8" stroke="#265C38" strokeWidth="1.5" strokeLinecap="round" />
      {/* Plus badge on top right */}
      <path
        d="M22 3V9M19 6H25"
        stroke="#265C38"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PaymentsIcon(props: IconProps) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Wallet body */}
      <rect
        x="4"
        y="8"
        width="20"
        height="15"
        rx="3.5"
        stroke="#265C38"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Flap */}
      <path
        d="M24 12H20C18.8954 12 18 12.8954 18 14C18 15.1046 18.8954 16 20 16H24"
        stroke="#265C38"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Flap snap dot */}
      <circle cx="21" cy="14" r="1" fill="#265C38" />
      {/* Coin peaking */}
      <path
        d="M10 8C10 5.23858 12.2386 3 15 3C17.7614 3 20 5.23858 20 8"
        stroke="#265C38"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PurchaseOrdersIcon(props: IconProps) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Lines */}
      <path
        d="M10 8H23M10 14H23M10 20H23"
        stroke="#265C38"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Checkmarks */}
      <path
        d="M4 8.5L5.5 10L8 7"
        stroke="#265C38"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 14.5L5.5 16L8 13"
        stroke="#265C38"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 20.5L5.5 22L8 19"
        stroke="#265C38"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ReviewsIcon(props: IconProps) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Badge container */}
      <path
        d="M14 4L22 7.5V13C22 18.5 18.5 23 14 24.5C9.5 23 6 18.5 6 13V7.5L14 4Z"
        stroke="#265C38"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner Star */}
      <path
        d="M14 9L15.5 12L18.5 12.3L16.2 14.5L16.8 17.5L14 15.8L11.2 17.5L11.8 14.5L9.5 12.3L12.5 12L14 9Z"
        fill="#265C38"
        stroke="#265C38"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NotificationsIcon(props: IconProps) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Message square body */}
      <rect
        x="4"
        y="6"
        width="18"
        height="17"
        rx="4.5"
        stroke="#265C38"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Line 1 */}
      <path
        d="M8 11H15M8 15H18"
        stroke="#265C38"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dot overlay on top right */}
      <circle cx="21" cy="7" r="3.5" fill="#265C38" stroke="#ffffff" strokeWidth="1" />
    </svg>
  );
}

export function TrackOrdersIcon(props: IconProps) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Clipboard base */}
      <path
        d="M8 6C8 4.89543 8.89543 4 10 4H18C19.1046 4 20 4.89543 20 6V22C20 23.1046 19.1046 24 18 24H10C8.89543 24 8 23.1046 8 22V6Z"
        stroke="#265C38"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Clipboard clip */}
      <path
        d="M11 4.5V6H17V4.5"
        stroke="#265C38"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Document content lines */}
      <path
        d="M11 10H17M11 14H15"
        stroke="#265C38"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Circular check overlay bottom-right */}
      <circle cx="19" cy="19" r="5" fill="#265C38" />
      <path
        d="M17 19L18.5 20.5L21.5 17.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
