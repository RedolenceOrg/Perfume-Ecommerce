const links = ['Privacy Policy', 'Terms of Service', 'Shipping & Returns', 'Contact Us'];

export default function Footer() {
    return (
        <footer className="w-full bg-[#faf9f5] dark:bg-black px-12 py-12 flex flex-col items-center justify-center border-t border-black/5">

            <div className="text-xl font-serif tracking-widest text-black dark:text-[#faf9f5] mb-12">
                Redolence Nepal
            </div>

            <div className="flex flex-wrap justify-center gap-8 mb-12">

                {links.map((link) => (

                    <a key={link} href="#" className="font-['Noto_Serif'] text-sm tracking-[0.2em] uppercase text-[#000000]/50 dark:text-[#faf9f5]/50 hover:text-[#775a19] transition-all duration-500 ease-in-out">
                        {link}
                    </a>
                ))}

            </div>

            <div className="font-['Inter'] text-[11px] font-light tracking-[0.15em] uppercase text-black/50 dark:text-[#faf9f5]/50">
                © 2026 Redolence Nepal. ALL RIGHTS RESERVED.
            </div>
            <div className="text-sm text-black/50 dark:text-[#faf9f5]/50 mt-4">
                WEBSITE BUILT BY: <span className="font-bold">Anwesh Atreya</span>
            </div>

        </footer>
    );
}