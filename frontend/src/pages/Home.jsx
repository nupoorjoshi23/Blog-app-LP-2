import { useState, useEffect } from 'react'
import axios from 'axios'
import PostCard from '../components/PostCard'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/posts')
      .then(res => setPosts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading posts...</div>

  return (
    <div className="home">
      <h1 className="page-title">Latest Posts</h1>
      {posts.length === 0 ? (
        <div className="empty">No posts yet. Be the first to write one!</div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => <PostCard key={post._id} post={post} />)}
        </div>
      )}
    </div>
  )
}
