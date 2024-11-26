import { useCallback, useState } from 'react'
import useUserInfo from '@/store/useUserInfo'

interface UseProfileSelectorReturn {
  profiles: string[]
  selectedProfileID: string
  handleProfileSelect: (profile: string) => void
  profileUrl: string
}

export const useProfileSelector = (): UseProfileSelectorReturn => {
  const PROFILE_BASE_URL =
    'https://kr.object.ncloudstorage.com/cnergy-bucket/front_image/profile'

  const { userInfo, setUserInfo } = useUserInfo()
  const profiles = ['1', '2', '3', '4', '5', '6']

  const extractProfileID = (profileImage: string) => {
    const match = profileImage.match(/profile(\d+)\.svg$/)
    return match ? match[1] : '1'
  }

  const [selectedProfileID, setSelectedProfileID] = useState(
    extractProfileID(userInfo.profileImage),
  )

  const handleProfileSelect = useCallback(
    (profile: string) => {
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
  }
}
