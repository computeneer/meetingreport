import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { meetingApi, taskApi } from "../lib/api";
import type { Meeting, Task } from "../types";

export default function Home() {
	const { t } = useTranslation();
	const [meetings, setMeetings] = useState<Meeting[]>([]);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const [m, t] = await Promise.all([meetingApi.list(), taskApi.list()]);
				setMeetings(m);
				setTasks(t);
			} catch (err) {
				console.error("Failed to load data:", err);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const getTasksForMeeting = (meetingId: string) =>
		tasks.filter((t) => t.meetingId === meetingId);

	return (
		<div>
			<h1 className="mb-6 text-2xl font-bold text-primary-dark">
				{t("home.title")}
			</h1>

			{loading ? (
				<p className="text-gray-500">{t("common.loading")}</p>
			) : meetings.length === 0 ? (
				<p className="text-gray-500">
					{t("home.noData")}
				</p>
			) : (
				<div className="space-y-6">
					{meetings.map((meeting) => {
						const meetingTasks = getTasksForMeeting(meeting.id);
						return (
							<motion.div
								key={meeting.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
							>
								<div className="mb-3 flex items-center justify-between">
									<h2 className="text-lg font-semibold text-primary">
										{meeting.title}
									</h2>
									<span className="rounded-full bg-accent-yellow/20 px-2.5 py-0.5 text-xs font-medium text-primary-dark">
										{meeting.date}
									</span>
								</div>
								{meeting.notes.length > 0 && (
									<ul className="mb-3 list-disc space-y-1 pl-4 text-sm text-gray-600">
										{meeting.notes.map((note, idx) => (
											<li key={idx}>{note}</li>
										))}
									</ul>
								)}
								{meetingTasks.length > 0 ? (
									<ul className="space-y-2">
										{meetingTasks.map((task) => (
											<li
												key={task.id}
												className={`flex items-center gap-2 text-sm ${
													task.completed
														? "text-gray-400 line-through"
														: "text-primary-dark"
												}`}
											>
												<span className="inline-block h-2 w-2 rounded-full bg-accent-orange" />
												<span className="font-medium">
													{task.assignee}:
												</span>
												{task.description}
											</li>
										))}
									</ul>
								) : (
									<p className="text-sm text-gray-400">
										{t("home.noTasks")}
									</p>
								)}
							</motion.div>
						);
					})}
				</div>
			)}
		</div>
	);
}
