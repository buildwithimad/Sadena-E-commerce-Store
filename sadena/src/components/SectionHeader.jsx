export default function SectionHeader({ eyebrow, title, subtitle, align = 'start', rightSlot }) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'items-start';
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 ${align === 'center' ? 'text-center' : ''}`}>
      <div className={`flex flex-col ${alignClass}`}>
        {eyebrow && (
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-4xl sm:text-5xl font-medium text-foreground tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-base text-muted-foreground max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </div>
  );
}

