import { memo } from 'react';
import './Accelerator.scss';

interface Props {
  accelerator?: string;
}

export const Accelerator = memo((props: Props) => {
  const { accelerator } = props;

  const modifierLabels = {
    ctrl: '\u2303',
    shift: '⇧',
    alt: '⌥',
    meta: '⌘',
    up: '↑',
    down: '↓',
    left: '←',
    right: '→',
    separator: '',
  };

  const acceleratorArr = accelerator?.split('+');

  return (
    <>
      {acceleratorArr?.map((key, index) => (
        <kbd className="accelerator" key={index}>
          {modifierLabels[key as keyof typeof modifierLabels] || key.toUpperCase()}
        </kbd>
      ))}
    </>
  );
});

Accelerator.displayName = 'Accelerator';
