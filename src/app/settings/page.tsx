'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiCheck, FiSave } from 'react-icons/fi'
import { RootState } from '@/store'
import { updateCategories } from '@/store/slices/preferencesSlice'

const availableCategories = [
  { id: 'technology', label: 'Technology', color: 'blue' },
  { id: 'sports', label: 'Sports', color: 'green' },
  { id: 'finance', label: 'Finance', color: 'yellow' },
  { id: 'movies', label: 'Movies', color: 'purple' },
  { id: 'music', label: 'Music', color: 'pink' },
  { id: 'health', label: 'Health', color: 'teal' },
  { id: 'science', label: 'Science', color: 'indigo' },
  { id: 'entertainment', label: 'Entertainment', color: 'orange' },
]

export default function Settings() {
  const dispatch = useDispatch()
  const { categories } = useSelector((state: RootState) => state.preferences)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categories.map(cat => cat.toLowerCase())
  )
  const [saved, setSaved] = useState(false)

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSave = () => {
    const formattedCategories = selectedCategories.map(
      id => availableCategories.find(cat => cat.id === id)?.label || id
    )
    dispatch(updateCategories(formattedCategories))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colorMap: { [key: string]: string } = {
      blue: isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-blue-200 hover:border-blue-400 text-blue-600',
      green: isSelected ? 'bg-green-500 border-green-500 text-white' : 'border-green-200 hover:border-green-400 text-green-600',
      yellow: isSelected ? 'bg-yellow-500 border-yellow-500 text-white' : 'border-yellow-200 hover:border-yellow-400 text-yellow-600',
      purple: isSelected ? 'bg-purple-500 border-purple-500 text-white' : 'border-purple-200 hover:border-purple-400 text-purple-600',
      pink: isSelected ? 'bg-pink-500 border-pink-500 text-white' : 'border-pink-200 hover:border-pink-400 text-pink-600',
      teal: isSelected ? 'bg-teal-500 border-teal-500 text-white' : 'border-teal-200 hover:border-teal-400 text-teal-600',
      indigo: isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-indigo-200 hover:border-indigo-400 text-indigo-600',
      orange: isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-orange-200 hover:border-orange-400 text-orange-600',
    }
    return colorMap[color] || 'border-gray-200 hover:border-gray-400 text-gray-600'
  }

  return (
    <div className="max-w-4xl mx-auto p-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className=" rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:p-8"
      >
        {/* header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold  mb-2">Settings</h1>
          <p className="">
            Customize your feed by selecting your favorite categories
          </p>
        </div>

        {/* category Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold  mb-4">
            Preferred Categories
          </h2>
          <p className="text-sm mb-6">
            Select the categories you're most interested in. We'll personalize your feed based on these preferences.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableCategories.map((category) => {
              const isSelected = selectedCategories.includes(category.id)
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategoryToggle(category.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                    getColorClasses(category.color, isSelected)
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center"
                      >
                        <FiCheck size={12} />
                      </motion.div>
                    )}
                  </div>
                  <span className="font-medium">{category.label}</span>
                </motion.button>
              )
            })}
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Selected: {selectedCategories.length} categories
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {saved ? <FiCheck size={18} /> : <FiSave size={18} />}
            <span>{saved ? 'Saved!' : 'Save Preferences'}</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}