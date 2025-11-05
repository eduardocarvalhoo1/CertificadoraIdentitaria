import React, { useState, useMemo, useEffect, useContext } from 'react';
import styles from './Oficinas.module.css';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext'; // Importar AuthContext

// Ícones SVG
const AddIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const EditIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
const DeleteIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;

export default function Oficinas() {
  const [oficinas, setOficinas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para modal de deleção
  const [currentOficina, setCurrentOficina] = useState(null);
  const [oficinaToDelete, setOficinaToDelete] = useState(null); // Estado para guardar oficina a deletar
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usar o AuthContext para pegar o token e o perfil do usuário
  const { token, user } = useContext(AuthContext);
  const userRole = user?.role;

  // Buscar dados da API ao montar o componente
  useEffect(() => {
    const fetchOficinas = async () => {
      if (!token) {
        setError("Token não encontrado. Faça login novamente.");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8000/api/oficinas', {
          headers: { 'Authorization': token }
        });
        if (!response.ok) {
          throw new Error('Falha ao buscar oficinas.');
        }
        const data = await response.json();
        setOficinas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOficinas();
  }, [token]); // Depende do token para re-buscar se o usuário logar

  const filteredOficinas = useMemo(() =>
    oficinas.filter(oficina =>
      oficina.tema.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oficina.professor.toLowerCase().includes(searchTerm.toLowerCase())
    ), [oficinas, searchTerm]);

  const handleOpenModal = (oficina = null) => {
    setCurrentOficina(oficina);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentOficina(null);
  };

  const handleOpenDeleteModal = (oficina) => {
    setOficinaToDelete(oficina);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setOficinaToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const fetchAgain = async () => {
    // Função helper para re-buscar dados após salvar ou deletar
    try {
        const response = await fetch('http://localhost:8000/api/oficinas', {
          headers: { 'Authorization': token }
        });
        const data = await response.json();
        setOficinas(data);
    } catch (err) {
        setError("Falha ao atualizar a lista de oficinas.");
    }
  }

  const handleSave = async (formData) => {
    if (!token) {
      setError("Sua sessão expirou. Faça login novamente.");
      return;
    }
    
    const method = currentOficina ? 'PUT' : 'POST';
    const url = currentOficina 
      ? `http://localhost:8000/api/oficinas/${currentOficina.id}`
      : 'http://localhost:8000/api/oficinas';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao salvar oficina.');
      }
      handleCloseModal();
      fetchAgain(); // Re-busca os dados
    } catch (err) {
        setError(err.message);
    }
  };
  
  const handleDelete = async (id) => {
    if (!token) {
        setError("Sua sessão expirou. Faça login novamente.");
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:8000/api/oficinas/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Falha ao excluir oficina.');
        }
        fetchAgain(); // Re-busca os dados
    } catch (err) {
        setError(err.message);
    }
  };

  const confirmDelete = () => {
    if (oficinaToDelete) {
      handleDelete(oficinaToDelete.id);
      handleCloseDeleteModal();
    }
  };

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.header}>
        <h2 className={styles.title}>Gerenciar Oficinas</h2>
        <div className={styles.headerActions}>
            <input
                type="text"
                placeholder="Buscar por tema ou professor..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {userRole === 'professor' && (
              <button className={styles.button} onClick={() => handleOpenModal()}>
                  <AddIcon /> Adicionar Oficina
              </button>
            )}
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tema</th>
              <th>Professor</th>
              <th>Vagas</th>
              <th>Local</th>
              <th>Data</th>
              {userRole === 'professor' && <th className={styles.actionsHeader}>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={userRole === 'professor' ? 6 : 5} className={styles.loading}>Carregando...</td></tr>
            ) : filteredOficinas.length > 0 ? (
              filteredOficinas.map((oficina) => (
                <tr key={oficina.id}>
                  <td>{oficina.tema}</td>
                  <td>{oficina.professor}</td>
                  <td className={styles.centerText}>{oficina.vagas}</td>
                  <td>{oficina.local}</td>
                  <td>{oficina.dataInicio}</td>
                  {userRole === 'professor' && (
                    <td className={styles.actions}>
                      <button className={`${styles.actionButton} ${styles.editButton}`} onClick={() => handleOpenModal(oficina)}>
                        <EditIcon />
                      </button>
                      <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleOpenDeleteModal(oficina)}>
                        <DeleteIcon />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={userRole === 'professor' ? 6 : 5} className={styles.emptyMessage}>Nenhuma oficina encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Adicionar/Editar */}
      <OficinaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        oficina={currentOficina}
      />

      {/* Modal para Confirmar Exclusão */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={handleCloseDeleteModal} 
        title="Confirmar Exclusão"
      >
        <p>Tem certeza que deseja excluir a oficina "<b>{oficinaToDelete?.tema}</b>"?</p>
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

// Componente do Modal para formulário da Oficina
const OficinaModal = ({ isOpen, onClose, onSave, oficina }) => {
    const [formData, setFormData] = useState({
      tema: '',
      professor: '',
      vagas: '',
      local: '',
      dataInicio: '',
      dataFim: '',
    });
  
    React.useEffect(() => {
      if (oficina) {
        setFormData({
          tema: oficina.tema,
          professor: oficina.professor,
          vagas: oficina.vagas,
          local: oficina.local || '',
          dataInicio: oficina.dataInicio || '',
          dataFim: oficina.dataFim || '',
        });
      } else {
        setFormData({ tema: '', professor: '', vagas: '', local: '', dataInicio: '', dataFim: '' });
      }
    }, [oficina, isOpen]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={oficina ? 'Editar Oficina' : 'Adicionar Oficina'}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="tema">Tema</label>
            <input type="text" id="tema" name="tema" value={formData.tema} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="professor">Professor</label>
            <input type="text" id="professor" name="professor" value={formData.professor} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="vagas">Vagas</label>
            <input type="number" id="vagas" name="vagas" value={formData.vagas} onChange={handleChange} required min="0" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="local">Local</label>
            <input type="text" id="local" name="local" value={formData.local} onChange={handleChange} required />
          </div>
           <div className={styles.formGroup}>
            <label htmlFor="dataInicio">Data de Início</label>
            <input type="date" id="dataInicio" name="dataInicio" value={formData.dataInicio} onChange={handleChange} required />
          </div>
           <div className={styles.formGroup}>
            <label htmlFor="dataFim">Data de Fim (Opcional)</label>
            <input type="date" id="dataFim" name="dataFim" value={formData.dataFim} onChange={handleChange} />
          </div>
          <div className={styles.formActions}>
            <button type="button" className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.button}>{oficina ? 'Salvar Alterações' : 'Adicionar'}</button>
          </div>
        </form>
      </Modal>
    );
  };