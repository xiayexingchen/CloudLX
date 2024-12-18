import { ref } from 'vue'
import { fetchAvatarAPI } from '@/api/api-user'

const avatarUrl = ref('')
const isAvatarInitialized = ref(false)
const lastUpdateTime = ref(0)

export function useAvatar() {
  const fetchAvatar = async (forceUpdate = false) => {
    if (isAvatarInitialized.value && !forceUpdate) {
      console.log('使用缓存的头像URL:', avatarUrl.value)
      return avatarUrl.value
    }

    try {
      const res = await fetchAvatarAPI()
      if (res.code === 23101) {
        // 基础URL
        const baseUrl = 'http://120.46.199.126:8080' + res.data
        // 只在强制更新时添加时间戳
        avatarUrl.value = forceUpdate ? 
          `${baseUrl}?t=${Date.now()}` : 
          baseUrl
        
        isAvatarInitialized.value = true
        lastUpdateTime.value = Date.now()
        console.log('头像已更新:', avatarUrl.value)
      }
    } catch (err) {
      console.error('获取头像失败:', err)
    }
    
    return avatarUrl.value
  }

  // 强制更新头像（始终带时间戳）
  const forceUpdateAvatar = () => {
    return fetchAvatar(true)
  }

  return {
    avatarUrl,
    fetchAvatar,
    forceUpdateAvatar
  }
}