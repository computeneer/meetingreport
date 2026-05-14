import { Modal } from "./Modal";

interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
}

export function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title = "Confirm",
	message,
	confirmText = "Delete",
	cancelText = "Cancel",
}: ConfirmModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title}>
			<p className="mb-6 text-gray-700">{message}</p>
			<div className="flex justify-end gap-3">
				<button
					onClick={onClose}
					className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
				>
					{cancelText}
				</button>
				<button
					onClick={() => {
						onConfirm();
						onClose();
					}}
					className="rounded-lg bg-accent-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
				>
					{confirmText}
				</button>
			</div>
		</Modal>
	);
}
