'use client'

import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Header() {
  const { data: session } = useSession()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-900">
          Tableau de bord
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <span className="text-xl">🔔</span>
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-100"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={session?.user?.avatar} />
              <AvatarFallback>
                {session?.user ? getInitials(session.user.firstName, session.user.lastName) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">
                {session?.user ? `${session.user.firstName} ${session.user.lastName}` : 'Utilisateur'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {session?.user?.role?.toLowerCase()}
              </p>
            </div>
            <span className="text-gray-400">▼</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
              <button
                onClick={() => setShowUserMenu(false)}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Profil
              </button>
              <button
                onClick={() => setShowUserMenu(false)}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Paramètres
              </button>
              <hr className="my-1" />
              <button
                onClick={handleSignOut}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}