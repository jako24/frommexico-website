export default function OutreachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-full flex-1 bg-stone-50">{children}</div>;
}
