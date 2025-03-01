import { GenderType } from '@/store/useUserInfo'

export interface QuickStart {
  id?: number
  name: string
  hour: number
  minute: number
  meridiem: '오전' | '오후'
  spareTime: number
  type: 'ONLINE' | 'OFFLINE' | 'ONLINE_AND_OFFLINE'
}

export interface QuickStartResponse {
  quickStartResponses: QuickStart[]
}

export interface QuickStartRequest {
  name: string
  hour: number
  minute: number
  meridiem: '오전' | '오후'
  spareTime: number
  type: 'ONLINE' | 'OFFLINE' | 'ONLINE_AND_OFFLINE'
}
export interface HomeResponse {
  member: {
    id: string
    nickname: string
    profileImage: string
  }
  quickStart: QuickStart
  totalSavedTime: number
  activities: {
    id: number
    keyword: {
      category: string
      image: string
    }
    title: string
    savedTime: number
  }[]
}

export interface LoginResponse {
  role: 'MEMBER' | 'GUEST'
  email: string
  nickname: string
  birthYear: string
  gender: GenderType
  profileImage: string
  registrationDate: Date
}
