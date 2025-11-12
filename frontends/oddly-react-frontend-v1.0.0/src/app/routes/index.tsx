import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '@/features/auth'

/**
 * App routes
 * 
 * Centralized route configuration.
 * Features export their routes for assembly here.
 * 
 * Use lazy loading for code splitting:
 * const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'))
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* 404 - add later */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
