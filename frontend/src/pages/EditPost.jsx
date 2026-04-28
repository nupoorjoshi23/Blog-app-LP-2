import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function EditPost() {
  const { id } = useParams()
  const [form, setForm] = useState({ title: '', content: '', tags: '', coverImage: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { token, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`/api/posts/${id}`).then(res => {
      const p = res.data
      if (user?.id !== p.author?._id) { navigate('/'); return }
      setForm({
        title: p.title,
        content: p.content,
        tags: p.tags?.join(', ') || '',
        coverImage: p.coverImage || ''
      })
    }).catch(() => navigate('/'))
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
      await axios.put(`/api/posts/${id}`, { ...form, tags }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate(`/post/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="post-form-page">
      <h2>Edit Post</h2>
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
          <button type="button" onClick={() => navigate(`/post/${id}`)} className="btn btn-outline">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
