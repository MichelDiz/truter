import { useQuery, useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { GET_USERS } from "../graphql/queries";
import { GET_USER_BY_EMAIL, GET_USER_BY_NAME } from "../graphql/searchQueries";
import "../styles/Table.css";

export default function UsersList() {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [searchActive, setSearchActive] = useState(false);

  const [searchByEmail, { data: emailData, loading: emailLoading }] = useLazyQuery(GET_USER_BY_EMAIL);
  const [searchByName, { data: nameData, loading: nameLoading }] = useLazyQuery(GET_USER_BY_NAME);

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      refetch(); // Se o campo de busca estiver vazio, volta à lista completa
      setSearchActive(false);
      return;
    }

    setSearchActive(true);

    if (searchType === "email") {
      searchByEmail({ variables: { email: searchTerm } });
    } else {
      searchByName({ variables: { name: searchTerm } });
    }
  };

  // Efeito para restaurar a lista completa quando o usuário apaga a busca
  useEffect(() => {
    if (searchTerm.trim() === "" && searchActive) {
      refetch();
      setSearchActive(false);
    }
  }, [searchTerm, searchActive, refetch]);

  // Determina qual conjunto de dados exibir
  const users = searchActive
    ? emailData?.userByEmail
      ? [emailData.userByEmail]
      : nameData?.userByName || []
    : data?.users || [];

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar usuários: {error.message}</p>;

  return (
    <div className="table-container">
      <h1>Lista de Usuários</h1>

      {/* Barra de busca */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar usuário por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <select onChange={(e) => setSearchType(e.target.value)}>
          <option value="name">Buscar por Nome</option>
          <option value="email">Buscar por Email</option>
        </select>
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {emailLoading || nameLoading ? (
        <p>Buscando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user: any) => (
                <tr key={user.id}>
                  <td>{user.id.slice(-12)}</td>
                  <td>{user.name}</td>
                  <td>{user.email || "N/A"}</td>
                  <td>{user.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>Nenhum usuário encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
