import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function CreatePost() {
  const [form, setForm] = useState({ title: '', content: '', tags: '', coverImage: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { token, user } = useAuth()
  const navigate = useNavigate()

  if (!user) { navigate('/login'); return null }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
      const res = await axios.post('/api/posts', { ...form, tags }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate(`/post/${res.data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="post-form-page">
      <h2>Create New Post</h2>
      {error && <div className="error-msg">{error}</div>}
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            rows={12}
            required
          />
        </div>
        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            value={form.tags}
            onChange={e => setForm({ ...form, tags: e.target.value })}
            placeholder="javascript, react, web"
          />
        </div>
        <div className="form-group">
          <label>Cover Image URL (optional)</label>
          <input
            type="url"
            value={form.coverImage}
            onChange={e => setForm({ ...form, coverImage: e.target.value })}
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="btn btn-outline">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
