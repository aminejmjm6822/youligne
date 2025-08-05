'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { UserRole } from '@prisma/client'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DashboardStats {
  totalUsers: number
  totalCourses: number
  totalRevenue: number
  pendingApprovals: number
  recentUsers: any[]
  recentCourses: any[]
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== UserRole.ADMIN) {
      router.push('/auth/signin')
      return
    }

    fetchDashboardStats()
  }, [session, status, router])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'POST',
      })
      if (response.ok) {
        fetchDashboardStats() // Refresh stats
      }
    } catch (error) {
      console.error('Error approving user:', error)
    }
  }

  const handleRejectUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/reject`, {
        method: 'POST',
      })
      if (response.ok) {
        fetchDashboardStats() // Refresh stats
      }
    } catch (error) {
      console.error('Error rejecting user:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    )
  }

  if (!session || session.user.role !== UserRole.ADMIN) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={session.user.role} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
            <p className="text-gray-600">Vue d'ensemble de la plateforme Yool Education</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs totaux</CardTitle>
                <span className="text-2xl">👥</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +12% par rapport au mois dernier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cours totaux</CardTitle>
                <span className="text-2xl">📚</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +5% par rapport au mois dernier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
                <span className="text-2xl">💰</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalRevenue || 0} €</div>
                <p className="text-xs text-muted-foreground">
                  +18% par rapport au mois dernier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En attente d'approbation</CardTitle>
                <span className="text-2xl">⏳</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingApprovals || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Comptes à valider
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users Awaiting Approval */}
            <Card>
              <CardHeader>
                <CardTitle>Comptes en attente de validation</CardTitle>
                <CardDescription>
                  Nouveaux enseignants et étudiants à approuver
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentUsers?.filter(user => user.status === 'PENDING').map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-blue-600 capitalize">{user.role.toLowerCase()}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveUser(user.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectUser(user.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Rejeter
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!stats?.recentUsers?.some(user => user.status === 'PENDING') && (
                    <p className="text-gray-500 text-center py-4">
                      Aucun compte en attente de validation
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Cours récents</CardTitle>
                <CardDescription>
                  Derniers cours publiés sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentCourses?.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-gray-500">Par {course.teacher.firstName} {course.teacher.lastName}</p>
                        <p className="text-xs text-green-600">{course.price > 0 ? `${course.price} €` : 'Gratuit'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{course.enrollments?.length || 0} inscrits</p>
                        <p className="text-xs text-gray-500">{course.views} vues</p>
                      </div>
                    </div>
                  ))}
                  {!stats?.recentCourses?.length && (
                    <p className="text-gray-500 text-center py-4">
                      Aucun cours récent
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}