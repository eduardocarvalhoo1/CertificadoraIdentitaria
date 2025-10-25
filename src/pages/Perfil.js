import React, { useState, useEffect, useContext } from 'react';
import styles from './Perfil.module.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Ícone de usuário para a foto de perfil
const UserDataIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={styles.profileIcon}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

// Componente de Notificação
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      {message}
    </div>
  );
};


export default function Perfil() { 
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    registro: '',
    role: '',
    especialidade: '', // Campo para professor
    curso: '',         // Campo para aluno
  });
  const [originalUserData, setOriginalUserData] = useState(null);
  const [senha, setSenha] = useState({
    atual: '',
    nova: '',
    confirmarNova: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Simula o carregamento dos dados do usuário
  useEffect(() => {
    // Em uma aplicação real, você buscaria os dados de uma API aqui.
    // Alterne o comentário entre os usuários para ver a diferença
    const fetchedUserData = {
      nome: user.name,
      email: user.email,
      registro: user.register,
      role: user.role,
      especialidade: 'Engenharia Mecatrônica',
      curso: ''
    };
    /* const fetchedUserData = {
      nome: 'Ana Pereira',
      email: 'ana.p@example.com',
      registro: 'ALUNO12345',
      role: 'Aluno',
      especialidade: '',
      curso: 'Engenharia de Software'
    }; */
    setUserData(fetchedUserData);
    setOriginalUserData(fetchedUserData);
  }, []);

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSenhaChange = (e) => {
    const { name, value } = e.target;
    setSenha(prev => ({ ...prev, [name]: value }));
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleCancel = () => {
    if (originalUserData) {
        setUserData(originalUserData);
    }
    setSenha({ atual: '', nova: '', confirmarNova: '' });
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setNotification({ message: '', type: '' });

    // Validação de senha
    if (senha.nova && senha.nova !== senha.confirmarNova) {
      showNotification('As novas senhas não correspondem.', 'error');
      setIsSaving(false);
      return;
    }
    
    // Simula uma chamada de API para salvar os dados
    setTimeout(() => {
      // Aqui você adicionaria a lógica para salvar os dados no backend
      console.log('Dados do usuário para salvar:', userData);
      if(senha.nova) {
          console.log('Nova senha a ser salva (após validação de backend com a senha atual).');
      }

      setOriginalUserData(userData); // Atualiza os dados originais com os novos dados salvos
      setIsSaving(false);
      setIsEditing(false);
      setSenha({ atual: '', nova: '', confirmarNova: '' });
      showNotification('Perfil atualizado com sucesso!', 'success');
    }, 1500); // Simula um delay de 1.5s
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  }
  return (
    <div className={styles.container}>
      <Notification 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: '' })} 
      />
      <h2 className={styles.title}>Meu Perfil</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.profileHeader}>
          <div className={styles.profilePicture}>
            <UserDataIcon />
          </div>
          <div className={styles.profileInfo}>
            <h3>{originalUserData?.nome}</h3>
            <p>{originalUserData?.email}</p>
            <span className={styles.badge}>{originalUserData?.role}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Informações Pessoais</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="nome">Nome Completo</label>
              <input type="text" id="nome" name="nome" value={userData.nome} onChange={handleUserDataChange} required disabled={!isEditing} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={userData.email} onChange={handleUserDataChange} required disabled={!isEditing} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="registro">Registro</label>
              <input type="text" id="registro" name="registro" value={userData.registro} disabled />
            </div>
            
            {/* Campo condicional baseado no papel do usuário */}
            {userData.role === 'Professor' && (
              <div className={styles.formGroup}>
                <label htmlFor="especialidade">Especialidade</label>
                <input type="text" id="especialidade" name="especialidade" value={userData.especialidade} onChange={handleUserDataChange} disabled={!isEditing} />
              </div>
            )}
            {userData.role === 'Aluno' && (
              <div className={styles.formGroup}>
                <label htmlFor="curso">Curso</label>
                <input type="text" id="curso" name="curso" value={userData.curso} onChange={handleUserDataChange} disabled={!isEditing} />
              </div>
            )}
          </div>
        </div>
        
        {isEditing && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Alterar Senha</h3>
             <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label htmlFor="atual">Senha Atual</label>
                    <input type="password" id="atual" name="atual" value={senha.atual} onChange={handleSenhaChange} placeholder="********" />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="nova">Nova Senha</label>
                    <input type="password" id="nova" name="nova" value={senha.nova} onChange={handleSenhaChange} placeholder="********"/>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="confirmarNova">Confirmar Nova Senha</label>
                    <input type="password" id="confirmarNova" name="confirmarNova" value={senha.confirmarNova} onChange={handleSenhaChange} placeholder="********"/>
                </div>
             </div>
          </div>
        )}

        <div className={styles.formActions}>
          {isEditing ? (
            <>
              <button type="button" className={`${styles.button} ${styles.cancelButton}`} onClick={handleCancel} disabled={isSaving}>
                Cancelar
              </button>
              <button type="submit" className={styles.button} disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </>
          ) : (
            <button type="button" className={styles.button} onClick={() => setIsEditing(true)}>Editar Perfil</button>
          )}
          <button type="button" className={styles.button} onClick={handleLogout}>Sair </button>
        </div>
      </form>
    </div>
  );
}

