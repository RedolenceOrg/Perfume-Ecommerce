import Link from 'next/link'

export interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className="px-6 lg:px-16 pt-6">
            <ol className="flex flex-wrap items-center gap-2 font-label text-xs uppercase tracking-widest text-outline">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1

                    return (
                        <li key={index} className="flex items-center gap-2">
                            {item.href && !isLast ? (
                                <Link
                                    href={item.href}
                                    className="hover:text-secondary transition-colors duration-300"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className={isLast ? 'text-primary font-semibold' : ''}>
                                    {item.label}
                                </span>
                            )}
                            {!isLast && <span className="text-outline/40">/</span>}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}