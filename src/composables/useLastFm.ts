import { computed, onMounted, onUnmounted, ref } from 'vue';
import { fetchRecentTrack, type LastFmTrack } from '../services/lastfm';

const REFRESH_INTERVAL = 30_000;
const REQUEST_TIMEOUT = 10_000;

export function useLastFm(username: string) {
  const track = ref<LastFmTrack | null>(null);
  const isLoading = ref(true);
  const hasError = ref(false);
  const isListening = computed(
    () => !hasError.value && track.value?.isListening === true,
  );
  const status = computed(() => {
    if (isLoading.value) return 'checking last.fm';
    if (hasError.value)
      return track.value
        ? 'last seen · last.fm unavailable'
        : 'last.fm unavailable';
    if (!track.value) return 'no recent tracks';
    return isListening.value ? 'listening now' : 'last played';
  });

  let pollTimer: number | undefined;
  let request: AbortController | null = null;
  let disposed = false;

  async function refreshTrack() {
    if (document.hidden || request || disposed) return;

    const controller = new AbortController();
    request = controller;
    const timeout = window.setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT,
    );

    try {
      const nextTrack = await fetchRecentTrack(username, controller.signal);
      if (disposed) return;

      track.value = nextTrack;
      hasError.value = false;
    } catch {
      if (!disposed) hasError.value = true;
    } finally {
      window.clearTimeout(timeout);
      request = null;
      if (!disposed) isLoading.value = false;
    }
  }

  function onVisibilityChange() {
    if (!document.hidden) void refreshTrack();
  }

  onMounted(() => {
    void refreshTrack();
    pollTimer = window.setInterval(() => {
      void refreshTrack();
    }, REFRESH_INTERVAL);
    document.addEventListener('visibilitychange', onVisibilityChange);
  });

  onUnmounted(() => {
    disposed = true;
    window.clearInterval(pollTimer);
    request?.abort();
    document.removeEventListener('visibilitychange', onVisibilityChange);
  });

  return { track, isLoading, isListening, status };
}
