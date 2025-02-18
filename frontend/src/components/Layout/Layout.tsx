import { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./Layout.css";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Menu</h2>
        <nav>
          <ul>
            <li><Link to="/users">Listar Usuários</Link></li>
            <li><Link to="/user">Cadastrar Usuário</Link></li>
            <li><Link to="/cryptos">Pesquisar Cryptos</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
