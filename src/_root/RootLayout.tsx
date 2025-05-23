import BottomBar from '@/components/shared/bottombar'
import SideBar from '@/components/shared/sidebar'
import TopBar from '@/components/shared/topbar'

import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className='w-full md:flex'>
      <TopBar />
      <SideBar />
      <section className='flex flex-1 h-full'>
        <Outlet/>
      </section>
      <BottomBar/>
    </div>
  )
}

export default RootLayout
