import { useMutation } from "@apollo/client";
import { useState } from "react";
import { CREATE_USER } from "../graphql/mutations";
import { GET_USERS } from "../graphql/queries"; // Para atualizar a lista após criar um usuário
import "../styles/Form.css";

export default function UserForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "USER",
    authKey: "8c1520f4f6a832e7dfbd8465b6708250", // Chave fixa por enquanto
  });

  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }], // Atualiza a lista após criação
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({ variables: { ...formData } });
      setFormData({ name: "", email: "", username: "", password: "", role: "USER", authKey: formData.authKey });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h1>Cadastrar Usuário</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nome" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Senha" value={formData.password} onChange={handleChange} required />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="USER">Usuário</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar Usuário"}
        </button>
      </form>
      {error && <p className="error">Erro ao cadastrar: {error.message}</p>}
    </div>
  );
}
