import AuthNavbar from "@/modules/auth/AuthNavbar";



export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <>
      <AuthNavbar />
      {children}
    </>
  );
}
