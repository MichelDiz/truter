import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, Search, Menu, ChevronLeft } from "lucide-react"; // Ícones
import "./Layout.css";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="menu-header">
          <h2 className="menu-title">Menu</h2>
          <button className="menu-toggle" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
          </button>
        </div>

        <nav>
          <ul>
            <li>
              <Link to="/users">
                <Users size={20} />
                <span className="menu-text">Listar Usuários</span>
              </Link>
            </li>
            <li>
              <Link to="/user">
                <UserPlus size={20} />
                <span className="menu-text">Cadastrar Usuário</span>
              </Link>
            </li>
            <li>
              <Link to="/cryptos">
                <Search size={20} />
                <span className="menu-text">Pesquisar Cryptos</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Conteúdo */}
      <main className="content">{children}</main>
    </div>
  );
}