import { useCallback, useState } from 'react'
import useUserInfo from '@/store/useUserInfo'

interface UseProfileSelectorReturn {
  profiles: string[]
  selectedProfileID: string
  handleProfileSelect: (profile: string) => void
  profileUrl: string
  isProfileChanged: boolean
}

export const useProfileSelector = (): UseProfileSelectorReturn => {
  const PROFILE_BASE_URL =
    'https://kr.object.ncloudstorage.com/cnergy-bucket/front_image/profile'

  const { userInfo, setUserInfo } = useUserInfo()
  const profiles = ['1', '2', '3', '4', '5', '6']

  const extractProfileID = (profileImage: string) => {
    if (!profileImage) {
      return '1'
    }
    const match = profileImage.match(/profile(\d+)\.svg$/)
    return match ? match[1] : '1'
  }

  const [selectedProfileID, setSelectedProfileID] = useState(
    extractProfileID(userInfo.profileImage),
  )

  const [isProfileChanged, setIsProfileChanged] = useState(false)

  const handleProfileSelect = useCallback(
    (profile: string) => {
      if (profile !== extractProfileID(userInfo.profileImage)) {
        setIsProfileChanged(true)
      } else {
        setIsProfileChanged(false)
      }
      setSelectedProfileID(profile)
      setUserInfo({
        ...userInfo,
        profileImage: `${PROFILE_BASE_URL}/profile${profile}.svg`,
      })
    },
    [userInfo, setUserInfo],
  )

  return {
    profiles,
    selectedProfileID,
    profileUrl: `${PROFILE_BASE_URL}/profile${selectedProfileID}.svg`,
    handleProfileSelect,
    isProfileChanged,
  }
}
