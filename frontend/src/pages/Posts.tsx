import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import ConfirmModal from '../components/ConfirmModal'
import api from '../services/api'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

type Post =
    {
        id: number;
        title: string;
        description?: string;
        views?: number;
        likes?: number;
        user?: { name: string }
    }
export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [form, setForm] = useState({ title: '', content: '' });
    const [editing, setEditing] = useState<Post | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState('')
    const { user } = useAuth()
    function loadPosts() {
        api.get<Post[]>('/posts').then((response) => setPosts(response.data)).catch(() => setError('Could not load posts.'))
    }
    useEffect(() => { loadPosts() }, [])
    async function createPost(event: React.FormEvent) {
        event.preventDefault(); setError('');
        try {
            await api.post('/posts', form);
            setForm({ title: '', content: '' });
            loadPosts()
        }
        catch (requestError) {
            if (axios.isAxiosError(requestError)) { const message = requestError.response?.data?.message; setError(Array.isArray(message) ? message.join(', ') : message || `Request failed (${requestError.response?.status || 'network error'})`) } else { setError('Could not publish post.') }
        }
    }
    async function likePost(id: number) {
        try {
            await api.post(`/posts/${id}/like`);
            loadPosts()
        }
        catch {
            setError('Could not like this post.')
        }
    }
    async function viewPost(id: number) {
        try {
            await api.post(`/posts/${id}/view`)
            loadPosts()
        }
        catch {
            setError('Could not update post views.')
        }
    }
    async function updatePost(event: React.FormEvent) {
        event.preventDefault(); if (!editing) return; setError('')
        try { await api.put(`/posts/${editing.id}`, { title: editing.title, content: editing.description }); setEditing(null); loadPosts() }
        catch (requestError) { if (axios.isAxiosError(requestError)) setError(requestError.response?.data?.message || 'Could not update post.') }
    }
    async function deletePost(id: number) {
        setError('')
        try { await api.delete(`/posts/${id}`); loadPosts() }
        catch (requestError) { if (axios.isAxiosError(requestError)) setError(requestError.response?.data?.message || 'Could not delete post.') }
        finally { setDeletingId(null) }
    }
    return <>
        <Navbar />
        <main className="page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">CONTENT / POSTS</p>
                    <h1>Post stream</h1>
                    <p className="muted">Publish ideas and follow what the team is saying.</p>

                </div>
            </div>
            <section className="compose">
                <p className="eyebrow">NEW POST</p>
                <form className="compose-form" onSubmit={createPost}>
                    <input id='post-title-input' placeholder="Post title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                    <textarea placeholder="Write something worth sharing..." id='post-text-area' value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
                    <button className="primary-button" type="submit">Publish post</button>
                </form>
            </section>{editing && <form className="edit-form" onSubmit={updatePost}><p className="eyebrow">EDIT POST #{editing.id}</p><input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required /><textarea value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} required /><button className="primary-button" type="submit">Save changes</button><button className="ghost-button" type="button" onClick={() => setEditing(null)}>Cancel</button></form>}{error && <p className="form-error">{error}</p>}
            <div className="post-grid">
                {posts.map((post) => <PostCard key={post.id} post={post} onView={() => viewPost(post.id)} onLike={() => likePost(post.id)} onEdit={() => setEditing(post)} onDelete={() => setDeletingId(post.id)} isAdmin={user?.role === 'admin'} />)}
            </div>{!posts.length && <p className="empty-state">No posts yet. Publish the first one.</p>}
            {deletingId !== null && <ConfirmModal title="Delete this post?" message="This permanently removes the post and its likes." confirmLabel="Delete post" onConfirm={() => deletePost(deletingId)} onCancel={() => setDeletingId(null)} />}

        </main></>
}
