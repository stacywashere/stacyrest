<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import MusicPlayer from './components/MusicPlayer.vue';
import { djImage, projects, socialLinks } from './data/portfolio';

const isLoaded = ref(false);
const assetUrls = [djImage, ...projects.map((project) => project.logo)];
const preventContextMenu = (event: Event) => event.preventDefault();
let loadTimeout: number | undefined;
let disposed = false;

onMounted(() => {
  document.addEventListener('contextmenu', preventContextMenu);
  // Keep the page usable even if an image request stalls.
  loadTimeout = window.setTimeout(() => {
    isLoaded.value = true;
  }, 5_000);

  const images = assetUrls.map((url) => {
    const image = new Image();
    image.src = url;
    return image.decode();
  });

  void Promise.allSettled(images).then(() => {
    if (disposed) return;
    window.clearTimeout(loadTimeout);
    isLoaded.value = true;
  });
});

onUnmounted(() => {
  disposed = true;
  window.clearTimeout(loadTimeout);
  document.removeEventListener('contextmenu', preventContextMenu);
});
</script>

<template>
  <div class="loader" :class="{ loaded: isLoaded }" :aria-hidden="isLoaded">
    <div class="loader-text" role="status">loading assets</div>
  </div>

  <main class="container" :class="{ 'content-loaded': isLoaded }">
    <div class="content">
      <h1 class="name">stacy</h1>
      <nav class="social-links" aria-label="Social profiles">
        <template v-for="(social, index) in socialLinks" :key="social.name">
          <span v-if="index > 0" class="separator" aria-hidden="true">×</span>
          <a
            :href="social.url"
            class="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ social.name }}
          </a>
        </template>
      </nav>

      <section class="projects-section" aria-labelledby="projects-title">
        <h2 id="projects-title" class="section-title">projects</h2>
        <div
          v-for="project in projects"
          :key="project.name"
          class="project-item"
        >
          <a
            :href="project.url"
            class="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              :src="project.logo"
              :class="{ 'no-invert': !project.invertLogo }"
              width="20"
              height="20"
              alt=""
            />
            <span class="project-name">{{ project.name }}</span>
            <span class="project-desc">{{ project.description }}</span>
          </a>
        </div>
      </section>
    </div>

    <aside class="music-section" aria-label="My listening activity">
      <img
        :src="djImage"
        alt="DJ wearing headphones at turntables"
        class="dj-image"
        width="1280"
        height="1280"
        draggable="false"
      />
      <MusicPlayer />
    </aside>
  </main>
</template>

<style scoped>
.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition:
    opacity 0.5s ease,
    visibility 0.5s ease;
}

.loader.loaded {
  opacity: 0;
  visibility: hidden;
}

.loader-text {
  font-family: 'Courier New', monospace;
  color: #b00000;
  font-size: 1.2rem;
  letter-spacing: 2px;
  animation: pulse 1s infinite alternate;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.container {
  opacity: 0;
  transition: opacity 0.8s ease-in;
}

.container.content-loaded {
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .loader,
  .container {
    transition: none;
  }

  .loader-text {
    animation: none;
  }
}
</style>
