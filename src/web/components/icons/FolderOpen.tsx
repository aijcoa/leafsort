import { memo } from 'react';

interface Props {
  size?: 'small' | 'medium' | 'large';
}

export const FolderOpen = memo((props: Props) => {
  const { size } = props;

  const dimensionsMap = new Map([
    ['small', { height: 20, width: 18 }],
    ['medium', { height: 40, width: 50 }],
    ['large', { height: 100, width: 200 }],
  ]);

  const dimensions = size ? dimensionsMap.get(size) : dimensionsMap.get('medium');
  const height = dimensions?.height;
  const width = dimensions?.width;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 20 22`}
      className="svg"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M5.64929 6.1156H18.3468V4.28092C18.3468 3.26802 17.525 2.44624 16.5121 2.44624H10.3965L7.95028 0H1.83468C0.821402 0 0 0.821402 0 1.83468V14.387L3.46067 7.46486C3.87576 6.63543 4.71666 6.1156 5.64929 6.1156ZM20.7586 7.33872H5.64929C5.1868 7.33872 4.76253 7.59864 4.55612 8.01526L0 17.1237H17.0893C17.5525 17.1237 17.976 16.8618 18.1832 16.4475L21.8526 9.10881C22.2914 8.29429 21.6989 7.33872 20.7586 7.33872Z" />
    </svg>
  );
});

FolderOpen.displayName = 'FolderOpen';
