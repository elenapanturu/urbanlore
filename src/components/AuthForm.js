import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import content from "../data/content.json";

export default function AuthForm({ mode = "login", onClose, geistSans, geistMono, lang }) {
  const t = content[lang];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { loginUser } = useContext(UserContext);
  const [isRegister, setIsRegister] = useState(mode === "register");

  useEffect(() => {
    setIsRegister(mode === "register");
    setMessage("");
    setEmail("");
    setPassword("");
    setEmailError("");
    setPasswordError("");
  }, [mode]);

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePassword(password) {
    return password.length >= 5;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setEmailError("");
    setPasswordError("");

    let valid = true;

    if (!validateEmail(email)) {
      setEmailError(t.errorMessageEmail);
      valid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError(t.errorMessagePassword);
      valid = false;
    }

    if (!valid) return;

    const endpoint = isRegister ? "/api/users/register" : "/api/users/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(isRegister ? t.successMessageRegister : t.successMessageLogin);
        if (!isRegister) {
          loginUser(data.token);
          onClose();
          window.location.reload();
        }
      } else {
        setMessage(data.error || t.errorMessageDefault);
      }
    } catch {
      setMessage(t.errorMessageNetwork);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        fontFamily: geistSans,
        color: "black",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          padding: "32px 40px",
          width: 360,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          position: "relative",
          userSelect: "none",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            border: "none",
            background: "transparent",
            fontSize: 24,
            cursor: "pointer",
            color: "black",
            fontWeight: "bold",
            lineHeight: 1,
          }}
          aria-label="Close form"
        >
          &times;
        </button>

        <h2
          style={{
            marginBottom: 24,
            fontFamily: geistMono,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: "0.05em",
          }}
        >
          {isRegister ? t.textAuthFormCreateAccount : t.textAuthFormConnect}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              padding: "12px 14px",
              marginBottom: emailError ? 4 : 18,
              borderRadius: 8,
              border: emailError ? "2px solid #b00020" : "2px solid black",
              fontSize: 16,
              outline: "none",
              fontFamily: "var(--font-geist-sans)",
              color: "black",
              backgroundColor: "white",
              transition: "border-color 0.2s ease",
            }}
            onFocus={e => (e.target.style.borderColor = "black")}
            onBlur={e => (e.target.style.borderColor = "black")}
          />
          {emailError && (
            <p style={{
              color: "#b00020",
              fontSize: "0.85rem",
              fontStyle: "italic",
              marginTop: 0,
              marginBottom: 14,
              fontFamily: geistSans,
            }}>
              {emailError}
            </p>
          )}

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              padding: "12px 14px",
              marginBottom: passwordError ? 4 : 24,
              borderRadius: 8,
              border: passwordError ? "2px solid #b00020" : "2px solid black",
              fontSize: 16,
              outline: "none",
              fontFamily: "var(--font-geist-sans)",
              color: "black",
              backgroundColor: "white",
              transition: "border-color 0.2s ease",
            }}
            onFocus={e => (e.target.style.borderColor = "black")}
            onBlur={e => (e.target.style.borderColor = "black")}
          />
          {passwordError && (
            <p style={{
              color: "#b00020",
              fontSize: "0.85rem",
              fontStyle: "italic",
              marginTop: 0,
              marginBottom: 18,
              fontFamily: geistSans,
            }}>
              {passwordError}
            </p>
          )}

          <button
            type="submit"
            style={{
              padding: "14px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              cursor: "pointer",
              fontWeight: 600,
              letterSpacing: "0.05em",
              transition: "background-color 0.25s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#222")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "black")}
          >
            {isRegister ? "register" : "login"}
          </button>
        </form>

        <p
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage("");
            setEmailError("");
            setPasswordError("");
          }}
          style={{
            marginTop: 18,
            color: "black",
            textAlign: "center",
            cursor: "pointer",
            userSelect: "none",
            fontWeight: "500",
            fontFamily: geistSans,
          }}
        >
          {isRegister
            ? t.textAuthFormSwitchToLogin
            : t.textAuthFormSwitchToRegister}
        </p>

        {message && (
          <p
            style={{
              marginTop: 14,
              color: message.includes("successful") ? "#2e7d32" : "#b00020",
              fontWeight: "500",
              textAlign: "center",
              fontStyle: message.includes("successful") ? "normal" : "italic",
              fontSize: "0.9rem",
              fontFamily: geistSans,
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
