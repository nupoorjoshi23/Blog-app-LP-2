import { Link } from 'react-router-dom'

export default function PostCard({ post }) {
  const preview = post.content.slice(0, 150) + (post.content.length > 150 ? '...' : '')
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="post-card">
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="post-card-img" />
      )}
      <div className="post-card-body">
        <div className="post-meta">
          <span>{post.author?.username}</span>
          <span>{date}</span>
        </div>
        <h2 className="post-title">
          <Link to={`/post/${post._id}`}>{post.title}</Link>
        </h2>
        <p className="post-preview">{preview}</p>
        {post.tags?.length > 0 && (
          <div className="post-tags">
            {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
        )}
        <Link to={`/post/${post._id}`} className="read-more">Read more →</Link>
      </div>
    </div>
  )
}
