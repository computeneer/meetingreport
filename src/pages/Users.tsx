import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { userApi } from "../lib/api";
import { Modal } from "../components/Modal";
import { ConfirmModal } from "../components/ConfirmModal";
import type { User } from "../types";

const emptyUser: Omit<User, "id"> = {
	name: "",
};

export default function Users() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editing, setEditing] = useState<User | null>(null);
	const [form, setForm] = useState(emptyUser);
	const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			setLoading(true);
			try {
				const data = await userApi.list();
				if (!cancelled) setUsers(data);
			} catch (err) {
				console.error("Failed to load users:", err);
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const data = await userApi.list();
			setUsers(data);
		} catch (err) {
			console.error("Failed to load users:", err);
		} finally {
			setLoading(false);
		}
	};

	const openAdd = () => {
		setEditing(null);
		setForm(emptyUser);
		setIsModalOpen(true);
	};

	const openEdit = (u: User) => {
		setEditing(u);
		setForm({ name: u.name });
		setIsModalOpen(true);
	};

	const handleSave = async () => {
		try {
			if (editing) {
				await userApi.update(editing.id, form);
			} else {
				await userApi.create(form);
			}
			setIsModalOpen(false);
			await fetchUsers();
		} catch (err) {
			console.error("Save error:", err);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await userApi.delete(id);
			await fetchUsers();
		} catch (err) {
			console.error("Delete error:", err);
		}
	};

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-primary-dark">Users</h1>
				<button
					onClick={openAdd}
					className="rounded-lg bg-accent-orange px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-orange-600"
				>
					+ New User
				</button>
			</div>

			{loading ? (
				<p className="text-gray-500">Loading...</p>
			) : users.length === 0 ? (
				<p className="text-gray-500">No users added yet.</p>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<AnimatePresence>
						{users.map((u) => (
							<motion.div
								key={u.id}
								layout
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95 }}
								className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
							>
								<span className="text-sm font-medium text-primary-dark">
									{u.name}
								</span>
								<div className="flex gap-2">
									<button
										onClick={() => openEdit(u)}
										className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-dark"
									>
										Edit
									</button>
									<button
										onClick={() => setDeleteTarget(u)}
										className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600"
									>
										Delete
									</button>
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			)}

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={editing ? "Edit User" : "New User"}
			>
				<div className="space-y-4">
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Name
						</label>
						<input
							type="text"
							value={form.name}
							onChange={(e) =>
								setForm((f) => ({ ...f, name: e.target.value }))
							}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
							placeholder="User name"
						/>
					</div>
					<div className="flex justify-end gap-3 pt-2">
						<button
							onClick={() => setIsModalOpen(false)}
							className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
						>
							Cancel
						</button>
						<button
							onClick={handleSave}
							className="rounded-lg bg-accent-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
						>
							Save
						</button>
					</div>
				</div>
			</Modal>

			<ConfirmModal
				isOpen={!!deleteTarget}
				onClose={() => setDeleteTarget(null)}
				onConfirm={() => {
					if (deleteTarget) handleDelete(deleteTarget.id);
				}}
				title="Delete User"
				message={`Are you sure you want to delete the user "${deleteTarget?.name}"?`}
				confirmText="Delete"
				cancelText="Cancel"
			/>
		</div>
	);
}
