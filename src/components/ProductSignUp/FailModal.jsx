import React, { useEffect } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";

// eslint-disable-next-line react/prop-types
const FailModal = ({ onClose, messageTitle, messageContent }) => {
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "auto";
		};
	}, []);

	return (
		<div className="fixed inset-0 z-50 bg-opacity-90 bg-gray-950 flex items-center justify-center">
			<div className="bg-white p-8 rounded-lg shadow-lg max-w-sm text-center">
				<center>
					<ExclamationTriangleIcon className="size-20 text-red-500 mb-4" />
				</center>
				<h1 className="text-3xl text-red-500 font-semibold mb-4">Error!</h1>
				<h2 className="text-2xl text-black font-semibold mb-4">{messageTitle}</h2>
				<p className="text-black mb-6">{messageContent}</p>
				<button
					onClick={onClose}
					className="bg-red-500 shadow-2xl text-white font-semibold py-2 px-8 rounded hover:bg-gray-100 transition duration-300">
					Try Again
				</button>
			</div>
		</div>
	);
};

export default FailModal;

