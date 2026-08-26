import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

type Tone = "cyan" | "violet" | "mango" | "danger" | "neutral";

export function PixelButton({
  tone = "cyan",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone }) {
  return <button className={`pixel-button tone-${tone} ${className}`} {...props} />;
}

export function PixelLink({
  tone = "cyan",
  className = "",
  ...props
}: LinkProps & { tone?: Tone }) {
  return <Link className={`pixel-button tone-${tone} ${className}`} {...props} />;
}

export function PixelSurface({
  children,
  className = "",
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  return (
    <section className={`pixel-surface ${className}`} {...props}>
      <span aria-hidden="true" className="pixel-corner pixel-corner-tl" />
      <span aria-hidden="true" className="pixel-corner pixel-corner-tr" />
      <span aria-hidden="true" className="pixel-corner pixel-corner-bl" />
      <span aria-hidden="true" className="pixel-corner pixel-corner-br" />
      {children}
    </section>
  );
}

export function Field({
  label,
  help,
  error,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  help?: string;
  error?: string;
}) {
  const id = props.id ?? props.name;
  const describedBy = error ? `${id}-error` : help ? `${id}-help` : undefined;
  return (
    <label className={`field ${className}`} htmlFor={id}>
      <span className="field-label">{label}</span>
      <input id={id} aria-describedby={describedBy} aria-invalid={Boolean(error)} {...props} />
      {help ? (
        <span className="field-help" id={`${id}-help`}>
          {help}
        </span>
      ) : null}
      {error ? (
        <span className="field-error" id={`${id}-error`} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function TextAreaField({
  label,
  help,
  name,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  help?: string;
}) {
  const id = props.id ?? name;
  return (
    <label className={`field ${className}`} htmlFor={id}>
      <span className="field-label">{label}</span>
      <textarea id={id} name={name} {...props} />
      {help ? <span className="field-help">{help}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  children,
  name,
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: ReactNode }) {
  const id = props.id ?? name;
  return (
    <label className={`field ${className}`} htmlFor={id}>
      <span className="field-label">{label}</span>
      <select id={id} name={name} {...props}>
        {children}
      </select>
    </label>
  );
}

export function StatusPill({ children, tone = "neutral" }: PropsWithChildren<{ tone?: Tone }>) {
  return <span className={`status-pill tone-${tone}`}>{children}</span>;
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="empty-state">
      <span aria-hidden="true" className="empty-state-spark" />
      <h2>{title}</h2>
      <p>{body}</p>
      {action}
    </div>
  );
}
