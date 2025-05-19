import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import AuthForm from "./AuthForm";
import { Geist_Mono } from "next/font/google";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AuthButtons() {
  const { token, logoutUser } = useContext(UserContext);
  const [showForm, setShowForm] = useState(false);

  const buttonStyle = {
    padding: "6px 14px",
    marginLeft: "8px",
    border: "1px solid black",
    backgroundColor: "white",
    color: "black",
    borderRadius: "20px",
    fontWeight: 700,
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "none",
    className: `${geistMono.className}`
  };

  const buttonHoverStyle = {
    backgroundColor: "#f0f0f0",
    boxShadow: "0 0 6px rgba(0,0,0,0.1)",
  };

  function HoverButton({ children, onClick }) {
    const [hover, setHover] = useState(false);
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          ...buttonStyle,
          ...(hover ? buttonHoverStyle : {}),
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <>
      <div
        className={geistMono.variable}
        style={{
          position: "fixed",
          top: "16px",
          right: "16px",
          display: "flex",
          alignItems: "center",
          fontFamily: "var(--font-geist-mono)",
          zIndex: 1000,
          userSelect: "none",
        }}
      >
        {token ? (
          <>
            <span style={{ fontWeight: 400, fontSize: "0.9rem", color: "black" }}>
              logged in
            </span>
            <HoverButton onClick={logoutUser}>logout</HoverButton>
          </>
        ) : (
          <>
            <HoverButton onClick={() => setShowForm("login")}>login</HoverButton>
            <HoverButton onClick={() => setShowForm("register")}>register</HoverButton>
          </>
        )}

        {showForm && (
          <AuthForm mode={showForm} onClose={() => setShowForm(false)} />
        )}
      </div>
    </>
  );
}
