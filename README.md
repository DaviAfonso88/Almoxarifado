# 📋 Projeto de Cadastro de Usuários (React + JSON Server)

Este é um sistema de cadastro de usuários desenvolvido em **React**, utilizando **JSON Server** como backend fake para persistência dos dados.
O objetivo é exemplificar a construção de um CRUD completo com validações, formulários e tabelas.

A aplicação permite **cadastrar, listar, editar e excluir** usuários de forma intuitiva, mantendo os dados sincronizados com uma API.

---

## ✨ Funcionalidades

* ✅ Listagem de usuários
* ➕ Cadastro de novos usuários
* ✏️ Edição de usuários existentes
* 🗑️ Exclusão de usuários com modal de confirmação
* ⚠️ Validação de campos obrigatórios (nome e e-mail)
* 🎨 Layout responsivo e estilizado com **Bootstrap + CSS customizado**

---

## 🛠️ Tecnologias Utilizadas

* [React](https://react.dev/) (Hooks, JSX, componentização)
* [React Router](https://reactrouter.com/) (navegação entre páginas)
* [Axios](https://axios-http.com/) (requisições HTTP)
* [JSON Server](https://github.com/typicode/json-server) (API fake para CRUD)
* [Bootstrap](https://getbootstrap.com/) + CSS customizado
* [Font Awesome](https://fontawesome.com/) (ícones)

---

## 📂 Estrutura do projeto

* `UserCrud.js` → Componente principal do CRUD de usuários
* `api.js` → Configuração do Axios para comunicação com a API
* `Main.js` → Template principal da aplicação
* `Modal.css` → Estilos customizados do modal de confirmação

---

## 🧑‍💻 Seção especial: UserCrud.js

O arquivo **UserCrud.js** é o coração do projeto. Ele implementa todo o **CRUD de usuários**:

### 🔹 Principais estados

* `user` → armazena os dados do formulário (nome e email).
* `list` → lista de usuários vinda da API.
* `errors` → mensagens de validação dos campos obrigatórios.
* `showConfirm` → controla se o modal de exclusão será exibido.
* `userToDelete` → guarda o usuário selecionado para exclusão.

### 🔹 Funcionalidades

* **Create / Update (POST / PUT)** → salva novos usuários ou edita existentes.
* **Read (GET)** → carrega todos os usuários na tabela.
* **Delete (DELETE)** → remove usuários após confirmação no modal.
* **Validação** → garante que nome e email sejam preenchidos antes de salvar.
* **UX/UI** → inputs com feedback visual, botões estilizados e modal de confirmação.

### 🔹 Fluxo resumido

1. Usuário preenche o formulário e clica em **Salvar**.
2. Os dados são validados → se ok, enviados para a API.
3. A lista de usuários (`list`) é atualizada em tela **sem precisar recarregar**.
4. Para excluir, o usuário clica no ícone de lixeira → abre o modal.
5. Após confirmar, o item é removido da API e da tabela.

---

## 🚀 Como Rodar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2. Instalar dependências do backend

```bash
cd backend
npm install
```

### 3. Iniciar o servidor fake (JSON Server)

```bash
npm start
```

O backend estará rodando em **[http://localhost:3001](http://localhost:3001)**

### 4. Instalar dependências do frontend

```bash
cd ..
npm install
```

### 5. Rodar o frontend

```bash
npm start
```

O frontend estará disponível em **[http://localhost:3000](http://localhost:3000)**

---

## 📸 Prints da aplicação

### 📝 Formulário de Cadastro/Home

<img width="1913" height="1070" alt="image" src="https://github.com/user-attachments/assets/69ecd0df-3fcd-4527-a1ea-882809ad7ca5" />


### 📋 Tabela de Usuários

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/d7c8515d-d555-4bd1-ab5d-2227fddd7eb2" />


### ❌ Modal de Confirmação

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/46e821f9-ba11-4c09-8a7d-c03877d0d17b" />

---

## 👨‍💻 Desenvolvido por

<table>
  <tr>
    <td align="center">
      <a href="#">
         <img src="https://avatars.githubusercontent.com/u/89953265?v=4" width="100px;" alt="Foto de Davi Afonso no GitHub"/><br>
        <sub>
          <b>Davi Afonso</b>
        </sub>
      </a>
    </td>
</table>
