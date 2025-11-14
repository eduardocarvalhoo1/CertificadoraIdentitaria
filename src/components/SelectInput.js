import styles from './SelectInput.module.css'

export default function SelectInput({ name, items, label, onChange, value }) {
    return (
        <div className={styles.box}>
            <label>{label}</label>
            <select name ={name} onChange={onChange} value={value}>
                <option>Selecione</option>
                {items.map((item) => (
                    <option key={item.id} value={item.name}>
                        {item.nome}
                    </option>
                ))}
            </select>
        </div>
    );
}