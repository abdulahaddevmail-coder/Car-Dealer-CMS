import { Footer } from "./_components/footer";
import { Header } from "./_components/header";

export default function PresentationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="bg-white">{children}</main>
      <Footer />
    </>
  );
}
