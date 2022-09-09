import React, { useEffect } from 'react';
import { useAppSelector } from './store';
import { selectAccess } from './store/access/AccessSlice';
import { useActions } from './hooks/useActions';
import { cookie } from './utils/cookie';
import Yandex from '../icons/yandex.svg';
import { Base64 } from 'js-base64';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


const App = () => {
  const { userInfo } = useAppSelector(selectAccess);
  const { setUserInfo } = useActions();

  useEffect(() => {
    if (cookie.error) {
      const error = JSON.parse(decodeURIComponent(cookie.error));
      toast.error(error.message);
      document.cookie = 'error=; max-age=-1';
    }
    
    if (cookie.JWT) {
      const payload = cookie.JWT.split('.')[1];
      setUserInfo(JSON.parse(Base64.decode(payload)));
    }

    if (location.search) {
      history.pushState('', '', location.origin + location.pathname);
    }
  }, []);

  function noLogout() {
    toast('Отсюда нет выхода!');
  }

  function login() {
    location.href = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${cookie.client_id}&redirect_uri=https://localhost:5320`;
  }

  return (
    <div className='page-container'>
      {userInfo ? (
        <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
          <h2>Успешный вход, {userInfo.first_name}!</h2>
          <button className='btn btn--yandex' onClick={noLogout}>Выйти</button>
        </div>
      ) : (
        <button className='btn btn--yandex' onClick={login}>
          <Yandex />
          Войти с Яндекс ID
        </button>
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
