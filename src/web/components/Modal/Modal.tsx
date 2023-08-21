import { ReactNode, memo } from 'react';

interface Props {
  isOpen: boolean;
  title: string;
  children?: ReactNode;
  onClose: () => void;
  onSubmit: () => void;
}

export const Modal = memo((props: Props) => {
  const { isOpen, onClose, onSubmit, title, children } = props;

  const showHideClass = isOpen ? 'modal d-block' : 'modal d-none';

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
    <div className={showHideClass} onClick={onClose}>
      <section className="modal-main" onClick={(e) => e.stopPropagation()}>
        <p className="text-center">{title}</p>
        {children}
      </section>
    </div>
  );
});

Modal.displayName = 'Modal';
