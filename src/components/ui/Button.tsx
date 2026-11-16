import React from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 border border-transparent shadow-xs",
  secondary:
    "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 border border-transparent",
  outline:
    "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
  ghost:
    "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent",
  danger:
    "bg-red-600 text-white hover:bg-red-700 border border-transparent",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3.5 py-1.5 text-xs",
  md: "min-h-10 px-4 py-2 text-sm",
  lg: "min-h-11 px-6 py-2.5 text-sm",
};

export function buttonClasses(options?: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}): string {
  const variant = options?.variant ?? "primary";
  const size = options?.size ?? "md";
  const extra = options?.className ?? "";

  return [
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap shrink-0",
    "transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
    "disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}
