import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const pathname = useLocation().pathname;
  const isAuthorized = Boolean(userName);
  const isConstructorPage = pathname.includes('/ingredients');
  const constructorLink = isConstructorPage ? pathname : '/';

  const navLinkClass = (isActive: boolean) =>
    `text text_type_main-medium text-primary-color pt-4 pb-4 ${styles.link} ${
      isActive ? styles.link_active : ''
    }`;

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to={constructorLink}
            className={({ isActive }) => navLinkClass(isActive)}
          >
            <BurgerIcon type='primary' />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>
          <NavLink
            to='/feed'
            className={({ isActive }) => navLinkClass(isActive)}
          >
            <ListIcon type='primary' />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <NavLink to='/' className={({ isActive }) => navLinkClass(isActive)}>
            <Logo className='' />
          </NavLink>
        </div>

        <div className={styles.link_position_last}>
          <NavLink
            to={isAuthorized ? '/profile' : '/login'}
            className={({ isActive }) => navLinkClass(isActive)}
          >
            <ProfileIcon type='primary' />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
