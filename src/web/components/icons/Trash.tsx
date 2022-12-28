import React, { memo } from 'react';

export const Trash = memo(() => (
  <svg
    width="20"
    height="22"
    viewBox="0 0 20 22"
    className="svg"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M5.80937 0.760117C6.04141 0.29425 6.51836 0 7.03828 0H12.2117C12.7316 0 13.2086 0.29425 13.4406 0.760117L13.75 1.375H17.875C18.6355 1.375 19.25 1.99074 19.25 2.75C19.25 3.50926 18.6355 4.125 17.875 4.125H1.375C0.615742 4.125 0 3.50926 0 2.75C0 1.99074 0.615742 1.375 1.375 1.375H5.5L5.80937 0.760117ZM16.9641 20.0277C16.8953 21.1535 15.9973 22 14.9059 22H4.34414C3.25488 22 2.3534 21.1535 2.28551 20.0277L1.33633 5.5H17.875L16.9641 20.0277Z" />
  </svg>
));

Trash.displayName = 'Trash';
