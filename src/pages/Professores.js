import React, { useState, useEffect, useMemo, useContext } from 'react';
import styles from './Professores.module.css';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext'; // Importar AuthContext

// Ícones SVG
const AddIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const EditIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
const DeleteIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;

// Removido initialProfessores, virá da API

export default function Professores() {
  const [professores, setProfessores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal de deleção
  const [currentProfessor, setCurrentProfessor] = useState(null);
  const [professorToDelete, setProfessorToDelete] = useState(null); // Professor a deletar
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usar o AuthContext
  const { token, user } = useContext(AuthContext);
  const userRole = user?.role; // Já temos o userRole aqui

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // const token = localStorage.getItem('accessToken'); // Antigo
        // const userId = localStorage.getItem('userId'); // Antigo
        
        if (!token) {
          throw new Error('Você precisa estar logado para acessar esta página');
        }

        // Não precisa buscar o perfil, já temos o userRole
        
        const professorResponse = await fetch('http://localhost:8000/api/professor', {
            headers: { 'Authorization': token }
        });

        if (!professorResponse.ok) {
          throw new Error('Falha ao buscar professores');
        }
        const data = await professorResponse.json();
        setProfessores(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]); // Depende apenas do token

  const filteredProfessores = useMemo(() =>
    professores.filter(prof =>
      prof.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prof.especialidade && prof.especialidade.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [professores, searchTerm]);

  const handleOpenModal = (prof = null) => {
    setCurrentProfessor(prof);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProfessor(null);
  };

  const handleOpenDeleteModal = (professor) => {
    setProfessorToDelete(professor);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setProfessorToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // ATENÇÃO: A API de professores não tem POST, PUT, DELETE
  // Essas funções são apenas MOCKUPs locais por enquanto
  // Você precisará implementar os controllers no backend para isso
  const handleSave = (formData) => {
    // TODO: Implementar chamada de API (POST/PUT)
    console.log("Salvando (simulado):", formData);
    if (currentProfessor && currentProfessor.id) {
      setProfessores(professores.map(p => (p.id === currentProfessor.id ? { ...p, ...formData } : p)));
    } else {
      const newId = professores.length > 0 ? Math.max(...professores.map(p => p.id)) + 1 : 1;
      setProfessores([...professores, { id: newId, ...formData }]);
    }
    handleCloseModal();
  };
  
  const handleDelete = (id) => {
     // TODO: Implementar chamada de API (DELETE)
     console.log("Deletando (simulado):", id);
     setProfessores(professores.filter(p => p.id !== id));
  };

  const confirmDelete = () => {
    if (professorToDelete) {
      handleDelete(professorToDelete.id);
      handleCloseDeleteModal();
    }
  };

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.header}>
        <h2 className={styles.title}>Gerir Professores e Tutores</h2>
        <div className={styles.headerActions}>
            <input
                type="text"
                placeholder="Buscar por nome ou especialidade..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* O ideal é que apenas 'professor' possa adicionar outros? Ajuste a regra se necessário */}
            {userRole === 'professor' && (
              <button className={styles.button} onClick={() => handleOpenModal()}>
                  <AddIcon /> Adicionar Profissional
              </button>
            )}
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Especialidade</th>
              <th>Tipo</th>
              {userRole === 'professor' && <th className={styles.actionsHeader}>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={userRole === 'professor' ? 4 : 3} className={styles.loading}>Carregando...</td></tr>
            ) : filteredProfessores.length > 0 ? (
                filteredProfessores.map((prof) => (
                <tr key={prof.id}>
                    <td>{prof.nome}</td>
                    <td>{prof.especialidade || 'N/A'}</td>
                    <td>
                    <span className={`${styles.badge} ${prof.role === 'professor' ? styles.badgeProfessor : styles.badgeTutor}`}>
                        {prof.role}
                    </span>
                    </td>
                    {userRole === 'professor' && (
                      <td className={styles.actions}>
                          <button className={`${styles.actionButton} ${styles.editButton}`} onClick={() => handleOpenModal(prof)}>
                              <EditIcon />
                          </button>
                          <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleOpenDeleteModal(prof)}>
                              <DeleteIcon />
                          </button>
                      </td>
                    )}
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={userRole === 'professor' ? 4 : 3} className={styles.emptyMessage}>Nenhum profissional encontrado.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProfessorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        professor={currentProfessor}
      />

      {/* Modal para Confirmar Exclusão */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={handleCloseDeleteModal} 
        title="Confirmar Exclusão"
      >
        <p>Tem certeza que deseja excluir o profissional "<b>{professorToDelete?.nome}</b>"?</p>
        <div className={styles.formActions}>
          <button type="button" className={`${styles.button} ${styles.cancelButton}`} onClick={handleCloseDeleteModal}>
            Cancelar
          </button>
          <button type="button" className={`${styles.button} ${styles.deleteButton}`} onClick={confirmDelete}>
            Excluir
          </button>
        </div>
      </Modal>
    </div>
  );
}

// Componente do Modal para formulário de Professor/Tutor
const ProfessorModal = ({ isOpen, onClose, onSave, professor }) => {
    const [formData, setFormData] = useState({
      nome: '',
      especialidade: '',
      role: 'professor', // Nome do campo deve ser 'role' como no backend
    });
  
    React.useEffect(() => {
      if (professor) {
        setFormData({
          nome: professor.nome,
          especialidade: professor.especialidade || '',
          role: professor.role,
        });
      } else {
        setFormData({ nome: '', especialidade: '', role: 'professor' });
      }
    }, [professor, isOpen]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={professor ? 'Editar Profissional' : 'Adicionar Profissional'}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="nome">Nome</label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="especialidade">Especialidade</label>
            <input type="text" id="especialidade" name="especialidade" value={formData.especialidade} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="role">Tipo</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
                <option value="professor">Professor</option>
                <option value="tutor">Tutor</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button type="button" className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.button}>{professor ? 'Salvar Alterações' : 'Adicionar'}</button>
          </div>
        </form>
      </Modal>
    );
  };