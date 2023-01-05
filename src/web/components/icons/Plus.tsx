import { memo } from 'react';

interface Props {
  size?: 'small' | 'medium' | 'large';
}

export const Plus = memo((props: Props) => {
  const { size } = props;

  const dimensionsMap = new Map([
    ['small', { height: 20, width: 18 }],
    ['medium', { height: 50, width: 60 }],
    ['large', { height: 100, width: 200 }],
  ]);

  const dimensions = size ? dimensionsMap.get(size) : dimensionsMap.get('medium');
  const height = dimensions?.height;
  const width = dimensions?.width;

  return (
    <svg width={width} height={height} viewBox="0 0 20 22" xmlns="http://www.w3.org/2000/svg">
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M6 6V1C6 0.44772 6.4477 0 7 0C7.5523 0 8 0.44772 8 1V6H13C13.5523 6 14 6.4477 14 7C14 7.5523 13.5523 8 13 8H8V13C8 13.5523 7.5523 14 7 14C6.4477 14 6 13.5523 6 13V8H1C0.44772 8 0 7.5523 0 7C0 6.4477 0.44772 6 1 6H6z"
      />
    </svg>
  );
});

Plus.displayName = 'Plus';
