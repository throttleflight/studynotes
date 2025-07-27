import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

// Sample notes data - in production, this would come from a database
const notesData = {
  subjects: [
    {
      subjectId: 'mathematics',
      subjectName: 'Mathematics',
      description: 'Advanced mathematical concepts and problem-solving techniques',
      notes: [
        {
          id: '1',
          title: 'Calculus Fundamentals',
          snippet: 'Understanding derivatives and their applications in real-world problems. Covers basic differentiation rules, chain rule, and optimization.',
          content: 'Calculus is the mathematical study of continuous change. In this comprehensive guide, we explore the fundamental concepts of derivatives, including the power rule, product rule, quotient rule, and chain rule. We also delve into practical applications such as finding maximum and minimum values, rates of change, and optimization problems.',
          createdAt: '2024-01-15',
          tags: ['calculus', 'derivatives', 'optimization']
        },
        {
          id: '2',
          title: 'Linear Algebra Basics',
          snippet: 'Matrix operations, vector spaces, and linear transformations explained with practical examples and applications.',
          content: 'Linear algebra forms the foundation of many mathematical and computational applications. This note covers matrix operations including addition, multiplication, and inversion. We explore vector spaces, linear independence, basis vectors, and linear transformations with real-world applications in computer graphics and data science.',
          createdAt: '2024-01-12',
          tags: ['linear-algebra', 'matrices', 'vectors']
        },
        {
          id: '3',
          title: 'Statistics and Probability',
          snippet: 'Comprehensive overview of statistical methods, probability distributions, and hypothesis testing.',
          content: 'Statistics and probability are essential tools for data analysis and decision making. This comprehensive guide covers descriptive statistics, probability distributions (normal, binomial, Poisson), hypothesis testing, confidence intervals, and regression analysis with practical examples.',
          createdAt: '2024-01-10',
          tags: ['statistics', 'probability', 'hypothesis-testing']
        }
      ]
    },
    {
      subjectId: 'physics',
      subjectName: 'Physics',
      description: 'Classical and modern physics principles with practical applications',
      notes: [
        {
          id: '4',
          title: 'Classical Mechanics',
          snippet: 'Newton\'s laws of motion, energy conservation, and momentum in classical systems.',
          content: 'Classical mechanics describes the motion of objects from projectiles to planets. This note covers Newton\'s three laws of motion, work-energy theorem, conservation of momentum, and rotational dynamics. Includes problem-solving strategies and real-world applications.',
          createdAt: '2024-01-14',
          tags: ['mechanics', 'newton-laws', 'energy']
        },
        {
          id: '5',
          title: 'Electromagnetic Theory',
          snippet: 'Electric and magnetic fields, Maxwell\'s equations, and electromagnetic waves.',
          content: 'Electromagnetic theory unifies electricity and magnetism through Maxwell\'s equations. This comprehensive study covers electric fields, magnetic fields, electromagnetic induction, and wave propagation. Applications include motors, generators, and wireless communication.',
          createdAt: '2024-01-11',
          tags: ['electromagnetism', 'maxwell-equations', 'waves']
        }
      ]
    },
    {
      subjectId: 'chemistry',
      subjectName: 'Chemistry',
      description: 'Organic, inorganic, and physical chemistry concepts',
      notes: [
        {
          id: '6',
          title: 'Organic Chemistry Reactions',
          snippet: 'Key organic reactions, mechanisms, and synthesis strategies for complex molecules.',
          content: 'Organic chemistry focuses on carbon-containing compounds and their reactions. This note covers fundamental reaction mechanisms including nucleophilic substitution, elimination reactions, and electrophilic addition. Includes synthesis strategies and stereochemistry considerations.',
          createdAt: '2024-01-13',
          tags: ['organic-chemistry', 'reactions', 'mechanisms']
        },
        {
          id: '7',
          title: 'Chemical Thermodynamics',
          snippet: 'Energy changes in chemical reactions, entropy, and equilibrium principles.',
          content: 'Chemical thermodynamics studies energy changes in chemical processes. This comprehensive guide covers the first and second laws of thermodynamics, enthalpy, entropy, Gibbs free energy, and chemical equilibrium with practical applications in industrial processes.',
          createdAt: '2024-01-09',
          tags: ['thermodynamics', 'entropy', 'equilibrium']
        }
      ]
    },
    {
      subjectId: 'computer-science',
      subjectName: 'Computer Science',
      description: 'Programming, algorithms, and software engineering principles',
      notes: [
        {
          id: '8',
          title: 'Data Structures and Algorithms',
          snippet: 'Essential data structures (arrays, trees, graphs) and algorithmic problem-solving techniques.',
          content: 'Data structures and algorithms form the foundation of computer science. This note covers fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs. Also includes algorithmic techniques like sorting, searching, and dynamic programming with complexity analysis.',
          createdAt: '2024-01-16',
          tags: ['data-structures', 'algorithms', 'complexity']
        },
        {
          id: '9',
          title: 'Object-Oriented Programming',
          snippet: 'OOP principles: encapsulation, inheritance, polymorphism, and design patterns.',
          content: 'Object-oriented programming is a paradigm that organizes code around objects and classes. This comprehensive guide covers the four pillars of OOP: encapsulation, inheritance, polymorphism, and abstraction. Includes design patterns and best practices for maintainable code.',
          createdAt: '2024-01-08',
          tags: ['oop', 'design-patterns', 'programming']
        }
      ]
    },
    {
      subjectId: 'biology',
      subjectName: 'Biology',
      description: 'Life sciences covering molecular biology, genetics, and ecology',
      notes: [
        {
          id: '10',
          title: 'Cell Biology Fundamentals',
          snippet: 'Cell structure, organelles, and cellular processes including mitosis and meiosis.',
          content: 'Cell biology studies the structure and function of cells, the basic units of life. This note covers cell membrane structure, organelles and their functions, cellular respiration, photosynthesis, and cell division processes including mitosis and meiosis.',
          createdAt: '2024-01-07',
          tags: ['cell-biology', 'organelles', 'cell-division']
        }
      ]
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('subject')

    // If specific subject requested, filter the data
    if (subjectId) {
      const subject = notesData.subjects.find(s => s.subjectId === subjectId)
      if (!subject) {
        return NextResponse.json(
          { error: 'Subject not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ subject })
    }

    // Return all subjects with note counts
    const subjectsWithCounts = notesData.subjects.map(subject => ({
      ...subject,
      noteCount: subject.notes.length,
      // Don't include full note content in the list view
      notes: subject.notes.map(note => ({
        id: note.id,
        title: note.title,
        snippet: note.snippet,
        createdAt: note.createdAt,
        tags: note.tags
      }))
    }))

    return NextResponse.json({ subjects: subjectsWithCounts })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
