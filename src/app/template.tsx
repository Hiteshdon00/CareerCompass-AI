export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      {children}
    </div>
  );
}
