import React, { useState, useMemo } from 'react';
import styles from './Oficinas.module.css';
import Modal from '../components/Modal';

// Ícones SVG
const AddIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const EditIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
const DeleteIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;

const initialOficinas = [
  { id: 1, tema: "Introdução à Robótica", professor: "Dr. Silva", vagas: 20 },
  { id: 2, tema: "Desenvolvimento Web", professor: "Dra. Costa", vagas: 15 },
  { id: 3, tema: "Inteligência Artificial", professor: "Dr. Almeida", vagas: 10 },
];

export default function Oficinas() {
  const [oficinas, setOficinas] = useState(initialOficinas);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOficina, setCurrentOficina] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleSave = (formData) => {
    if (currentOficina && currentOficina.id) {
      // Editar oficina
      setOficinas(oficinas.map(o => (o.id === currentOficina.id ? { ...o, ...formData } : o)));
    } else {
      // Adicionar nova oficina
      const newId = oficinas.length > 0 ? Math.max(...oficinas.map(o => o.id)) + 1 : 1;
      setOficinas([...oficinas, { id: newId, ...formData }]);
    }
    handleCloseModal();
  };
  
  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta oficina?")) {
      setOficinas(oficinas.filter(o => o.id !== id));
    }
  };

  return (
    <div className={styles.container}>
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
            <button className={styles.button} onClick={() => handleOpenModal()}>
                <AddIcon /> Adicionar Oficina
            </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tema</th>
              <th>Professor</th>
              <th>Vagas</th>
              <th className={styles.actionsHeader}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredOficinas.length > 0 ? (
              filteredOficinas.map((oficina) => (
                <tr key={oficina.id}>
                  <td>{oficina.tema}</td>
                  <td>{oficina.professor}</td>
                  <td className={styles.centerText}>{oficina.vagas}</td>
                  <td className={styles.actions}>
                    <button className={`${styles.actionButton} ${styles.editButton}`} onClick={() => handleOpenModal(oficina)}>
                      <EditIcon />
                    </button>
                    <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(oficina.id)}>
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className={styles.emptyMessage}>Nenhuma oficina encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <OficinaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        oficina={currentOficina}
      />
    </div>
  );
}

// Componente do Modal para formulário da Oficina
const OficinaModal = ({ isOpen, onClose, onSave, oficina }) => {
    const [formData, setFormData] = useState({
      tema: '',
      professor: '',
      vagas: '',
    });
  
    React.useEffect(() => {
      if (oficina) {
        setFormData({
          tema: oficina.tema,
          professor: oficina.professor,
          vagas: oficina.vagas,
        });
      } else {
        setFormData({ tema: '', professor: '', vagas: '' });
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
          <div className={styles.formActions}>
            <button type="button" className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.button}>{oficina ? 'Salvar Alterações' : 'Adicionar'}</button>
          </div>
        </form>
      </Modal>
    );
  };