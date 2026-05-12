import { API_BASE } from "./constants";
import type { Meeting, Task } from "../types";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
	const res = await fetch(url, options);
	if (!res.ok) {
		throw new Error(`HTTP ${res.status}: ${res.statusText}`);
	}
	return res.json() as Promise<T>;
}

export const meetingApi = {
	list: () => fetchJson<Meeting[]>(`${API_BASE}/meetings`),
	get: (id: string) => fetchJson<Meeting>(`${API_BASE}/meetings/${id}`),
	create: (data: Omit<Meeting, "id">) =>
		fetchJson<Meeting>(`${API_BASE}/meetings`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		}),
	update: (id: string, data: Partial<Meeting>) =>
		fetchJson<Meeting>(`${API_BASE}/meetings/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		}),
	delete: (id: string) =>
		fetch(`${API_BASE}/meetings/${id}`, { method: "DELETE" }).then((r) => {
			if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
		}),
};

export const taskApi = {
	list: () => fetchJson<Task[]>(`${API_BASE}/tasks`),
	get: (id: string) => fetchJson<Task>(`${API_BASE}/tasks/${id}`),
	create: (data: Omit<Task, "id">) =>
		fetchJson<Task>(`${API_BASE}/tasks`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		}),
	update: (id: string, data: Partial<Task>) =>
		fetchJson<Task>(`${API_BASE}/tasks/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		}),
	delete: (id: string) =>
		fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" }).then((r) => {
			if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
		}),
};
