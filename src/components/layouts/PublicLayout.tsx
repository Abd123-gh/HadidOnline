import { Outlet } from 'react-router-dom'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { Toaster } from '@/components/ui/sonner'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="bottom-left" richColors />
    </div>
  )
}
