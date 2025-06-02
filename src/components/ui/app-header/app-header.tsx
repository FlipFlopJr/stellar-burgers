import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './app-header.module.css';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { TAppHeaderUIProps } from './type';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <div
            className={styles.link}
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <BurgerIcon type='primary' />
            <span className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </span>
          </div>
          <div
            className={styles.link}
            onClick={() => navigate('/feed')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ListIcon type='primary' />
            <span className='text text_type_main-default ml-2'>
              Лента заказов
            </span>
          </div>
        </div>
        <div
          className={styles.logo}
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <Logo className='' />
        </div>
        <div
          className={styles.link_position_last}
          onClick={() => navigate('/profile')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ProfileIcon type='primary' />
          <span className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </span>
        </div>
      </nav>
    </header>
  );
};
