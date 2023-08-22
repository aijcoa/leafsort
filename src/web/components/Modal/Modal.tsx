import { ReactNode, memo } from 'react';

interface Props {
  title: string;
  children?: ReactNode;
  onClose: () => void;
  onSubmit: () => void;
}

export const Modal = memo((props: Props) => {
  const { onClose, onSubmit, title, children } = props;

  window.onkeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        onSubmit();

        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  return (
    <div className={'modal d-block'} onClick={onClose}>
      <section className="modal-main" onClick={(e) => e.stopPropagation()}>
        <p className="text-center">{title}</p>
        {children}
      </section>
    </div>
  );
});

Modal.displayName = 'Modal';
