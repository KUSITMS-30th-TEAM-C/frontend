import { useCallback, useState } from 'react'
import useUserInfo from '@/store/useUserInfo'

interface UseProfileSelectorReturn {
  profiles: string[]
  selectedProfileID: string
  handleProfileSelect: (profile: string) => void
  profileUrl: string
}

export const useProfileSelector = (): UseProfileSelectorReturn => {
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

  const handleProfileSelect = useCallback(
    (profile: string) => {
      setSelectedProfileID(profile)
    },
    [userInfo, setUserInfo],
  )

  return {
    profiles,
    selectedProfileID,
    profileUrl: `/profile/profile${selectedProfileID}.svg`,
    handleProfileSelect,
  }
}
