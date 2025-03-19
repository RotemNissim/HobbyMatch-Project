import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register, onGoogleLoginSuccess, onGoogleLoginFailure } from "../services/authService";
import { AuthFormData } from "../types";
import { GoogleLogin } from "@react-oauth/google";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<AuthFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ firstName: "", lastName: "", email: "", password: "" });
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        const formDataToSend = new FormData();
Object.entries(formData).forEach(([key, value]) => {
    formDataToSend.append(key, value);
});

await register(formDataToSend);
      }
      navigate("/profile");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-page container">
      <div className="login-page 2">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        {error && <p className="login-page3">{error}</p>}
        <form onSubmit={handleSubmit} className="loginP form">
          {!isLogin && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="loginP input firstName"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="loginP input lastName"
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="loginP input email"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="loginP input password"
          />
          <button className="login submit button" type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>
        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
