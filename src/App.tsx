import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'

import PublicLayout from '@/components/layouts/PublicLayout'
import HomePage from '@/pages/public/HomePage'
import AboutPage from '@/pages/public/AboutPage'
import ServicesPage from '@/pages/public/ServicesPage'
import FleetPage from '@/pages/public/FleetPage'
import ToursPage from '@/pages/public/ToursPage'
import CorporatePage from '@/pages/public/CorporatePage'
import SchoolPage from '@/pages/public/SchoolPage'
import BookingPage from '@/pages/public/BookingPage'
import ContactPage from '@/pages/public/ContactPage'
import FaqPage from '@/pages/public/FaqPage'

import AdminLayout from '@/components/layouts/AdminLayout'
import DashboardOverview from '@/pages/admin/DashboardOverview'
import AdminBookings from '@/pages/admin/AdminBookings'
import AdminContracts from '@/pages/admin/AdminContracts'
import AdminFleet from '@/pages/admin/AdminFleet'
import AdminClients from '@/pages/admin/AdminClients'
import AdminDrivers from '@/pages/admin/AdminDrivers'
import AdminTrips from '@/pages/admin/AdminTrips'
import AdminInvoices from '@/pages/admin/AdminInvoices'
import AdminReports from '@/pages/admin/AdminReports'
import AdminSettings from '@/pages/admin/AdminSettings'

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="hadid-theme">
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/tours" element={<ToursPage />} />
            <Route path="/corporate" element={<CorporatePage />} />
            <Route path="/school" element={<SchoolPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="contracts" element={<AdminContracts />} />
            <Route path="fleet" element={<AdminFleet />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="drivers" element={<AdminDrivers />} />
            <Route path="trips" element={<AdminTrips />} />
            <Route path="invoices" element={<AdminInvoices />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
