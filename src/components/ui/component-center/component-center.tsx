import { FC, memo } from 'react';
import { TCenterComponent } from './type';
import styles from './component-center.module.css';

export const CenterComp: FC<TCenterComponent> = memo(
  ({ title, titleStyle, children }) => (
    <>
      <div className={styles.center}>
        <div className={styles.headerCenter}>
          <h3 className={`text ${titleStyle}`}>{title}</h3>
        </div>
        <div>{children}</div>
      </div>
    </>
  )
);
