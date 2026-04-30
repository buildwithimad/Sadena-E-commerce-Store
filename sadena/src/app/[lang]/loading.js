import Icon from '@/components/ui/AppIcon';

export default function Loading() {
  return (
    <div className="flex-1 w-full min-h-[65vh] flex flex-col items-center justify-center animate-in fade-in zoom-in-[98%] duration-300 ease-out bg-[var(--background)]">
      
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Exactly the same icon and classes used in the ProductCard overlay */}
        <Icon 
          name="ArrowPathIcon" 
          size={48} 
          className="animate-spin text-[var(--primary)] drop-shadow-md" 
        />
        
        {/* Subtle loading text matching the storefront typography */}
        <p className="text-xs font-bold text-[var(--muted-foreground)] tracking-widest uppercase animate-pulse">
          Loading
        </p>
      </div>

    </div>
  );
}