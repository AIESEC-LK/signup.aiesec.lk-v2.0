import React, { useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/16/solid";

// eslint-disable-next-line react/prop-types
const SuccessModal = ({ onClose }) => {
	useEffect(() => {
		document.body.style.overflow = "hidden";
		window.fbq && window.fbq("track", "Lead");
		return () => {
			document.body.style.overflow = "auto";
		};
	}, []);

	return (
		<div className="fixed inset-0 z-50 bg-opacity-90 bg-gray-950 flex items-center justify-center">
			<div className="bg-white p-8 rounded-lg shadow-lg max-w-sm text-center">
				<center>
					<CheckCircleIcon className="size-20 text-green-500 mb-4" />
				</center>
				<h1 className="text-3xl text-green-500 font-semibold mb-4">Success!</h1>
				<h2 className="text-2xl text-black font-semibold mb-4">Thank you for signing.</h2>
				<p className="text-black mb-6">One of our team members will contact you soon.</p>
				<button
					onClick={onClose}
					className="bg-green-500 shadow-2xl text-white font-semibold py-2 px-8 rounded hover:bg-gray-100 transition duration-300">
					Close
				</button>
			</div>
		</div>
	);
};

export default SuccessModal;

