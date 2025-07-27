'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

interface Note {
  id: string
  title: string
  snippet: string
  createdAt: string
  tags: string[]
}

interface Subject {
  subjectId: string
  subjectName: string
  description: string
  noteCount: number
  notes: Note[]
}

interface NotesResponse {
  subjects: Subject[]
}

export default function NotesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchNotes()
    }
  }, [status, router])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('/api/notes')
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch notes')
      }

      const data: NotesResponse = await response.json()
      setSubjects(data.subjects)
    } catch (error) {
      console.error('Error fetching notes:', error)
      setError('Failed to load notes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Study Notes Collection
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl">
            Explore comprehensive study materials across multiple subjects. 
            Click on any subject to dive deeper into the notes.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <Alert className="mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertDescription className="text-red-800 dark:text-red-200">
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchNotes}
                className="ml-4"
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Subjects Grid */}
        {subjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject) => (
              <Link key={subject.subjectId} href={`/subject/${subject.subjectId}`}>
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl font-bold group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                        {subject.subjectName}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {subject.noteCount} {subject.noteCount === 1 ? 'note' : 'notes'}
                      </Badge>
                    </div>
                    <CardDescription className="text-base leading-relaxed">
                      {subject.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Recent Notes Preview */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-3">
                        Recent Notes:
                      </h4>
                      {subject.notes.slice(0, 2).map((note) => (
                        <div key={note.id} className="border-l-2 border-slate-200 dark:border-slate-700 pl-3">
                          <h5 className="font-medium text-sm text-slate-900 dark:text-white mb-1">
                            {note.title}
                          </h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                            {note.snippet}
                          </p>
                          <div className="flex gap-1 mt-2">
                            {note.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      {subject.noteCount > 2 && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                          +{subject.noteCount - 2} more notes available
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <Button variant="ghost" size="sm" className="w-full group-hover:bg-slate-100 dark:group-hover:bg-slate-700">
                        View All Notes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : !loading && !error && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              No Notes Available
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              There are currently no study notes available. Check back later!
            </p>
          </div>
        )}

        {/* Stats Section */}
        {subjects.length > 0 && (
          <div className="mt-16 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
              Collection Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {subjects.length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Subjects
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {subjects.reduce((total, subject) => total + subject.noteCount, 0)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Total Notes
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {Math.round(subjects.reduce((total, subject) => total + subject.noteCount, 0) / subjects.length)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Avg per Subject
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {subjects.reduce((max, subject) => Math.max(max, subject.noteCount), 0)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Most Notes
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
