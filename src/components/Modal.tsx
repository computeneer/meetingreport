import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		if (isOpen) {
			document.addEventListener("keydown", handler);
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.removeEventListener("keydown", handler);
			document.body.style.overflow = "";
		};
	}, [isOpen, onClose]);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center p-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<motion.div
						className="absolute inset-0 bg-black/50"
						onClick={onClose}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					/>
					<motion.div
						className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"
						initial={{ scale: 0.9, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.9, opacity: 0, y: 20 }}
						transition={{ type: "spring", duration: 0.4 }}
					>
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-xl font-bold text-primary-dark">{title}</h2>
							<button
								onClick={onClose}
								className="text-2xl leading-none text-gray-400 transition-colors hover:text-gray-600"
								aria-label="Kapat"
							>
								&times;
							</button>
						</div>
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
