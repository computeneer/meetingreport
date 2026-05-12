import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { meetingApi } from "../lib/api";
import { Modal } from "../components/Modal";
import { ConfirmModal } from "../components/ConfirmModal";
import type { Meeting } from "../types";

const emptyMeeting: Omit<Meeting, "id"> = {
	title: "",
	date: "",
	notes: "",
};

export default function Meetings() {
	const [meetings, setMeetings] = useState<Meeting[]>([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editing, setEditing] = useState<Meeting | null>(null);
	const [form, setForm] = useState(emptyMeeting);
	const [deleteTarget, setDeleteTarget] = useState<Meeting | null>(null);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			setLoading(true);
			try {
				const data = await meetingApi.list();
				if (!cancelled) setMeetings(data);
			} catch (err) {
				console.error("Toplantılar yüklenemedi:", err);
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const fetchMeetings = async () => {
		setLoading(true);
		try {
			const data = await meetingApi.list();
			setMeetings(data);
		} catch (err) {
			console.error("Toplantılar yüklenemedi:", err);
		} finally {
			setLoading(false);
		}
	};

	const openAdd = () => {
		setEditing(null);
		setForm(emptyMeeting);
		setIsModalOpen(true);
	};

	const openEdit = (m: Meeting) => {
		setEditing(m);
		setForm({ title: m.title, date: m.date, notes: m.notes });
		setIsModalOpen(true);
	};

	const handleSave = async () => {
		try {
			if (editing) {
				await meetingApi.update(editing.id, form);
			} else {
				await meetingApi.create(form);
			}
			setIsModalOpen(false);
			await fetchMeetings();
		} catch (err) {
			console.error("Kaydetme hatası:", err);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await meetingApi.delete(id);
			await fetchMeetings();
		} catch (err) {
			console.error("Silme hatası:", err);
		}
	};

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-primary-dark">Toplantılar</h1>
				<button
					onClick={openAdd}
					className="rounded-lg bg-accent-orange px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-orange-600"
				>
					+ Yeni Toplantı
				</button>
			</div>

			{loading ? (
				<p className="text-gray-500">Yükleniyor...</p>
			) : meetings.length === 0 ? (
				<p className="text-gray-500">Henüz toplantı eklenmemiş.</p>
			) : (
				<div className="grid gap-4 md:grid-cols-2">
					<AnimatePresence>
						{meetings.map((m) => (
							<motion.div
								key={m.id}
								layout
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95 }}
								className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
							>
								<div className="mb-2 flex items-start justify-between">
									<h3 className="text-lg font-semibold text-primary">
										{m.title}
									</h3>
									<span className="rounded-full bg-accent-yellow/20 px-2.5 py-0.5 text-xs font-medium text-primary-dark">
										{m.date}
									</span>
								</div>
								<p className="mb-4 text-sm text-gray-600">{m.notes}</p>
								<div className="flex gap-2">
									<button
										onClick={() => openEdit(m)}
										className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-dark"
									>
										Düzenle
									</button>
									<button
										onClick={() => setDeleteTarget(m)}
										className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600"
									>
										Sil
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
				title={editing ? "Toplantıyı Düzenle" : "Yeni Toplantı"}
			>
				<div className="space-y-4">
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Başlık
						</label>
						<input
							type="text"
							value={form.title}
							onChange={(e) =>
								setForm((f) => ({ ...f, title: e.target.value }))
							}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
							placeholder="Toplantı başlığı"
						/>
					</div>
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Tarih
						</label>
						<input
							type="date"
							value={form.date}
							onChange={(e) =>
								setForm((f) => ({ ...f, date: e.target.value }))
							}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Notlar
						</label>
						<textarea
							value={form.notes}
							onChange={(e) =>
								setForm((f) => ({ ...f, notes: e.target.value }))
							}
							rows={3}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
							placeholder="Toplantı notları..."
						/>
					</div>
					<div className="flex justify-end gap-3 pt-2">
						<button
							onClick={() => setIsModalOpen(false)}
							className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
						>
							İptal
						</button>
						<button
							onClick={handleSave}
							className="rounded-lg bg-accent-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
						>
							Kaydet
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
				title="Toplantıyı Sil"
				message={`"${deleteTarget?.title}" toplantısını silmek istediğinize emin misiniz?`}
				confirmText="Sil"
				cancelText="İptal"
			/>
		</div>
	);
}
