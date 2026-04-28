import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      axios.get(`/api/posts/${id}`),
      axios.get(`/api/comments/${id}`)
    ]).then(([postRes, commentsRes]) => {
      setPost(postRes.data)
      setComments(commentsRes.data)
    }).catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return
    await axios.delete(`/api/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    navigate('/')
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    const res = await axios.post(
      `/api/comments/${id}`,
      { content: newComment },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setComments([...comments, res.data])
    setNewComment('')
  }

  const handleDeleteComment = async (commentId) => {
    await axios.delete(`/api/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setComments(comments.filter(c => c._id !== commentId))
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!post) return null

  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
  const isAuthor = user?.id === post.author?._id

  return (
    <div className="post-detail">
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="post-cover" />
      )}
      <div className="post-header">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>By <strong>{post.author?.username}</strong></span>
          <span>{date}</span>
        </div>
        {post.tags?.length > 0 && (
          <div className="post-tags">
            {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
        )}
        {isAuthor && (
          <div className="post-actions">
            <Link to={`/edit/${post._id}`} className="btn btn-outline">Edit</Link>
            <button onClick={handleDelete} className="btn btn-danger">Delete</button>
          </div>
        )}
      </div>

      <div className="post-content">{post.content}</div>

      <div className="comments-section">
        <h3>Comments ({comments.length})</h3>
        {user ? (
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
            />
            <button type="submit" className="btn btn-primary">Post Comment</button>
          </form>
        ) : (
          <p className="auth-prompt">
            <Link to="/login">Login</Link> to comment
          </p>
        )}
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment._id} className="comment">
              <div className="comment-header">
                <strong>{comment.author?.username}</strong>
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <p>{comment.content}</p>
              {user?.id === comment.author?._id && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="btn-link danger"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
