import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "icon" | "small" | "large";
}

const Button: React.FC<ButtonProps> = ({ children, variant = "default", size, ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md border ${
        variant === "outline" ? "border-gray-400 text-gray-800" : "bg-blue-600 text-white"
      } ${size === "icon" ? "p-2" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
