import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Login() {
    const [mail, setmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8000/api/auth/login", { email: mail, senha: password });
            localStorage.setItem("token", res.data.token);
            alert("Logado com sucesso!");
            navigate('/')
        } catch (err) {
            alert("Falha ao logar");
            console.log(err);
        }
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <h2>Login</h2> 
                <input value={mail} onChange={(e) => setmail(e.target.value)} placeholder='Usuário'/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Senha' />
                <button type="submit">Login</button> 
            </form>
        </div>
    );
}


