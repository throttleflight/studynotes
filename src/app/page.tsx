import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                StudyNotes
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/notes">
                <Button variant="ghost">Browse Notes</Button>
              </Link>
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Your Study Notes,
            <span className="text-slate-600 dark:text-slate-300"> Organized</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            Create, organize, and share your study notes across multiple subjects. 
            Access your knowledge anywhere, anytime with our modern note-taking platform.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/login">
              <Button size="lg" className="px-8 py-3">
                Get Started
              </Button>
            </Link>
            <Link href="/notes">
              <Button variant="outline" size="lg" className="px-8 py-3">
                View Notes
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Multi-Subject Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Organize your notes by subjects like Mathematics, Science, History, and more. 
                Keep everything structured and easy to find.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Collaborative Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Share your notes with classmates and friends. Learn together and 
                build a comprehensive knowledge base.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Modern Interface</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Clean, intuitive design that focuses on your content. 
                Responsive layout works perfectly on all devices.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to organize your studies?
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Join thousands of students who have transformed their note-taking experience.
          </p>
          <Link href="/login">
            <Button size="lg" className="px-12 py-4 text-lg">
              Start Taking Notes
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
