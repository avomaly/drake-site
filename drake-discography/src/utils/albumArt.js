export async function getAlbumArt(artist, album) {
  const query = encodeURIComponent(`${artist} ${album}`);
  const res = await fetch(`https://itunes.apple.com/search?term=${query}&entity=album&limit=1`);
  const data = await res.json();
  return data.results[0]?.artworkUrl100?.replace('100x100', '600x600') || null;
}
