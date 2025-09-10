import Navbar from "@/modules/Layout/Navbar";
import Footer from "@/modules/Layout/Footer";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <>
      <Navbar />
      <main className="px-2 sm:px-4 md:px-6 mx-auto max-w-7xl min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
