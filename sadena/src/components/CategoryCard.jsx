import Link from 'next/link';
import Image from 'next/image';

export default function CategoryCard({ lang, category }) {
  const label = lang === 'ar' ? category?.labelAr : category?.label;
  const desc = lang === 'ar' ? category?.descriptionAr : category?.description;
  return (
    <Link
      href={`/${lang}/products?category=${category?.id}`}
      className="group block rounded-md overflow-hidden bg-secondary border border-border hover:border-foreground/20 transition-colors"
    >
      <div className="relative aspect-[4/3] bg-secondary">
        <Image
          src={category?.image}
          alt={label}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" aria-hidden="true" />
      </div>
      <div className="p-4">
        <p className="font-display text-lg font-medium text-foreground">{label}</p>
        {desc && <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>}
      </div>
    </Link>
  );
}

