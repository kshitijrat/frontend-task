'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNews } from '@/store/slices/contentSlice'
import { RootState, AppDispatch } from '@/store'
import ContentCard from '@/components/ContentCard'

export default function NewsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading } = useSelector((state: RootState) => state.content)

  useEffect(() => {
    if (!items.some(item => item.type === 'news')) {
      dispatch(fetchNews('general'))
    }
  }, [dispatch, items])

  const newsItems = items.filter(item => item.type === 'news')

  if (loading && !newsItems.length) return <div>Loading...</div>
  if (!newsItems.length) return <div>No news available</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {newsItems.map((item, index) => <ContentCard key={item.id} item={item} index={index} />)}
    </div>
  )
}
