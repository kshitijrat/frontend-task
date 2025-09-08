'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovies } from '@/store/slices/contentSlice'
import { RootState, AppDispatch } from '@/store'
import ContentCard from '@/components/ContentCard'

export default function MoviesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading } = useSelector((state: RootState) => state.content)

  // fetch movies if not already loaded
  useEffect(() => {
    if (!items.some(item => item.type === 'movie')) {
      dispatch(fetchMovies())
    }
  }, [dispatch, items])

  const movieItems = items.filter(item => item.type === 'movie')

  if (loading && !movieItems.length) return <div>Loading...</div>
  if (!movieItems.length) return <div className="text-center py-12">No movies available</div>

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {movieItems.map((item, index) => (
        <ContentCard key={item.id} item={item} index={index} />
      ))}
    </div>
  )
}
