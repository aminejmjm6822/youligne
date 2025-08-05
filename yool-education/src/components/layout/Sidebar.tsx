'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { UserRole } from '@prisma/client'

interface SidebarProps {
  userRole: UserRole
}

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Tableau de bord' },
  { href: '/admin/users', label: 'Utilisateurs' },
  { href: '/admin/courses', label: 'Cours' },
  { href: '/admin/payments', label: 'Paiements' },
  { href: '/admin/analytics', label: 'Statistiques' },
  { href: '/admin/settings', label: 'Paramètres' },
]

const teacherNavItems = [
  { href: '/teacher/dashboard', label: 'Tableau de bord' },
  { href: '/teacher/courses', label: 'Mes cours' },
  { href: '/teacher/students', label: 'Étudiants' },
  { href: '/teacher/earnings', label: 'Revenus' },
  { href: '/teacher/analytics', label: 'Statistiques' },
  { href: '/teacher/live-classes', label: 'Classes en direct' },
  { href: '/teacher/profile', label: 'Profil' },
]

const studentNavItems = [
  { href: '/student/dashboard', label: 'Tableau de bord' },
  { href: '/student/courses', label: 'Mes cours' },
  { href: '/student/browse', label: 'Parcourir' },
  { href: '/student/assignments', label: 'Devoirs' },
  { href: '/student/certificates', label: 'Certificats' },
  { href: '/student/forum', label: 'Forum' },
  { href: '/student/notifications', label: 'Notifications' },
  { href: '/student/profile', label: 'Profil' },
]

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()

  const getNavItems = () => {
    switch (userRole) {
      case UserRole.ADMIN:
        return adminNavItems
      case UserRole.TEACHER:
        return teacherNavItems
      case UserRole.STUDENT:
        return studentNavItems
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Yool Education
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      
      <div className="border-t border-gray-200 p-4">
        <div className="text-xs text-gray-500 text-center">
          © 2024 Yool Education
        </div>
      </div>
    </div>
  )
}