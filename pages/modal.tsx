import React from 'react';
import styles from './modal.module.css'; // Make sure this path is correct
import ReactDOM from 'react-dom';


interface ModalProps {
  show: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ show, children, onClose }) => {
  if (!show) {
    return null;
  }

  return ReactDOM.createPortal(
    (
      <div className={styles.modal} onClick={onClose}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          {children}
          <button onClick={onClose} className={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    ),
    document.body // Attaches the modal directly to the body
  );
};

export default Modal;
