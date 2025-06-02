import React, { FC } from 'react';
import {
  Input,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link } from 'react-router-dom';
import { RegisterUIProps } from './type';
import { Preloader } from '@ui';

export const RegisterUI: FC<RegisterUIProps> = ({
  userName,
  setUserName,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  errorText,
  isLoading
}) => (
  <main className={styles.container}>
    <div className={`pt-6 ${styles.wrapCenter}`}>
      <h3 className='pb-6 text text_type_main-medium'>Регистрация</h3>
      <form className={`pb-15 ${styles.form}`} onSubmit={handleSubmit}>
        <div className='pb-6'>
          <Input
            type='text'
            placeholder='Имя'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            name='name'
            error={Boolean(errorText)}
            errorText={''}
            size='default'
            disabled={isLoading}
          />
        </div>
        <div className='pb-6'>
          <Input
            type='email'
            placeholder='E-mail'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name='email'
            error={Boolean(errorText)}
            errorText={errorText}
            size='default'
            disabled={isLoading}
          />
        </div>
        <div className='pb-6'>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name='password'
            disabled={isLoading}
          />
        </div>
        <div className={`pb-6 ${styles.button}`}>
          <Button
            htmlType='submit'
            type='primary'
            size='medium'
            disabled={isLoading}
          >
            {isLoading ? <Preloader /> : 'Зарегистрироваться'}
          </Button>
        </div>
      </form>
      <div className={`${styles.question} text text_type_main-default pb-6`}>
        Уже зарегистрированы?
        <Link to='/login' className={`pl-2 ${styles.link}`}>
          Войти
        </Link>
      </div>
    </div>
  </main>
);
