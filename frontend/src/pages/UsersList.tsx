import { useQuery } from "@apollo/client";
import { GET_USERS } from "../graphql/queries";
import "../styles/Table.css"; // Importando o novo CSS

export default function UsersList() {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar usuários: {error.message}</p>;

  return (
    <div className="table-container">
      <h1>Lista de Usuários</h1>
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
          {data.users.map((user: any) => (
            <tr key={user.id}>
              <td>{user.id.slice(-12)}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
