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

interface StudentStats {
  totalEnrollments: number
  completedCourses: number
  totalPoints: number
  currentLevel: number
  recentEnrollments: any[]
  upcomingAssignments: any[]
  badges: any[]
}

export default function StudentDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== UserRole.STUDENT) {
      router.push('/auth/signin')
      return
    }

    fetchStudentStats()
  }, [session, status, router])

  const fetchStudentStats = async () => {
    try {
      const response = await fetch('/api/student/dashboard-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching student stats:', error)
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

  if (!session || session.user.role !== UserRole.STUDENT) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={session.user.role} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Bonjour {session.user.firstName} ! 👋
            </h1>
            <p className="text-gray-600">Continuez votre parcours d'apprentissage</p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              <Link href="/student/browse">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  🔍 Parcourir les cours
                </Button>
              </Link>
              <Link href="/student/courses">
                <Button variant="outline">
                  📚 Mes cours
                </Button>
              </Link>
              <Link href="/student/certificates">
                <Button variant="outline">
                  🏆 Mes certificats
                </Button>
              </Link>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cours inscrits</CardTitle>
                <span className="text-2xl">📚</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalEnrollments || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Cours actifs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cours terminés</CardTitle>
                <span className="text-2xl">✅</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.completedCourses || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Certificats obtenus
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Points</CardTitle>
                <span className="text-2xl">⭐</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalPoints || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Points gagnés
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Niveau</CardTitle>
                <span className="text-2xl">🎯</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Niveau {stats?.currentLevel || 1}</div>
                <p className="text-xs text-muted-foreground">
                  Votre niveau actuel
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* My Courses Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Mes cours en cours</CardTitle>
                <CardDescription>
                  Continuez là où vous vous êtes arrêté
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentEnrollments?.map((enrollment) => (
                    <div key={enrollment.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{enrollment.course.title}</h4>
                        <span className="text-sm text-gray-500">
                          {Math.round(enrollment.progress)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Par {enrollment.course.teacher.firstName} {enrollment.course.teacher.lastName}</span>
                        <Link href={`/student/courses/${enrollment.course.id}`}>
                          <Button size="sm" variant="outline">
                            Continuer
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {!stats?.recentEnrollments?.length && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">Aucun cours inscrit</p>
                      <Link href="/student/browse">
                        <Button>Parcourir les cours</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Assignments */}
            <Card>
              <CardHeader>
                <CardTitle>Devoirs à venir</CardTitle>
                <CardDescription>
                  Ne manquez pas vos échéances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.upcomingAssignments?.map((assignment) => (
                    <div key={assignment.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{assignment.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          new Date(assignment.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {new Date(assignment.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            ? 'Urgent'
                            : 'À venir'
                          }
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{assignment.course.title}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          Échéance: {new Date(assignment.dueDate).toLocaleDateString('fr-FR')}
                        </span>
                        <Link href={`/student/assignments/${assignment.id}`}>
                          <Button size="sm" variant="outline">
                            Voir
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {!stats?.upcomingAssignments?.length && (
                    <p className="text-gray-500 text-center py-4">
                      Aucun devoir à venir
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Badges Section */}
          {stats?.badges && stats.badges.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Mes badges récents</CardTitle>
                <CardDescription>
                  Vos dernières réalisations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {stats.badges.slice(0, 6).map((badge) => (
                    <div key={badge.id} className="flex items-center space-x-2 bg-yellow-50 p-3 rounded-lg">
                      <span className="text-2xl">🏆</span>
                      <div>
                        <p className="font-medium text-sm">{badge.name}</p>
                        <p className="text-xs text-gray-500">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}