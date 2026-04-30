import Link from 'next/link';

function base(variant) {
  const common = 'inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold tracking-widest uppercase transition-colors focus:outline-none focus:ring-1 focus:ring-accent';
  if (variant === 'secondary') return `${common} border border-border bg-background text-foreground hover:bg-secondary`;
  if (variant === 'ghost') return `${common} bg-transparent text-foreground hover:bg-secondary`;
  return `${common} bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground`;
}

export default function Button({ as = 'button', href, variant = 'primary', className = '', ...props }) {
  const classes = `${base(variant)} ${className}`;
  if (as === 'link') {
    return <Link href={href || '#'} className={classes} {...props} />;
  }
  return <button className={classes} {...props} />;
}

