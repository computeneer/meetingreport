import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
	const { i18n } = useTranslation();

	const toggleLanguage = () => {
		const next = i18n.language === "tr" ? "en" : "tr";
		i18n.changeLanguage(next);
	};

	return (
		<button
			onClick={toggleLanguage}
			className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
			aria-label="Toggle language"
		>
			{i18n.language === "tr" ? "EN" : "TR"}
		</button>
	);
}
