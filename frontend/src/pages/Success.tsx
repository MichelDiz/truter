import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="success-container">
      <h1>Cadastro realizado com sucesso!</h1>
      <button onClick={() => navigate("/")}>Voltar ao início</button>
    </div>
  );
}
