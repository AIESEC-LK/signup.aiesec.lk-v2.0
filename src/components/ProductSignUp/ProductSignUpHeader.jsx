import React from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ProductSignUpHeader = ({ product, ProductLogo, aiesecLogo, backIcon, getProductColor }) => {
	const navigate = useNavigate();
	return (
		<>
			<div
				onClick={() => navigate("/")}
				className="fixed top-12 left-2 z-10 sm:left-6 md:left-9 cursor-pointer hidden md:block">
				<img src={backIcon} alt="Back" className="h-5 sm:h-8" />
			</div>
			<div
				className={`absolute top-0 left-0 w-full ${getProductColor()} h-60`}
				style={{ zIndex: 1 }}></div>
			<div className="flex justify-between p-3">
				<img src={ProductLogo} className="h-6 sm:h-7 mt-3 md:mt-0 md:h-11 flex" alt="Product Logo" />
				<img src={aiesecLogo} className="h-6 sm:h-7 mt-3 md:mt-0 md:h-9 flex" alt="AIESEC Logo" />
			</div>
			<div className="text-xl sm:text-2xl font-bold sm:mb-5 mt-8 mb-8 sm:mt-5 text-gray-800 text-center">
				{product === "GV" && <span className="text-[#F85A40]">Volunteer </span>}
				{product === "GTe" && <span className="text-[#F48924]">Teach </span>}
				{product === "GTa" && <span className="text-[#0CB9C1]">Intern </span>}
				Abroad. Inspire the Future!
			</div>
		</>
	);
};

export default ProductSignUpHeader;

