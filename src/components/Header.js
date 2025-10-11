import styles from './Header.module.css';
import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Controle de Oficinas</h1>
      
      <nav >
        <NavLink to="/login">
          <div className={styles.userInfo}>Usuário Admin</div>
        </NavLink>
      </nav>
    </header>
  );
}