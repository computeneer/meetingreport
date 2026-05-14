import { NavLink, Outlet } from "react-router";

export default function DefaultLayout() {
	const linkClass = ({ isActive }: { isActive: boolean }) =>
		`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
			isActive
				? "bg-accent-yellow text-primary-dark"
				: "text-white/80 hover:bg-white/10 hover:text-white"
		}`;

	return (
		<div className="flex min-h-screen flex-col bg-gray-50">
			<header className="bg-primary-dark shadow-lg">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
					<h1 className="text-xl font-bold text-accent-yellow">
						Toplantı Raporları
					</h1>
					<nav className="flex gap-2">
						<NavLink to="/" end className={linkClass}>
							Ana Sayfa
						</NavLink>
						<NavLink to="/meetings" className={linkClass}>
							Toplantılar
						</NavLink>
					<NavLink to="/tasks" className={linkClass}>
						Görevler
					</NavLink>
					<NavLink to="/users" className={linkClass}>
						Kullanıcılar
					</NavLink>
				</nav>
				</div>
			</header>
			<main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
				<Outlet />
			</main>
		</div>
	);
}
