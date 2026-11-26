export type LastFmTrack = {
  name: string;
  artist: string;
  artwork: string;
  isListening: boolean;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export function parseRecentTrack(data: unknown): LastFmTrack | null {
  if (!isRecord(data) || data.error || !('track' in data)) {
    throw new Error('Last.fm returned an invalid response');
  }

  const track = data.track;
  if (track === null || (Array.isArray(track) && track.length === 0))
    return null;

  if (
    !isRecord(track) ||
    typeof track.name !== 'string' ||
    !track.name.trim() ||
    !isRecord(track.artist) ||
    typeof track.artist['#text'] !== 'string' ||
    !track.artist['#text'].trim()
  ) {
    throw new Error('Last.fm returned an invalid track');
  }

  const images: unknown[] = Array.isArray(track.image) ? track.image : [];
  const artwork =
    images
      .map((image) =>
        isRecord(image) && typeof image['#text'] === 'string'
          ? image['#text']
          : '',
      )
      .filter((url) => url.startsWith('https://'))
      .pop() ?? '';

  return {
    name: track.name,
    artist: track.artist['#text'],
    artwork,
    isListening:
      isRecord(track['@attr']) && track['@attr'].nowplaying === 'true',
  };
}

export async function fetchRecentTrack(username: string, signal: AbortSignal) {
  // Public read-only relay; no credentials or backend are needed on this static site.
  const endpoint = `https://lastfm-last-played.biancarosa.com.br/${encodeURIComponent(username)}/latest-song`;
  const response = await fetch(endpoint, { signal, cache: 'no-store' });
  if (!response.ok) throw new Error('Last.fm is unavailable');

  return parseRecentTrack(await response.json());
}
