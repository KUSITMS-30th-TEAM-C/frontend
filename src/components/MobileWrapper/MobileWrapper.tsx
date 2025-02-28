import { ReactNode } from 'react'
import SplashLogoNew from '../Icons/SplashLogoNew'

export default function MobileWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center h-full overflow-hidden">
      <aside className="hidden min-w-380 mr-[5%] min-[800px]:flex  items-center justify-center ">
        <SplashLogoNew />
      </aside>
      <div className="min-[800px]:w-350 relative flex flex-col min-w-390 min-h-844 border-1 overflow-y-auto overflow-x-hidden scrollbar-hide my-30 rounded-10">
        {children}
      </div>
    </div>
  )
}
