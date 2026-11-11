import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import ConfirmModal from '../components/ConfirmModal'

type User = { id: number; name: string; email: string; role?: { name: string } }
export default function Users() {
    const [users, setUsers] = useState<User[]>([]); 
    const [search, setSearch] = useState(''); 
    const [role, setRole] = useState(''); 
    const [editing, setEditing] = useState<User | null>(null); 
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState('')
    function loadUsers() {
        api.get<User[]>('/users', { params: { ...(search && { search }), ...(role && { role }) } }).then((response) => setUsers(response.data)).catch(() => setError('Could not load users.'))
    }
    useEffect(() => { 
        const timer = setTimeout(loadUsers, 250); return () => clearTimeout(timer) }, [search, role])
    async function saveUser(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!editing) return;
        try {
            await api.put(`/users/${editing.id}`,
                { name: editing.name, email: editing.email, role: editing.role?.name || 'user' });
            setEditing(null);
            loadUsers()
        }
        catch {
            setError('Could not update user.')
        }
    }
    async function deleteUser(id: number) {
        try {
            await api.delete(`/users/${id}`); loadUsers()
        }
        catch {
            setError('Could not delete user. Remove related posts or likes first.')
        }
        finally { setDeletingId(null) }
    } 
    return <>
        <Navbar />
        <main className="page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">DIRECTORY / USERS</p>
                    <h1>People</h1>
                    <p className="muted">Admin access: search, edit, and remove users.</p>
                </div>
                <div className="filters">
                    <input className="search-input" placeholder="Search name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="">All roles</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>{error && <p className="form-error">{error}</p>}{editing && <form className="edit-form" onSubmit={saveUser}><p className="eyebrow">EDIT USER #{editing.id}</p><input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required /><input type="email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} required /><select value={editing.role?.name || 'user'} onChange={(e) => setEditing({ ...editing, role: { name: e.target.value } })}><option value="user">User</option><option value="admin">Admin</option></select><button className="primary-button" type="submit">Save changes</button><button className="ghost-button" type="button" onClick={() => setEditing(null)}>Cancel</button></form>}<div className="table-wrap"><table><thead><tr><th>Person</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><strong>{user.name}</strong></td><td>{user.email}</td><td><span className="role-chip">{user.role?.name || 'user'}</span></td><td><button className="small-button" onClick={() => setEditing(user)}>Edit</button> <button className="small-button danger-button" onClick={() => setDeletingId(user.id)}>Delete</button></td></tr>)}</tbody></table>{!users.length && !error && <p className="empty-state">No users found.</p>}</div>{deletingId !== null && <ConfirmModal title="Delete this user?" message="This removes the user and their posts and likes permanently." confirmLabel="Delete user" onConfirm={() => deleteUser(deletingId)} onCancel={() => setDeletingId(null)} />}</main></>
}
