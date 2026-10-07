export default function Toc({ items }: { items: { id: string; text: string }[] }) {
  if (items.length < 2) return <div className="toc" />;
  return (
    <nav className="toc" aria-label="On this page">
      <p className="toc__title">On this page</p>
      <ol>
        {items.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
