<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useLastFm } from '../composables/useLastFm';

const username = 'slashedblade';
const profileUrl = `https://www.last.fm/user/${username}`;
const { track, isLoading, isListening, status } = useLastFm(username);
const albumArtUrl = computed(() => track.value?.artwork ?? '');
const imageFailed = ref(false);

watch(albumArtUrl, () => {
  imageFailed.value = false;
});
</script>

<template>
  <div class="music-player-container tooltip-container">
    <div id="lastfm-tooltip" class="tooltip-text" role="tooltip">
      shoutout last.fm
    </div>
    <a
      :href="profileUrl"
      class="music-player lastfm-widget"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`Open ${username}’s Last.fm profile`"
      aria-describedby="lastfm-tooltip"
    >
      <div class="player-display" :class="{ 'lastfm-active': isListening }">
        <div
          class="vinyl-disc"
          :class="{ 'is-spinning': isListening }"
          aria-hidden="true"
        >
          <img
            v-if="albumArtUrl && !imageFailed"
            :src="albumArtUrl"
            class="album-art"
            alt=""
            @error="imageFailed = true"
          />
        </div>
        <div
          class="track-info"
          aria-live="polite"
          aria-atomic="true"
          :aria-busy="isLoading"
        >
          <div class="listening-status">{{ status }}</div>
          <div class="track-name" :title="track?.name">
            {{ track?.name ?? (isLoading ? 'loading…' : username) }}
          </div>
          <div class="artist-name" :title="track?.artist">
            {{ track?.artist ?? 'view my last.fm profile ↗' }}
          </div>
        </div>
        <div class="visualizer" aria-hidden="true">
          <div
            v-for="n in 8"
            :key="n"
            class="bar"
            :class="{ 'listening-bar': isListening }"
            :style="{ animationDelay: `${n * 0.15}s` }"
          ></div>
        </div>
      </div>
    </a>
  </div>
</template>

<style scoped>
.music-player-container {
  width: 100%;
  z-index: 10;
}

.music-player {
  background: transparent;
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Courier New', monospace;
  width: 100%;
  max-width: 450px;
}

.player-display {
  min-width: 0;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 0 1 auto;
  min-height: 48px;
}

.track-info {
  min-width: 0;
  flex: 0 1 auto;
  color: #fff;
  text-align: left;
}

.track-name {
  font-size: 0.95rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;
  line-height: 1.1;
  text-transform: uppercase;
}

.artist-name {
  font-size: 0.75rem;
  color: #aaa;
  line-height: 1.1;
  text-transform: uppercase;
  font-family: 'Rough Typewriter', monospace;
}

.visualizer {
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 25px;
  margin-right: 4px;
}

.bar {
  width: 4px;
  background: #b00000;
  height: 4px;
  transition: height 0.05s ease-out;
}

.lastfm-widget {
  color: inherit;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
}

.lastfm-widget:hover .track-name {
  color: #ef6666;
}

.lastfm-widget:focus-visible {
  outline: 2px solid #dfdfdf;
  outline-offset: 4px;
}

.track-name,
.artist-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.listening-status {
  margin-bottom: 5px;
  color: #999;
  font-size: 0.6rem;
  letter-spacing: 0.03em;
}

.lastfm-active .listening-status {
  color: #ef6666;
}

.vinyl-disc {
  position: relative;
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  border: 1px solid #414141;
  border-radius: 50%;
  background:
    conic-gradient(
      from 35deg,
      transparent 0deg,
      #ffffff18 50deg,
      transparent 85deg 180deg,
      #ffffff18 230deg,
      transparent 265deg
    ),
    repeating-radial-gradient(circle, #111 0 1px, #282828 1px 2px, #111 2px 3px);
  mask-image: radial-gradient(circle, transparent 3px, #000 3.5px);
  animation: vinylSpin 6s linear infinite paused;
}

.vinyl-disc::before {
  content: '';
  position: absolute;
  width: 48%;
  height: 48%;
  border-radius: 50%;
  background: #b00000;
}

.vinyl-disc.is-spinning {
  animation-play-state: running;
}

.album-art {
  position: relative;
  width: 48%;
  height: 48%;
  border-radius: 50%;
  object-fit: cover;
}

@keyframes vinylSpin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes listeningBounce {
  0% {
    height: 4px;
  }
  50% {
    height: 20px;
  }
  100% {
    height: 8px;
  }
}

.listening-bar {
  animation: listeningBounce 0.6s infinite ease-in-out alternate;
}

@media (prefers-reduced-motion: reduce) {
  .vinyl-disc {
    animation: none;
  }

  .listening-bar {
    animation: none;
    height: 12px;
  }
}

@media (max-width: 600px) {
  .player-display {
    gap: 10px;
  }
  .vinyl-disc {
    width: 60px;
    height: 60px;
  }
  .visualizer {
    gap: 2px;
    margin-right: 0;
  }
  .bar {
    width: 3px;
  }

  .track-name {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    white-space: normal;
    overflow-wrap: anywhere;
    font-size: 0.85rem;
    line-height: 1.25;
  }
}

.tooltip-container {
  position: relative;
  display: flex;
  justify-content: center;
}

.tooltip-text {
  visibility: hidden;
  width: max-content;
  max-width: 90vw;
  background-color: #050505;
  color: #fff;
  text-align: center;
  padding: 7px 10px;
  border: 1px dashed #b00000;
  position: absolute;
  z-index: 100;
  top: calc(100% + 10px);
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  text-transform: lowercase;
}

.tooltip-text::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-left: -6px;
  border-width: 6px;
  border-style: solid;
  border-color: transparent transparent #b00000 transparent;
}

.tooltip-container:hover .tooltip-text,
.tooltip-container:focus-within .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>
