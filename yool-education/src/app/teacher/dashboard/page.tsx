'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { UserRole } from '@prisma/client'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface TeacherStats {
  totalCourses: number
  totalStudents: number
  totalRevenue: number
  pendingWithdrawals: number
  recentCourses: any[]
  recentEnrollments: any[]
}

export default function TeacherDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<TeacherStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== UserRole.TEACHER) {
      router.push('/auth/signin')
      return
    }

    if (session.user.status !== 'APPROVED') {
      router.push('/teacher/pending-approval')
      return
    }

    fetchTeacherStats()
  }, [session, status, router])

  const fetchTeacherStats = async () => {
    try {
      const response = await fetch('/api/teacher/dashboard-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching teacher stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    )
  }

  if (!session || session.user.role !== UserRole.TEACHER) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={session.user.role} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord enseignant</h1>
            <p className="text-gray-600">Gérez vos cours et suivez vos performances</p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              <Link href="/teacher/courses/create">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  ➕ Créer un nouveau cours
                </Button>
              </Link>
              <Link href="/teacher/live-classes/create">
                <Button variant="outline">
                  📹 Planifier une classe en direct
                </Button>
              </Link>
              <Link href="/teacher/earnings">
                <Button variant="outline">
                  💰 Voir mes revenus
                </Button>
              </Link>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mes cours</CardTitle>
                <span className="text-2xl">📚</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Cours publiés
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
                <span className="text-2xl">👥</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Inscrits totaux
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
                  Gains à ce jour
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Retraits en attente</CardTitle>
                <span className="text-2xl">⏳</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingWithdrawals || 0} €</div>
                <p className="text-xs text-muted-foreground">
                  En cours de traitement
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Mes cours récents</CardTitle>
                <CardDescription>
                  Vos derniers cours créés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentCourses?.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-gray-500">{course.category}</p>
                        <p className="text-xs text-green-600">
                          {course.price > 0 ? `${course.price} €` : 'Gratuit'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {course._count?.enrollments || 0} inscrits
                        </p>
                        <p className="text-xs text-gray-500">
                          {course.views} vues
                        </p>
                        <div className="mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            course.status === 'PUBLISHED' 
                              ? 'bg-green-100 text-green-800' 
                              : course.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {course.status === 'PUBLISHED' ? 'Publié' : 
                             course.status === 'PENDING' ? 'En attente' : 'Brouillon'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!stats?.recentCourses?.length && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">Aucun cours créé</p>
                      <Link href="/teacher/courses/create">
                        <Button>Créer votre premier cours</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Enrollments */}
            <Card>
              <CardHeader>
                <CardTitle>Inscriptions récentes</CardTitle>
                <CardDescription>
                  Nouveaux étudiants dans vos cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentEnrollments?.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {enrollment.user.firstName} {enrollment.user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {enrollment.course.title}
                        </p>
                        <p className="text-xs text-blue-600">
                          Inscrit le {new Date(enrollment.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {Math.round(enrollment.progress)}% complété
                        </p>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!stats?.recentEnrollments?.length && (
                    <p className="text-gray-500 text-center py-4">
                      Aucune inscription récente
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