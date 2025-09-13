import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const menuItems = [
    { to: "/", label: "Dashboard" },
    { to: "/oficinas", label: "Oficinas" },
    { to: "/alunos", label: "Alunos" },
    { to: "/professores", label: "Professores" },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Oficinas+</div>
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}