import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useActivityStore } from '@/store/activity';
import { jumpActivityId } from '@/utils/url';

interface ActivityItem {
  id: number;
  type: string;
  name: string;
  logoSrc?: string;
  [key: string]: any;
}

export default (props?: any) => {
  const router = useRouter();
  const activityStore = useActivityStore();
  const filteredList = ref<ActivityItem[]>([]);

  const activityList = computed(() => {
    const { loadImage } = props;
    if (!loadImage?.image) return activityStore.activityList;
    return filteredList.value;
  });

  const loadActivityImages = async () => {
    const { loadImage } = props;
    if (!loadImage?.image) return;

    const results = await activityStore.activityList.reduce(async (accPromise, item) => {
      const acc = await accPromise;
      const imageKey = 'activity-' + item.type.toLowerCase();
      
      try {
        const logoSrc = await loadImage.image(imageKey);
        if (logoSrc) {
          acc.push({
            ...item,
            logoSrc
          });
        }
      } catch (error) {
        console.warn('fail image:', error);
      }
      
      return acc;
    }, Promise.resolve([] as ActivityItem[]));

    filteredList.value = results;
  };

  const goToActivity = (item: ActivityItem) => {
    const { id, type } = item;
    const activityId = jumpActivityId(item);
    router.push(`/activity/${type}/${activityId}`)
  }

  onMounted(async () => {
    try {
      await activityStore.requestActivityList();
      await loadActivityImages();
    } catch (error) {
      console.error('failed to load activity list:', error);
    }
  });

  return {
    activityList,
    goToActivity
  }
}
