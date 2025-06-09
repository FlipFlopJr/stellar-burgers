import styles from './modal-overlay.module.css';
import { FC, HTMLAttributes } from 'react';

type ModalOverlayUIProps = {
  onClick: () => void;
} & HTMLAttributes<HTMLDivElement>;

export const ModalOverlayUI: FC<ModalOverlayUIProps> = ({
  onClick,
  ...rest
}) => <div className={styles.overlay} onClick={onClick} {...rest} />;
