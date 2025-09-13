import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>&copy; {currentYear} Oficinas+. Todos os direitos reservados.</p>
      <div className={styles.links}>
        <a href="/termos">Termos de Uso</a>
        <span>|</span>
        <a href="/privacidade">Política de Privacidade</a>
      </div>
    </footer>
  );
}