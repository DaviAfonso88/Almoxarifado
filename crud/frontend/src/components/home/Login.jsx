import { useState } from "react";

export const Login = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const senhaCorreta = "Almo123.";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === senhaCorreta) {
      localStorage.setItem("auth", "true");
      onLogin(true);
    } else {
      setError("Senha incorreta. Tente novamente!");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="p-4 shadow rounded bg-white" style={{ width: 300 }}>
        <h3 className="text-center mb-4">Acesso Restrito</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Digite a senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary w-100">
            Entrar
          </button>
        </form>
        {error && <p className="text-danger text-center mt-3">{error}</p>}
      </div>
    </div>
  );
};
