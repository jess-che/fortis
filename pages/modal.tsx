import React from 'react';
import styles from './Modal.module.css'; // Make sure this path is correct

interface ModalProps {
  show: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ show, children, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {children}
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
