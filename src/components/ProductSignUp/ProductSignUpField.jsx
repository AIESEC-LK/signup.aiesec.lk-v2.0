import React from "react";

// eslint-disable-next-line react/prop-types
const ProductSignUpField = ({label, type = "text", register, name, autoComplete, options = [], error, hidden = false, children, ...rest}) =>
{
	if (hidden) return null;
	return (
		<label className="w-full">
			<span className="block font-bold text-m text-gray-700 mb-2">{label}</span>
			{type === "select" ? (
				<select
					{...register(name)}
					className="w-full px-4 py-2 border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
					{...rest}
				>
					{children || options.map((opt) => (
						<option key={opt.value || opt} value={opt.value || opt}>
							{opt.label || opt}
						</option>
					))}
				</select>
			) : (
				<input
					{...register(name)}
					type={type}
					autoComplete={autoComplete}
					className="focus:outline-none mt-1 px-4 py-2 w-full border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
					{...rest}
				/>
			)}
			<p className="text-red-500 my-1">{error || " "}</p>
		</label>
	);
};

export default ProductSignUpField;

