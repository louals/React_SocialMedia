import SideBar from '@/components/shared/SideBar'
import TopBar from '@/components/shared/TopBar'
import BottomBar from '@/components/shared/BottomBar'



import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className='w-full md:flex'>
      
      <SideBar />

      {/* NEW WRAPPER TO OFFSET PAGES */}
      <main className="flex-1 md:ml-[270px]">
        <section className='flex flex-1 h-full'>
          <Outlet/>
        </section>
      </main>

      <br />
      <br />
      
      <BottomBar/>
    </div>
  )
}


export default RootLayout
