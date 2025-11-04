import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


export default function Login() {
    const { setUser, setToken } = useContext(AuthContext);
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8000/api/auth/login", { email: mail, senha: password });
            
            setUser(res.data.user);
            setToken(res.data.token);
            navigate('/');
        } catch (err) {
            alert("Falha ao logar");
            console.log(err);
        }
    }

    return (
        <div>
            <form className={styles.form} onSubmit={handleLogin}>
                <h2>Login</h2> 
                <input value={mail} onChange={(e) => setMail(e.target.value)} placeholder='Usuário'/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Senha' />
                <button type="submit">Login</button> 
                <a onClick={() => navigate('/signup')}>Criar Conta</a>
            </form>
        </div>
    );
}


