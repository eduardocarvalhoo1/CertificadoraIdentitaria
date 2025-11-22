# Oficinas+

Projeto final da disciplina **AS65A - Certificadora de Competência Identitária - N15 (2025_02)**.

O **Oficinas+** é uma aplicação full stack que permite o gerenciamento de oficinas, alunos, professores e inscrições, oferecendo uma visão pública para consulta e um ambiente autenticado para administração.

---

## 📌 Objetivo do Projeto

O objetivo do sistema é facilitar a organização e o controle de oficinas acadêmicas, permitindo:

* Cadastro e gerenciamento de oficinas
* Inscrição e cancelamento de alunos
* Visualização pública das oficinas disponíveis
* Gerenciamento de alunos e professores
* Administração de salas (locais das oficinas)

---

## 🛠 Tecnologias Utilizadas

### Backend

* Node.js
* Express.js
* Firebase Firestore
* JSON Web Token (JWT)
* Bcrypt

### Frontend

* React (Web)

---

## 🔐 Autenticação

O sistema utiliza autenticação baseada em:

* **JWT (JSON Web Token)** para controle de sessão
* **Bcrypt** para criptografia das senhas

As rotas protegidas exigem que o usuário esteja autenticado.

---

## 📂 Estrutura das Rotas

### 🔓 Rotas Públicas

* `GET /api/public`

  * Retorna os dados públicos para o dashboard inicial.

### 🔐 Rotas de Autenticação

* `POST /api/auth/login`
* `POST /api/auth/register`
* `PUT /api/auth/profile/:id`
* `PUT /api/auth/password/:id`

Gerenciamento de usuários com login e cadastro.

### 📘 Documentação

* `GET /api/docs`

  * Exibe a documentação da API via Swagger.

### 👨‍🏫 Professores

* `GET /api/professor`

  * Lista todos os usuários que possuem perfil de professor.

### 👩‍🎓 Alunos

* `GET /api/alunos`
* `POST /api/alunos`
* `PUT /api/alunos/:id`
* `DELETE /api/alunos/:id`

Gerenciamento completo dos alunos.

### 🛠 Oficinas

* `GET /api/oficinas`
* `POST /api/oficinas`
* `PUT /api/oficinas/:id`
* `DELETE /api/oficinas/:id`
* `POST /api/oficinas/:id/inscrever`
* `DELETE /api/oficinas/:id/inscrever`
* `GET /api/oficinas/:id/inscritos`

Gerenciamento das oficinas e das inscrições.

### 🏫 Salas

* `GET /api/salas`
* `GET /api/salas/:id`
* `POST /api/salas`
* `PUT /api/salas/:id`
* `DELETE /api/salas/:id`

Gerenciamento dos locais onde as oficinas acontecem.

---

## 🚀 Como Rodar o Projeto

### Backend

```bash
git clone https://github.com/seu-usuario/oficinas-plus.git
cd server
create file server/config/.env (JWT_SECRET)
paste file server/config/serviceAccountKey.json
npm install
npm start
```

### Frontend

```bash
npm install
npm start
```

---

## 👨‍🎓 Disciplina

Projeto desenvolvido como requisito avaliativo da disciplina:
**AS65A - Certificadora de Competência Identitária - N15 (2025_02)**

### 👥 Membros
- Eduardo Carvalho de Oliveira - RA: 2614529 
- Júlio Cézar Bandeira Covary - RA: 2612224 
- Luan Venicios Salomão de Almeida - RA: 2564220 
- Matheus Faustino Meneguim - RA: 2564823 
- Murillo Tadeu Amadeu - RA: 2564246

---

## 📄 Licença

Projeto com finalidade exclusivamente educacional.
