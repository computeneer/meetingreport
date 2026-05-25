import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { taskApi, meetingApi, userApi } from "../lib/api";
import { Modal } from "../components/Modal";
import { ConfirmModal } from "../components/ConfirmModal";
import type { Task, Meeting, User } from "../types";

const emptyTask: Omit<Task, "id"> = {
	meetingId: "",
	assignee: "",
	description: "",
	completed: false,
};

export default function Tasks() {
	const { t } = useTranslation();
	const [tasks, setTasks] = useState<Task[]>([]);
	const [meetings, setMeetings] = useState<Meeting[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editing, setEditing] = useState<Task | null>(null);
	const [form, setForm] = useState(emptyTask);
	const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			setLoading(true);
			try {
				const [t, m, u] = await Promise.all([
					taskApi.list(),
					meetingApi.list(),
					userApi.list(),
				]);
				if (!cancelled) {
					setTasks(t);
					setMeetings(m);
					setUsers(u);
				}
			} catch (err) {
				console.error("Failed to load data:", err);
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const fetchData = async () => {
		setLoading(true);
		try {
			const [t, m, u] = await Promise.all([
				taskApi.list(),
				meetingApi.list(),
				userApi.list(),
			]);
			setTasks(t);
			setMeetings(m);
			setUsers(u);
		} catch (err) {
			console.error("Failed to load data:", err);
		} finally {
			setLoading(false);
		}
	};

	const openAdd = () => {
		setEditing(null);
		setForm({
			...emptyTask,
			meetingId: meetings[0]?.id ?? "",
			assignee: users[0]?.name ?? "",
		});
		setIsModalOpen(true);
	};

	const openEdit = (task: Task) => {
		setEditing(task);
		setForm({
			meetingId: task.meetingId,
			assignee: task.assignee,
			description: task.description,
			completed: task.completed,
		});
		setIsModalOpen(true);
	};

	const handleSave = async () => {
		try {
			if (editing) {
				await taskApi.update(editing.id, form);
			} else {
				await taskApi.create(form);
			}
			setIsModalOpen(false);
			await fetchData();
		} catch (err) {
			console.error("Save error:", err);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await taskApi.delete(id);
			await fetchData();
		} catch (err) {
			console.error("Delete error:", err);
		}
	};

	const getMeetingTitle = (id: string) =>
		meetings.find((m) => m.id === id)?.title ?? t("tasks.unknownMeeting");

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-primary-dark">{t("tasks.title")}</h1>
				<button
					onClick={openAdd}
					className="rounded-lg bg-accent-orange px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-orange-600"
				>
					{t("tasks.newTask")}
				</button>
			</div>

			{loading ? (
				<p className="text-gray-500">{t("common.loading")}</p>
			) : tasks.length === 0 ? (
				<p className="text-gray-500">{t("tasks.noTasks")}</p>
			) : (
				<div className="space-y-3">
					<AnimatePresence>
						{tasks.map((task) => (
							<motion.div
								key={task.id}
								layout
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95 }}
								className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
							>
								<div className="flex items-center gap-3">
									<input
										type="checkbox"
										checked={task.completed}
										onChange={async () => {
											try {
												await taskApi.update(task.id, {
													completed: !task.completed,
												});
												await fetchData();
											} catch (err) {
												console.error(err);
											}
										}}
										className="h-5 w-5 cursor-pointer accent-accent-orange"
									/>
									<div>
										<p
											className={`text-sm font-medium ${
												task.completed
													? "text-gray-400 line-through"
													: "text-primary-dark"
											}`}
										>
											{task.assignee}: {task.description}
										</p>
										<p className="text-xs text-gray-500">
											{getMeetingTitle(task.meetingId)}
										</p>
									</div>
								</div>
								<div className="flex gap-2">
									<button
										onClick={() => openEdit(task)}
										className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-dark"
									>
										{t("common.edit")}
									</button>
									<button
										onClick={() => setDeleteTarget(task)}
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
				title={editing ? t("tasks.editTask") : t("tasks.newTaskModal")}
			>
				<div className="space-y-4">
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">
							{t("common.meeting")}
						</label>
						<select
							value={form.meetingId}
							onChange={(e) =>
								setForm((f) => ({ ...f, meetingId: e.target.value }))
							}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						>
							{meetings.map((m) => (
								<option key={m.id} value={m.id}>
									{m.title} ({m.date})
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">
							{t("common.assignee")}
						</label>
						<select
							value={form.assignee}
							onChange={(e) =>
								setForm((f) => ({ ...f, assignee: e.target.value }))
							}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						>
							{users.map((u) => (
								<option key={u.id} value={u.name}>
									{u.name}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">
							{t("common.description")}
						</label>
						<input
							type="text"
							value={form.description}
							onChange={(e) =>
								setForm((f) => ({ ...f, description: e.target.value }))
							}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
							placeholder={t("tasks.placeholderDescription")}
						/>
					</div>
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={form.completed}
							onChange={(e) =>
								setForm((f) => ({ ...f, completed: e.target.checked }))
							}
							className="h-4 w-4 accent-accent-orange"
							id="task-completed"
						/>
						<label
							htmlFor="task-completed"
							className="text-sm text-gray-700"
						>
							{t("common.completed")}
						</label>
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
				title={t("tasks.deleteTitle")}
				message={t("tasks.deleteConfirm")}
				confirmText={t("common.delete")}
				cancelText={t("common.cancel")}
			/>
		</div>
	);
}
