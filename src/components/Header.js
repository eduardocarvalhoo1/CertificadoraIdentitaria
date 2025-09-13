import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Controle de Oficinas</h1>
      <div className={styles.userInfo}>Usuário Admin</div>
    </header>
  );
}