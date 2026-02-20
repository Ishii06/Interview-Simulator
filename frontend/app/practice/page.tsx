'use client'
import { useRouter } from 'next/navigation'

export default function Practice() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">

      <button
        onClick={() => router.push('/practice/aptitude/new')}
        className="px-6 py-3 bg-green-600 text-white rounded-lg"
      >
        Start Aptitude Test
      </button>

      <button
        onClick={() => router.push('/practice/coding/new')}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg"
      >
        Start Coding Test
      </button>

    </div>
  )
}
