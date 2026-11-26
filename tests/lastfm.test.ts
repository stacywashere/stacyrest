import assert from 'node:assert/strict';
import test from 'node:test';
import { parseRecentTrack } from '../src/services/lastfm.ts';

const recentTrack = {
  name: 'A song',
  artist: { '#text': 'An artist' },
  image: [
    { '#text': 'https://example.com/small.jpg' },
    { '#text': 'https://example.com/large.jpg' },
  ],
  '@attr': { nowplaying: 'true' },
};

test('normalizes a currently playing track and chooses the largest artwork', () => {
  assert.deepEqual(parseRecentTrack({ track: recentTrack }), {
    name: 'A song',
    artist: 'An artist',
    artwork: 'https://example.com/large.jpg',
    isListening: true,
  });
});

test('a completed scrobble is not marked as currently playing', () => {
  const { '@attr': _, ...completedTrack } = recentTrack;
  assert.equal(parseRecentTrack({ track: completedTrack })?.isListening, false);
});

test('empty listening history is a valid empty state', () => {
  assert.equal(parseRecentTrack({ track: null }), null);
  assert.equal(parseRecentTrack({ track: [] }), null);
});

test('unavailable or malformed artwork does not break the track display', () => {
  for (const image of [
    undefined,
    null,
    'invalid',
    [null, {}, { '#text': 'http://example.com/art.jpg' }],
  ]) {
    const track = parseRecentTrack({ track: { ...recentTrack, image } });
    assert.equal(track?.name, 'A song');
    assert.equal(track?.artwork, '');
  }
});

test('API errors and malformed tracks are rejected instead of showing a false idle state', () => {
  for (const response of [
    null,
    {},
    { error: 11, track: null },
    { track: { name: '', artist: { '#text': 'An artist' } } },
    { track: { name: 'A song', artist: null } },
  ]) {
    assert.throws(() => parseRecentTrack(response));
  }
});
