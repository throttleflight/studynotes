'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

interface Note {
  id: string
  title: string
  snippet: string
  content: string
  createdAt: string
  tags: string[]
}

interface Subject {
  subjectId: string
  subjectName: string
  description: string
  notes: Note[]
}

interface SubjectResponse {
  subject: Subject
}

export default function SubjectDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const subjectId = params.subjectId as string
  
  const [subject, setSubject] = useState<Subject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedNote, setExpandedNote] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && subjectId) {
      fetchSubject()
    }
  }, [status, router, subjectId])

  const fetchSubject = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(`/api/notes?subject=${subjectId}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        if (response.status === 404) {
          setError('Subject not found')
          return
        }
        throw new Error('Failed to fetch subject')
      }

      const data: SubjectResponse = await response.json()
      setSubject(data.subject)
    } catch (error) {
      console.error('Error fetching subject:', error)
      setError('Failed to load subject. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleNoteExpansion = (noteId: string) => {
    setExpandedNote(expandedNote === noteId ? null : noteId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <NavBar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
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
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <Link href="/notes" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              All Subjects
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">
              {subject?.subjectName || 'Loading...'}
            </span>
          </div>
        </nav>

        {/* Error State */}
        {error && (
          <Alert className="mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertDescription className="text-red-800 dark:text-red-200">
              {error}
              <div className="mt-4 space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchSubject}
                >
                  Try Again
                </Button>
                <Link href="/notes">
                  <Button variant="outline" size="sm">
                    Back to All Subjects
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Subject Header */}
        {subject && (
          <>
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {subject.subjectName}
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
                {subject.description}
              </p>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {subject.notes.length} {subject.notes.length === 1 ? 'Note' : 'Notes'}
                </Badge>
                <Link href="/notes">
                  <Button variant="outline" size="sm">
                    Back to All Subjects
                  </Button>
                </Link>
              </div>
            </div>

            {/* Notes List */}
            {subject.notes.length > 0 ? (
              <div className="space-y-8">
                {subject.notes.map((note, index) => (
                  <Card key={note.id} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-2xl font-bold">
                          {note.title}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {formatDate(note.createdAt)}
                        </Badge>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {/* Note Content */}
                      <div className="prose prose-slate dark:prose-invert max-w-none">
                        {expandedNote === note.id ? (
                          <div>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                              {note.content}
                            </p>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleNoteExpansion(note.id)}
                              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            >
                              Show Less
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                              {note.snippet}
                            </p>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleNoteExpansion(note.id)}
                              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            >
                              Read More
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    {index < subject.notes.length - 1 && (
                      <div className="px-6 pb-6">
                        <Separator />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                  No Notes Available
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  There are currently no notes available for this subject.
                </p>
                <Link href="/notes">
                  <Button>
                    Browse Other Subjects
                  </Button>
                </Link>
              </div>
            )}

            {/* Subject Summary */}
            {subject.notes.length > 0 && (
              <div className="mt-16 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                  {subject.subjectName} Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      {subject.notes.length}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Total Notes
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      {subject.notes.reduce((total, note) => total + note.tags.length, 0)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Total Tags
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      {Math.round(subject.notes.reduce((total, note) => total + note.content.length, 0) / subject.notes.length / 100)}k
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Avg Characters
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
