import { NextResponse } from 'next/server'

// Mock social media posts
const mockSocialPosts = {
  posts: [
    {
      id: 1,
      username: "adventure_seeker",
      caption: "Just completed the most incredible hiking trail! The sunset views were absolutely breathtaking. Nature never fails to amaze me! 🌄 #hiking #adventure #sunset",
      image: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800",
      createdAt: new Date().toISOString(),
      likes: 14,
      comments: 8
    },
    {
      id: 2,
      username: "foodie_explorer",
      caption: "Tried this amazing new recipe today! Homemade pasta with truffle cream sauce. The flavors are out of this world! 🍝✨ #cooking #foodie #homemade",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      likes: 29,
      comments: 15
    },
    {
      id: 3,
      username: "tech_enthusiast",
      caption: "Working on an exciting new project! Can't wait to share what we've been building. The future of technology is here! 💻🚀 #tech #innovation #coding",
      image: "https://images.pexels.com/photos/2182863/pexels-photo-2182863.jpeg?auto=compress&cs=tinysrgb&w=800",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      likes: 10,
      comments: 5
    },
    {
      id: 4,
      username: "art_creator",
      caption: "Finished my latest painting today! This piece represents the harmony between nature and urban life. What do you think? 🎨🏙️ #art #painting #creativity",
      image: "https://images.pexels.com/photos/1579708/pexels-photo-1579708.jpeg?auto=compress&cs=tinysrgb&w=800",
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      likes: 203,
      comments: 142
    },
    {
      id: 5,
      username: "fitness_journey",
      caption: "Morning workout complete! Nothing beats that post-exercise endorphin rush. Consistency is key to achieving your goals! 💪🏃‍♀️ #fitness #motivation #health",
      image: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=800",
      createdAt: new Date(Date.now() - 21600000).toISOString(),
      likes: 17,
      comments: 12
    },
    {
      id: 6,
      username: "travel_wanderer",
      caption: "Exploring the ancient streets of this beautiful city. Every corner tells a story, every building holds memories. Travel opens your mind! ✈️🏛️ #travel #culture #history",
      image: "https://images.pexels.com/photos/2659475/pexels-photo-2659475.jpeg?auto=compress&cs=tinysrgb&w=800",
      createdAt: new Date(Date.now() - 28800000).toISOString(),
      likes: 178,
      comments: 25
    }
  ]
}

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600))

  return NextResponse.json(mockSocialPosts)
}