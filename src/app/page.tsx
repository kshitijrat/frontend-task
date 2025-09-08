// src/app/page.tsx  (or src/pages/index.tsx)
'use client'

import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiRefreshCw } from 'react-icons/fi'
import { RootState, AppDispatch } from '@/store'
import {
  fetchNews,
  fetchMovies,
  fetchSocialPosts,
  updateTrending,
} from '@/store/slices/contentSlice'
import { updateFeedOrder } from '@/store/slices/preferencesSlice'
import ContentCard from '@/components/ContentCard'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

export default function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error, searchQuery, searchResults } = useSelector((state: RootState) => state.content)
  const { categories, feedOrder } = useSelector((state: RootState) => state.preferences)
  const [refreshing, setRefreshing] = useState(false)

  const loadContent = useCallback(async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        dispatch(fetchNews(categories.includes('Technology') ? 'technology' : 'general')),
        dispatch(fetchMovies()),
        dispatch(fetchSocialPosts()),
      ])
      dispatch(updateTrending())
    } finally {
      setRefreshing(false)
    }
  }, [categories, dispatch])

  useEffect(() => {
    loadContent()
  }, [loadContent])

  // Which items to display
  const displayItems = searchQuery.trim() ? searchResults : items

  // ---------- DnD state: ordered IDs ----------
  const [orderedIds, setOrderedIds] = useState<string[]>(() => {
    if (feedOrder && feedOrder.length) return feedOrder
    // fallback to current items' ids
    return items.map(i => i.id)
  })

  // sync when displayItems change (keeps existing order, append new items)
  useEffect(() => {
    const currentIds = displayItems.map(i => i.id)
    const next = [
      ...orderedIds.filter(id => currentIds.includes(id)),
      ...currentIds.filter(id => !orderedIds.includes(id)),
    ]
    // if nothing in orderedIds yet, just set to currentIds
    setOrderedIds(prev => (prev.length ? next : currentIds))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayItems])

  // if persisted feedOrder changes (e.g., login), sync it
  useEffect(() => {
    if (feedOrder && feedOrder.length) setOrderedIds(feedOrder)
  }, [feedOrder])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const src = result.source.index
    const dest = result.destination.index
    if (src === dest) return

    const next = Array.from(orderedIds)
    const [moved] = next.splice(src, 1)
    next.splice(dest, 0, moved)

    setOrderedIds(next)
    // persist globally (preferencesSlice saves to localStorage)
    dispatch(updateFeedOrder(next))
  }

  // If still loading and no items yet
  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Your Feed'}
          </motion.h1>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="mt-1">
            {searchQuery ? `${displayItems.length} results found` : 'Latest news, movies, and social content'}
          </motion.p>
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </motion.div>
      )}

      {displayItems.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="feed-droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orderedIds.map((id, index) => {
                  const item = displayItems.find(i => i.id === id)
                  if (!item) return null
                  return (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(draggableProvided, snapshot) => (
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                          style={{ ...draggableProvided.draggableProps.style }}
                        >
                          <ContentCard item={item} index={index} />
                        </div>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center">
            <FiRefreshCw className="text-gray-400" size={28} />
          </div>
          <h3 className="text-xl font-semibold mb-2">{searchQuery ? 'No results found' : 'No content available'}</h3>
          <p className="mb-4">{searchQuery ? 'Try adjusting your search terms' : 'Content will load automatically'}</p>
        </motion.div>
      )}
    </div>
  )
}
