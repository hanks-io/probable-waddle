import { FavoriteListModel } from "@/api/personal/model";
import { useUserStore } from "@/store/user";
import { computed } from "vue";

/**
 * @description 设置收藏状态
 * @param list 收藏列表
 * @param gameType 游戏类型
 */
export function setFavorite(list: any[], gameType?: string) {
  const userStore = useUserStore()
  const favoriteList = userStore.favoriteList;

  list.forEach((item) => {
    item.isFavorite = false;
    favoriteList.forEach((favoriteItem) => {
      if (item.id == favoriteItem.platformId && item.target == 'hall' && favoriteItem.gameType == gameType) {
        item.isFavorite = true;
      }
      if (item.gameId || item.type == 'game') {
        if (item.gameId == favoriteItem.gameId || item.id == favoriteItem.gameId)
          item.isFavorite = true;
      } else {
        if (item.type == 'gameType' && !favoriteItem.gameId && item.gameType == favoriteItem.gameType && item.platformId == favoriteItem.platformId) {
          item.isFavorite = true;
        } else if (!favoriteItem.gameId && gameType == favoriteItem.gameType && (item.platformId == favoriteItem.platformId || item.id == favoriteItem.platformId)) {
          item.isFavorite = true;
        } else if (!item.type && item.id == favoriteItem.gameId && item.gameType == favoriteItem.gameType && item.platformId == favoriteItem.platformId) {
          item.isFavorite = true;
        }
      }
    });
  });
}

/**
 * @description 筛选收藏列表
 * @param
 */
export function filterFavorite(list: FavoriteListModel['favortieList'], gameType: string, platformId: number) {
  const res = list.filter((item) => {
    if (platformId)
      return item.gameId && item.gameType == gameType && item.platformId == platformId;
    else
      return item.gameId && item.gameType == gameType
  })
  setFavorite(list)
  return res;
}
