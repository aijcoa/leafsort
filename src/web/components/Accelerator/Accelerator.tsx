import React, { memo } from 'react';

interface Props {
  accelerator: string;
}

export const Accelerator = memo((props: Props) => {
  const { accelerator } = props;
  const acceleratorArr = accelerator.split('+');

  return (
    <>
      {acceleratorArr.map((key, index) => {
        return (
          <kbd className="accelerator" key={index}>
            {key}
          </kbd>
        );
      })}
    </>
  );
});

Accelerator.displayName = 'Accelerator';
