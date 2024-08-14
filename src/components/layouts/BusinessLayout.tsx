export const BusinessLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="border">{children}</div>;
};
