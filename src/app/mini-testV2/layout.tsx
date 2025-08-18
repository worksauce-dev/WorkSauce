export default function MiniTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF5858]/5 to-white">
      {children}
    </div>
  );
}
