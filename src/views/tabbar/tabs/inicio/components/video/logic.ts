



export default (props: any) => {
  const videoPlayer = ref<HTMLVideoElement | null>(null);

  const posterImg = ref('');
  const subtitleTracks = ref([
    { src: 'subtitles_en.vtt', srclang: 'en', label: 'English' },
    { src: 'subtitles_zh.vtt', srclang: 'zh', label: 'Chinese' },
  ]);
  const resolutions = ref([
    { value: '360p', label: '360p', src: 'video_360p.mp4' },
    { value: '720p', label: '720p', src: 'video_720p.mp4' },
    { value: '1080p', label: '1080p', src: 'video_1080p.mp4' },
  ]);
  const duration = ref(0);
  const progress = ref(0);
  const controlsRef = ref<HTMLDivElement | null>(null);
  const isMuted = ref(true);
  const isPlaying = ref(false);
  const loading = ref(false);
  const error = ref(false);
  const showControls = ref(false);

  const formatTime = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  const currentTimeFormatted = computed(() => formatTime(progress.value));
  const durationFormatted = computed(() => formatTime(duration.value));
  const videoSources = computed(() => {
    const { src } = props;
    const type = 'video/' + src.split('.').pop();
    return [
      { src, type },
    ]
  })


  const handleDoubleClick = (event: MouseEvent) => {
    if (!videoPlayer.value || !controlsRef.value) return;
    if (controlsRef.value.contains(event.target as Node)) {
      return;
    }
    if (videoPlayer.value.ended) {
      return;
    }
    togglePlayPause(event);
  }

  const togglePlayPause = (event: MouseEvent | null, isPlay?: boolean) => {
    if (!videoPlayer.value) return;
    if (videoPlayer.value.paused || isPlay) {
      videoPlayer.value.play();
      isPlaying.value = true;
    } else {
      videoPlayer.value.pause();
      isPlaying.value = false;
    }
  }

  const toggleMute = () => {
    if (!videoPlayer.value) return;
    videoPlayer.value.muted = !videoPlayer.value.muted;
    isMuted.value = videoPlayer.value.muted;
    if (isMuted.value) {
      videoPlayer.value.volume = 0;
    } else {
      videoPlayer.value.volume = 1;
    }
  }

  const updateProgress = () => {
    if (!videoPlayer.value) return;
    progress.value = videoPlayer.value.currentTime;
  }

  const seek = () => {
    if (!videoPlayer.value) return;
    videoPlayer.value.currentTime = progress.value;
    togglePlayPause(null, true);
  }

  const onLoadedMetadata = () => {
    if (!videoPlayer.value) return;
    duration.value = Math.floor(videoPlayer.value.duration);
  }

  const playerError = () => {
    error.value = true;
    loading.value = false;
  }

  const playerEnded = () => {
    isPlaying.value = false;
  }

  const handleMouseEnter = () => {
    showControls.value = true;
  }
  const handleMouseLeave = () => {
    showControls.value = false;
  }

  onMounted(() => {
    setTimeout(() => {
      useIntersectionObserver(videoPlayer, (entry) => {
        const isIntersecting = entry[0].isIntersecting;
        if (isIntersecting) {
          togglePlayPause(null, true);
        } else {
          togglePlayPause(null);
        }
      }, {
        threshold: 0.5,
      });
    }, 5000);
  });

  return {
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
    resolutions,
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
  }
}