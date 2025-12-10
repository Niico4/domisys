export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-linear-to-bl from-[#0E1512] via-[#1F6F4A] to-[#2E3D34] min-h-dvh flex flex-col-center text-neutral-50">
      <section className="w-11/12 mx-auto">{children}</section>
    </main>
  );
}
