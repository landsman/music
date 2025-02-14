interface ArtistProps {
  name: string;
}

export function Artist({ name }: ArtistProps) {
  return <div className="artist__name">{name}</div>;
}
