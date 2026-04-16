import "./Button.css";

export default function Button({ children, onClick, variant = "action", type = "button", className = "" }) {
  return (
    <button type={type} onClick={onClick} className={`btn ${variant} ${className}`}>
      {children}
    </button>
  );
}