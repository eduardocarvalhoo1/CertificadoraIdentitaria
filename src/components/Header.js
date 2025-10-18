import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

export default function Header() {
  const {user} = useContext(AuthContext);

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Controle de Oficinas</h1>
      {user ? 
        <Link to="/perfil" className={styles.userProfile}>
          <UserIcon />
          <span>{user.name}</span>
        </Link> :
        <Link to="/login" className={styles.userProfile}>
          <UserIcon />
          <span>Login</span>
        </Link>

      }
    </header>
  );
}
