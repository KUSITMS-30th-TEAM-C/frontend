import Image from 'next/image'

export default function SuggestionWait({
  nickname,
  keywords,
}: {
  nickname: string
  keywords: string[]
}) {
  const translateKeyword = (keyword: string) => {
    switch (keyword) {
      case 'SELF_DEVELOPMENT':
        return '자기개발'
      case 'HEALTH':
        return '건강'
      case 'NATURE':
        return '자연'
      case 'CULTURE_ART':
        return '문화/예술'
      case 'ENTERTAINMENT':
        return '엔터테인먼트'
      case 'RELAXATION':
        return '휴식'
      case 'SOCIAL':
        return '소셜'
      default:
        return ''
    }
  }

  const translatedKeywords = keywords.map(translateKeyword)
  return (
    <div className="w-full bg-[#F7F7FC]">
      <div className="w-251 mx-auto mt-35 text-center">
        <p className="font-semibold text-24">
          {nickname} 님에게 딱 맞는
          <br />
          활동을 찾고 있어요
        </p>
        <p className="w-230 mt-8 mx-auto">
          {translatedKeywords.join(', ')}의 시간 조각을 모아봐요!
        </p>
      </div>

      <Image
        src="/gif/suggest_waiting.gif"
        alt="suggest_waiting"
        width={388}
        height={390}
        unoptimized
        priority
        className="z-10 mt-80"
      />

      <Image
        src="/images/bg-suggestchoice.png"
        alt="suggestchoice_background"
        width={388}
        height={304}
        className="absolute bottom-0 transform -translate-x-1/2"
      />
    </div>
  )
}
