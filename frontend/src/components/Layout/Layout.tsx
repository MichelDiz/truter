import { ReactNode } from "react";
import "./Layout.css";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <aside className="sidebar">Sidebar</aside>
      <main className="content">{children}</main>
    </div>
  );
}
