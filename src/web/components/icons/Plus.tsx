import { memo } from 'react';

export const Plus = memo(() => {
  return (
    <svg width="18" height="22" viewBox="0 0 20 22" xmlns="http://www.w3.org/2000/svg">
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M6 6V1C6 0.44772 6.4477 0 7 0C7.5523 0 8 0.44772 8 1V6H13C13.5523 6 14 6.4477 14 7C14 7.5523 13.5523 8 13 8H8V13C8 13.5523 7.5523 14 7 14C6.4477 14 6 13.5523 6 13V8H1C0.44772 8 0 7.5523 0 7C0 6.4477 0.44772 6 1 6H6z"
      />
    </svg>
  );
});

Plus.displayName = 'Plus';
