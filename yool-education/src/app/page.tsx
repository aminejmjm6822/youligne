import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">
            Yool Education
          </div>
          <div className="space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Se connecter</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>S'inscrire</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Apprenez sans limites avec
            <span className="text-blue-600"> Yool Education</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Une plateforme d'apprentissage moderne qui connecte étudiants et enseignants 
            du monde entier. Créez, partagez et apprenez avec des outils interactifs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Commencer gratuitement
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Parcourir les cours
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold mb-2">Cours interactifs</h3>
              <p className="text-gray-600">
                Vidéos, quiz, devoirs et projets pratiques pour un apprentissage complet.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">Gamification</h3>
              <p className="text-gray-600">
                Badges, points et classements pour rendre l'apprentissage amusant.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Multilingue</h3>
              <p className="text-gray-600">
                Disponible en français, anglais et arabe pour tous les apprenants.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">10K+</div>
                <div className="text-gray-600">Étudiants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-gray-600">Cours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">100+</div>
                <div className="text-gray-600">Enseignants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">95%</div>
                <div className="text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-4">
                Yool Education
              </div>
              <p className="text-gray-400">
                La plateforme d'apprentissage qui révolutionne l'éducation en ligne.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Plateforme</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/courses" className="hover:text-white">Cours</Link></li>
                <li><Link href="/teachers" className="hover:text-white">Enseignants</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Tarifs</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Aide</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Confidentialité</Link></li>
                <li><Link href="/terms" className="hover:text-white">CGU</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2024 Yool Education. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
