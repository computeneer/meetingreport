import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { meetingApi } from "../lib/api";
import { Modal } from "../components/Modal";
import { ConfirmModal } from "../components/ConfirmModal";
import type { Meeting } from "../types";

const emptyMeeting: Omit<Meeting, "id"> = {
	title: "",
	date: "",
	notes: [""],
};

export default function Meetings() {
	const { t } = useTranslation();
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
				console.error("Failed to load meetings:", err);
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
			console.error("Failed to load meetings:", err);
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
		setForm({ title: m.title, date: m.date, notes: [...m.notes] });
		setIsModalOpen(true);
	};

	const handleSave = async () => {
		try {
			const cleaned = { ...form, notes: form.notes.filter((n) => n.trim() !== "") };
			if (editing) {
				await meetingApi.update(editing.id, cleaned);
			} else {
				await meetingApi.create(cleaned);
			}
			setIsModalOpen(false);
			await fetchMeetings();
		} catch (err) {
			console.error("Save error:", err);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await meetingApi.delete(id);
			await fetchMeetings();
		} catch (err) {
			console.error("Delete error:", err);
		}
	};

	const addNote = () => {
		setForm((f) => ({ ...f, notes: [...f.notes, ""] }));
	};

	const updateNote = (index: number, value: string) => {
		setForm((f) => {
			const next = [...f.notes];
			next[index] = value;
			return { ...f, notes: next };
		});
	};

	const removeNote = (index: number) => {
		setForm((f) => {
			const next = f.notes.filter((_, i) => i !== index);
			return { ...f, notes: next.length ? next : [""] };
		});
	};

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-primary-dark">{t("meetings.title")}</h1>
				<button
					onClick={openAdd}
					className="rounded-lg bg-accent-orange px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-orange-600"
				>
					{t("meetings.newMeeting")}
				</button>
			</div>

			{loading ? (
				<p className="text-gray-500">{t("common.loading")}</p>
			) : meetings.length === 0 ? (
				<p className="text-gray-500">{t("meetings.noMeetings")}</p>
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
								{m.notes.length > 0 && (
									<ul className="mb-4 list-disc space-y-1 pl-4 text-sm text-gray-600">
										{m.notes.map((note, idx) => (
											<li key={idx}>{note}</li>
										))}
									</ul>
								)}
								<div className="flex gap-2">
									<button
										onClick={() => openEdit(m)}
										className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-dark"
									>
										{t("common.edit")}
									</button>
									<button
										onClick={() => setDeleteTarget(m)}
										className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600"
									>
										{t("common.delete")}
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
				title={editing ? t("meetings.editMeeting") : t("meetings.newMeetingModal")}
			>
				<div className="space-y-4">
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">
							{t("common.title")}
						</label>
						<input
							type="text"
							value={form.title}
							onChange={(e) =>
								setForm((f) => ({ ...f, title: e.target.value }))
							}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
							placeholder={t("meetings.placeholderTitle")}
						/>
					</div>
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">
							{t("common.date")}
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
						<div className="mb-1 flex items-center justify-between">
							<label className="block text-sm font-medium text-gray-700">
								{t("common.notes")}
							</label>
							<button
								onClick={addNote}
								type="button"
								className="rounded-md bg-accent-yellow px-2 py-1 text-xs font-medium text-primary-dark transition-colors hover:bg-yellow-400"
							>
								{t("common.addNote")}
							</button>
						</div>
						<div className="space-y-2">
							{form.notes.map((note, idx) => (
								<div key={idx} className="flex gap-2">
									<textarea
										value={note}
										onChange={(e) => updateNote(idx, e.target.value)}
										rows={2}
										className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
										placeholder={`${t("common.notes")} ${idx + 1}`}
									/>
									<button
										onClick={() => removeNote(idx)}
										type="button"
										className="self-start rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-200"
									>
										{t("common.remove")}
									</button>
								</div>
							))}
						</div>
					</div>
					<div className="flex justify-end gap-3 pt-2">
						<button
							onClick={() => setIsModalOpen(false)}
							className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
						>
							{t("common.cancel")}
						</button>
						<button
							onClick={handleSave}
							className="rounded-lg bg-accent-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
						>
							{t("common.save")}
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
				title={t("meetings.deleteTitle")}
				message={t("meetings.deleteConfirm", { title: deleteTarget?.title })}
				confirmText={t("common.delete")}
				cancelText={t("common.cancel")}
			/>
		</div>
	);
}
