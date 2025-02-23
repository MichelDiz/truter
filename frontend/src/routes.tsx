import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import UsersList from "./pages/UsersList";
import UserForm from "./pages/UserForm";
import CryptoSearch from "./pages/CryptoSearch";
import Success from "./pages/Success";

export default function AppRoutes() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<UsersList />} />
          <Route path="/success" element={<Success />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/user/:id?" element={<UserForm />} />
          <Route path="/cryptos" element={<CryptoSearch />} />
        </Routes>
      </Layout>
    </Router>
  );
}
