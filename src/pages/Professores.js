import React, { useState, useMemo } from 'react';
import styles from './Professores.module.css';
import Modal from '../components/Modal';

// Ícones SVG
const AddIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const EditIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
const DeleteIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;

const initialProfessores = [
  { id: 1, nome: "Dr. Carlos Silva", especialidade: "Engenharia Mecatrônica", tipo: "Professor" },
  { id: 2, nome: "Dra. Beatriz Costa", especialidade: "Ciência da Computação", tipo: "Professor" },
  { id: 3, nome: "Mariana Dias", especialidade: "Robótica Educacional", tipo: "Tutor" },
];

export default function Professores() {
  const [professores, setProfessores] = useState(initialProfessores);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProfessor, setCurrentProfessor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfessores = useMemo(() =>
    professores.filter(prof =>
      prof.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.especialidade.toLowerCase().includes(searchTerm.toLowerCase())
    ), [professores, searchTerm]);

  const handleOpenModal = (prof = null) => {
    setCurrentProfessor(prof);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProfessor(null);
  };

  const handleSave = (formData) => {
    if (currentProfessor && currentProfessor.id) {
      setProfessores(professores.map(p => (p.id === currentProfessor.id ? { ...p, ...formData } : p)));
    } else {
      const newId = professores.length > 0 ? Math.max(...professores.map(p => p.id)) + 1 : 1;
      setProfessores([...professores, { id: newId, ...formData }]);
    }
    handleCloseModal();
  };
  
  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este profissional?")) {
      setProfessores(professores.filter(p => p.id !== id));
    }
  };

  return (
    <div className={styles.container}>
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
            <button className={styles.button} onClick={() => handleOpenModal()}>
                <AddIcon /> Adicionar Profissional
            </button>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Especialidade</th>
              <th>Tipo</th>
              <th className={styles.actionsHeader}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfessores.length > 0 ? (
                filteredProfessores.map((prof) => (
                <tr key={prof.id}>
                    <td>{prof.nome}</td>
                    <td>{prof.especialidade}</td>
                    <td>
                    <span className={`${styles.badge} ${prof.tipo === 'Professor' ? styles.badgeProfessor : styles.badgeTutor}`}>
                        {prof.tipo}
                    </span>
                    </td>
                    <td className={styles.actions}>
                        <button className={`${styles.actionButton} ${styles.editButton}`} onClick={() => handleOpenModal(prof)}>
                            <EditIcon />
                        </button>
                        <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(prof.id)}>
                            <DeleteIcon />
                        </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="4" className={styles.emptyMessage}>Nenhum profissional encontrado.</td>
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
    </div>
  );
}

// Componente do Modal para formulário de Professor/Tutor
const ProfessorModal = ({ isOpen, onClose, onSave, professor }) => {
    const [formData, setFormData] = useState({
      nome: '',
      especialidade: '',
      tipo: 'Professor',
    });
  
    React.useEffect(() => {
      if (professor) {
        setFormData({
          nome: professor.nome,
          especialidade: professor.especialidade,
          tipo: professor.tipo,
        });
      } else {
        setFormData({ nome: '', especialidade: '', tipo: 'Professor' });
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
            <label htmlFor="tipo">Tipo</label>
            <select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange}>
                <option value="Professor">Professor</option>
                <option value="Tutor">Tutor</option>
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