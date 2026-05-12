import { type RouteObject } from "react-router";
import DefaultLayout from "../layouts/DefaultLayout";
import HomePage from "../pages/Home";
import MeetingsPage from "../pages/Meetings";
import TasksPage from "../pages/Tasks";

const routes: RouteObject[] = [
	{
		path: "/",
		element: <DefaultLayout />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: "/meetings",
				element: <MeetingsPage />,
			},
			{
				path: "/tasks",
				element: <TasksPage />,
			},
		],
	},
];

export default routes;
