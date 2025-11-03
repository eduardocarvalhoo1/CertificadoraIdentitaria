import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from './SignUp.module.css';
import CargoInput from '../components/CargoInput';


export default function SignUp() {
    
    const { setUser, setToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [mail, setMail] = useState("");
    const [register, setRegister] = useState("");
    const [role, setRole] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSignUp(e) {
        e.preventDefault();
        if (isSubmitting) return; // Preveent double call
        setIsSubmitting(true);
        try {
            const res = await axios.post("http://localhost:8000/api/auth/register", 
                                            { 
                                                nome: name,
                                                senha: password,
                                                email: mail,
                                                registro: register,
                                                role: role,
                                            }
                                        );
            
            setUser(res.data.user);
            setToken(res.data.token);
            navigate('/perfil');
        } catch (err) {
            alert("Falha ao Cadastrar");
            console.log(err);
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return (
        <div>
            <form className={styles.form} onSubmit={handleSignUp}>
                <h2>Cadastro</h2>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome"/>
                <input type="email" value={mail} onChange={(e) => setMail(e.target.value)} placeholder="Email"/>
                <input value={register} onChange={(e) => setRegister(e.target.value)} placeholder="Registro"/>
                <CargoInput value={role} onChange={(e) => setRole(e.target.value)} placeholder="Cargo"/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Senha' />
                <button type="submit">Cadastrar</button> 
                <a onClick={() => navigate('/login')}>Logar</a>
            </form>

        </div>
    );
}



