export default function ResetPasswordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="min-h-screen w-full flex flex-col items-center justify-center">
            <div className="w-full ">
                {children}
            </div>
        </section>
    );
}