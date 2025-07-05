<template>
  <div v-if="videoSwitch === 'ON'" class="video-wrap" @dblclick="handleDoubleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @touchstart="handleMouseEnter">
    <video
      class="video-player"
      ref="videoPlayer"
      preload="auto"
      :poster="posterImg"
      muted
      playsinline
      @contextmenu.prevent
      @timeupdate="updateProgress"
      @loadedmetadata="onLoadedMetadata"
      @waiting="loading = true"
      @canplay="loading = false"
      @error="playerError"
      @ended="playerEnded"
    >
      <source v-for="source in videoSources" :key="source.src" :src="source.src" :type="source.type" />
      <track
        v-for="track in subtitleTracks"
        :key="track.srclang"
        :src="track.src"
        kind="subtitles"
        :srclang="track.srclang"
        :label="track.label"
      />
      Your browser does not support the video tag.
    </video>

    <div ref="controlsRef" :class="['custom-controls', { active: showControls }]">
      <input
        class="progress-bar"
        type="range"
        :max="duration"
        v-model.number="progress"
        @input="seek"
      />
      <div class="play-pause-btn-wrap">
        <div class="play-pause-btn">
          <button class="play-pause" @click.stop="togglePlayPause">
            <ion-icon v-if="isPlaying" :icon="caretForwardOutline"></ion-icon>
            <ion-icon v-else :icon="pauseCircleOutline"></ion-icon>
          </button>
          <span>{{ currentTimeFormatted }} / {{ durationFormatted }}</span>
        </div>
        <button @click.stop="toggleMute">
          <ion-icon v-if="isMuted" :icon="volumeMuteOutline"></ion-icon>
          <ion-icon v-else :icon="volumeHighOutline"></ion-icon>
        </button>
      </div>
    </div>
    <ion-spinner v-if="loading" class="loading" name="bubbles"></ion-spinner>
    <div v-if="error" class="error">Error: Unable to load video</div>
  </div>
</template>

<script setup lang="ts">
import { IonSpinner, IonIcon } from '@ionic/vue';
import { volumeMuteOutline, volumeHighOutline, pauseCircleOutline, caretForwardOutline } from 'ionicons/icons';
import useVideoLogic from './logic';
import { useTenantStore} from '@/store/tenant'

const props = defineProps({

})

const tenantStore = useTenantStore();
const { homeVideoSwitch: videoSwitch = 'OFF', homeVideoUrl: src } = tenantStore.tenantInfo || {};

const {
  seek,
  error,
  loading,
  duration,
  progress,
  isMuted,
  isPlaying,
  posterImg,
  toggleMute,
  playerError,
  playerEnded,
  videoPlayer,
  controlsRef,
  showControls,
  videoSources,
  subtitleTracks,
  updateProgress,
  togglePlayPause,
  onLoadedMetadata,
  handleMouseLeave,
  handleMouseEnter,
  durationFormatted,
  handleDoubleClick,
  currentTimeFormatted,
} = useVideoLogic({ src, videoSwitch });
</script>

<style lang="less" scoped>
.video-wrap {
  height: 12.875rem;
  margin: 0 auto;
  padding: 0.9375rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    background: url('@/assets/img/inicio/video-bg1.png') no-repeat center center / 100% 100%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0.0625rem;
    z-index: 10;
    box-shadow: 0 0.3125rem 0.9375rem 0.3125rem #2E033B;
  }

  .video-player {
    width: 100%;
    height: 100%;
    display: block;
  }

  .custom-controls {
    padding: 0.625rem;
    position: absolute;
    bottom: 0.9375rem;
    left: 0.9375rem;
    right: 0.9375rem;
    z-index: 15;
    line-height: 1;
    opacity: 0;
    transition: opacity 0.5s ease;
    background: rgba(0, 0, 0, 0.1);

    &.active {
      opacity: 1;
    }

    .progress-bar {
      width: 100%;
    }

    .play-pause-btn-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .play-pause-btn {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.875rem;

        .play-pause {
          all: unset;
          display: inline-flex;
          margin-left: 0.25rem;
          font-size: 1.25rem;
        }
      }
    }
  }

  .loading,
  .error {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 0.625rem;
    border-radius: 0.3125rem;
  }
}
</style>
