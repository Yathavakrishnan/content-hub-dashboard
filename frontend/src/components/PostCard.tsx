type Post = { id: number; title: string; description?: string; views?: number; likes?: number; user?: { name: string } }

export default function PostCard(
    { post, onView, onLike, onEdit, onDelete, isAdmin }: { post: Post; onView: () => void; onLike: () => void; onEdit: () => void; onDelete: () => void; isAdmin: boolean }) {
    return <article className="post-card">
        <div className="post-meta">
            <span>POST #{post.id}</span>
            <span>{post.user?.name || 'Community'}</span>
        </div>
        <h3>{post.title}</h3>
        <p>{post.description || 'No description provided.'}</p>
        <div className="post-footer">
            <span>{post.likes || 0} likes · {post.views || 0} views</span>
            <div className="post-actions">
                <button className="small-button" onClick={onView}>View</button>
                <button className="small-button" onClick={onLike}>Like post</button>{isAdmin && <>
                    <button className="small-button" onClick={onEdit}>Edit</button>
                    <button className="small-button danger-button" onClick={onDelete}>Delete</button></>}
            </div>
        </div>
    </article>
}
