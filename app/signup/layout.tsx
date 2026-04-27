export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-100 p-3 sm:p-6 md:p-10 flex items-center justify-center font-inter">
      {children}
    </div>
  );
}
