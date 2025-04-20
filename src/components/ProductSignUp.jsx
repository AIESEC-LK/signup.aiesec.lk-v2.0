import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { TiTick } from "react-icons/ti";
import axios from "axios";
import GVLogo from "../assets/GV.png";
import GTeLogo from "../assets/GTe.png";
import GT from "../assets/GT.png";
import bg from "../assets/bg.png";
import { yupResolver } from "@hookform/resolvers/yup";
import aiesec from "../assets/pbaiesec.png";
import back from "../assets/back.svg";
import alignment from "../assets/alignment.json";
import { useLocation } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Moved schema outside component to prevent recreation on each render
const schema = yup
	.object({
		firstName: yup.string().required("First name is required"),
		lastName: yup.string().required("Last name is required"),
		email: yup.string().email("Must be an email").required("Email is required"),
		password: yup
			.string()
			.required("Password is required")
			.min(8, "Password must contain at least 8 characters ")
			.matches(/^(?=.*[a-z])/, "Must contain at least one lowercase character")
			.matches(/^(?=.*[A-Z])/, "Password must contain at least one uppercase character")
			.matches(/^(?=.*[0-9])/, "Password must contain at least one number"),
		contactNumber: yup
			.string()
			.required("Phone number is required")
			.min(9, "Phone number must contain at least 9 digits")
			.max(10, "Phone number must contain at most 10 digits")
			.matches(/^[0-9]*$/, "Phone number must contain only digits")
			.transform((value, originalValue) => {
				if (originalValue.startsWith("0")) {
					return originalValue.slice(1);
				}
				return originalValue;
			}),
		howFoundUs: yup.string().required("Referral is required"),
		permission: yup.boolean().oneOf([true], "You must accept the terms and conditions"),
		alignmentId: yup.string().required("Your educational institution is required"),
	})
	.required("Data is required");

// Extracted modals to separate components
const SuccessModal = ({ onClose }) => {
	useEffect(() => {
		document.body.style.overflow = "hidden";
		window.fbq("track", "Lead");
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

const ProductSignUp = (props) => {
	const navigate = useNavigate();
	const location = useLocation(); // Added missing location initialization
	const queryParams = new URLSearchParams(location.search);
	const [submitState, setSubmitState] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showFailedModal, setShowFailedModal] = useState(false);
	const [messageTitle, setMessageTitle] = useState("");
	const [messageContent, setMessageContent] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);

	// Using useMemo to prevent unnecessary recalculations
	const passedAlignmentId = useMemo(() =>
			alignment.find((item) => item.alignment === queryParams?.get("ley"))?.["data-id"] || undefined,
		[queryParams]);

	const passedMedium = useMemo(() =>
			queryParams?.get("utm_medium") || undefined,
		[queryParams]);

	const ProductLogo = useMemo(() =>
			props.product === "GV" ? GVLogo : props.product === "GTe" ? GTeLogo : props.product === "GTa" ? GT : null,
		[props.product]);

	// Optimized form setup with defaultValues
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			alignmentId: passedAlignmentId,
			howFoundUs: passedMedium,
		},
		mode: "onBlur", // Changed from onChange to onBlur for better performance
		resolver: yupResolver(schema),
	});

	// Extracted form submission logic to a separate function
	const onSubmit = async (data) => {
		setSubmitState(true);

		const selectedProgramme =
			props.product === "GV" ? 7 : props.product === "GTe" ? 9 : props.product === "GTa" ? 8 : 7;

		const extractedParams = {};
		for (const [key, value] of queryParams?.entries()) {
			extractedParams[key] = value;
		}

		// Form data for tracker
		let formD = {
			product: props.product || "GV",
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			contactNumber: data.contactNumber,
			university: alignment.find((item) => item["data-id"] == data.alignmentId)?.lc || "other",
			leadAlignment: data.alignmentId,
			howFoundUs: data.howFoundUs,
		};

		let combinedData = { ...extractedParams, ...formD };

		// Function to send data to Google Sheet
		const sendDataToSheet = async () => {
			const url =
				"https://script.google.com/macros/s/AKfycbyguZPcMmLAteUr5pkW-qXtJQhoE6UXlbp-0h3v2F0t6Wn1zaCha591MaggEeWblECQww/exec";
			combinedData.url = window.location.href;

			try {
				const response = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: new URLSearchParams(combinedData),
				});
				if (response.ok) {
					console.log("Data sent to sheet");
				} else {
					console.log("Error sending data to sheet:", JSON.stringify(response));
				}
			} catch (error) {
				console.error("Error sending data:", error);
			}
		};

		// Data payload for EXPA API
		const payload = {
			user: {
				first_name: data.firstName,
				last_name: data.lastName,
				email: data.email,
				country_code: "+94",
				phone: data.contactNumber,
				contact_number: data.contactNumber,
				password: data.password,
				alignment_id: data.alignmentId,
				lc: alignment.find((item) => item["data-id"] == data.alignmentId)?.value || 1821,
				referral_type: data.howFoundUs || "Other",
				allow_phone_communication: data.permission,
				allow_email_communication: data.permission,
				selected_programmes: [selectedProgramme],
			},
		};

		try {
			const res = await axios.post(
				"https://auth.aiesec.org/users.json",
				payload,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (Object.keys(combinedData).length !== 0) {
				await sendDataToSheet();
			}
			setSubmitState(false);
			setShowSuccessModal(true);
		} catch (error) {
			console.log("Error during form submission:", error);
			setSubmitState(false);

			if (error.response?.data?.errors?.email?.[0] === "has already been taken") {
				setMessageTitle("Already registered.");
				setMessageContent(
					"The email address has already been taken. Please try again with a different email address."
				);
			} else {
				setMessageTitle("Network error.");
				setMessageContent("An error occurred while submitting the form. Please try again.");
			}
			setShowFailedModal(true);
		}
	};

	const togglePasswordVisibility = (event) => {
		event.preventDefault();
		setPasswordVisible(!passwordVisible);
	};

	const onError = (errors) => {
		console.log("Form validation errors:", errors);
	};

	// Get background color based on product
	const getProductColor = () => {
		if (props.product === "GTa") return "bg-cyan-500";
		if (props.product === "GV") return "bg-red-500";
		if (props.product === "GTe") return "bg-amber-500";
		return "";
	};

	// Get hover color based on product
	const getHoverColor = () => {
		if (props.product === "GTa") return "hover:bg-cyan-800";
		if (props.product === "GV") return "hover:bg-red-800";
		if (props.product === "GTe") return "hover:bg-amber-800";
		return "";
	};

	return (
		<div
			className="-z-50 w-full bg-cover bg-center bg-no-repeat"
			style={{
				backgroundImage: `url(${bg})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				minHeight: "100vh",
			}}>
			<div
				onClick={() => navigate("/")}
				className="fixed top-12 left-2 z-10 sm:left-6 md:left-9 cursor-pointer hidden md:block">
				<img src={back} alt="" className="h-5 sm:h-8" />
			</div>
			<div
				className={`absolute top-0 left-0 w-full ${getProductColor()} h-60`}
				style={{ zIndex: 1 }}></div>

			<div className="flex w-full justify-center items-center md:mt-20">
				<form
					onSubmit={handleSubmit(onSubmit, onError)}
					className="bg-[#F9F9F9] z-10 md:p-8 p-4 pt-4 rounded-2xl w-full max-w-[90%] md:max-w-[80%] mb-6">
					<div className="flex justify-between p-3">
						<img src={ProductLogo} className="h-6 sm:h-7 mt-3 md:mt-0 md:h-11 flex" alt="" />
						<img src={aiesec} className="h-6 sm:h-7 mt-3 md:mt-0 md:h-9 flex" alt="" />
					</div>

					<div>
						<div className="text-xl sm:text-2xl font-bold sm:mb-5 mt-8 mb-8 sm:mt-5 text-gray-800 text-center">
							{props.product === "GV" && <span className="text-[#F85A40]">Volunteer </span>}
							{props.product === "GTe" && <span className="text-[#F48924]">Teach </span>}
							{props.product === "GTa" && <span className="text-[#0CB9C1]">Intern </span>}
							Abroad. Inspire the Future!
						</div>
					</div>

					<div className="grid md:grid-cols-2 grid-cols-1 justify-between w-full gap-y-2 gap-x-8">
						<label>
							<span className="block font-bold text-m text-gray-700 mb-2">First Name:*</span>
							<input
								{...register("firstName")}
								type="text"
								className="focus:outline-none mt-1 px-4 py-2 w-full border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
							/>
							<p className="text-red-500 my-1">{errors.firstName?.message || " "} </p>
						</label>

						<label>
							<span className="block font-bold text-m text-gray-700 mb-2">Last Name:*</span>
							<input
								{...register("lastName")}
								type="text"
								className="focus:outline-none mt-1 px-4 py-2 w-full border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
							/>
							<p className="text-red-500 my-1">{errors.lastName?.message || " "} </p>
						</label>

						<label>
							<span className="block font-bold text-m text-gray-700 mb-2">Email:*</span>
							<input
								{...register("email")}
								type="email"
								autoComplete="email"
								className="focus:outline-none mt-1 px-4 py-2 w-full border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
							/>
							<p className="text-red-500 my-1">{errors.email?.message || " "} </p>
						</label>

						<label>
							<span className="block font-bold text-m text-gray-700 mb-2">Phone Number:*</span>
							<input
								{...register("contactNumber")}
								type="text"
								autoComplete="tel-national"
								className="focus:outline-none mt-1 px-4 py-2 w-full border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
							/>
							<p className="text-red-500 my-1">{errors.contactNumber?.message || " "} </p>
						</label>

						<label hidden={passedAlignmentId !== undefined}>
							<span className="block font-bold text-m text-gray-700 mb-2">University / Institute:*</span>
							<select
								{...register("alignmentId")}
								style={{ height: "42px" }}
								className="w-full px-4 py-2 border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500">
								<option value="">Select University</option>
								{alignment.map((item) => (
									<option key={`${item["data-id"]}`} value={item["data-id"]}>
										{item.name}
									</option>
								))}
							</select>
							<p className="text-red-500 my-1">{errors.alignmentId?.message || " "} </p>
						</label>

						<label hidden={passedMedium !== undefined}>
							<span className="block font-bold text-m text-gray-700 mb-2">How did you find us:*</span>
							<select
								{...register("howFoundUs")}
								style={{ height: "42px" }}
								className="w-full px-4 py-2 border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500">
								<option value="">Select option</option>
								<option value="Blog">Blog</option>
								<option value="Classroom">Classroom</option>
								<option value="Email">Email</option>
								<option value="Event">Event</option>
								<option value="Facebook">Facebook</option>
								<option value="Friend">Friend</option>
								<option value="Instagram">Instagram</option>
								<option value="Linkedin">Linkedin</option>
								<option value="Offline_Media">Offline Media</option>
								<option value="Stall">Stall</option>
								<option value="TikTok">TikTok</option>
								<option value="WhatsApp">WhatsApp</option>
								<option value="Website">Website</option>
								<option value="Other">Other</option>
							</select>
							<p className="text-red-500 my-1">{errors.howFoundUs?.message || " "} </p>
						</label>
					</div>

					<div className="grid md:grid-cols-2 grid-cols-1 justify-between w-full gap-y-2 gap-x-8 mt-2">
						<label className="md:row-span-6">
							<span className="block font-bold text-m text-gray-700">Password:*</span>
							<div className="relative">
								<input
									{...register("password")}
									type={passwordVisible ? "text" : "password"}
									className="mt-1 px-4 py-2 w-full border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
								/>
								<button
									type="button"
									onClick={togglePasswordVisibility}
									className="absolute mt-1 right-2 transform text-gray-500 h-[42px]">
									{passwordVisible ? "Hide" : "Show"}
								</button>
							</div>
							<p className="text-red-500 my-1">{errors.password?.message || " "} </p>
						</label>

						<div></div>

						<div className="col-start-1">
							<div className="flex items-center">
								<input
									type="checkbox"
									{...register("permission")}
									className="focus:outline-none mr-2 h-4 text-indigo-600 rounded focus:ring-indigo-500"
								/>
								<span className="text-gray-700">
                  I give permission to be contacted by phone/email.
                </span>
							</div>
							<p className="text-red-500 my-1">{errors.permission?.message || " "} </p>
						</div>
					</div>

					<button
						disabled={submitState}
						type="submit"
						className={`flex justify-center items-center mt-6 px-5 w-32 min-w-32 min-h-10 py-2 rounded-lg text-white font-bold 
              transition duration-300 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed disabled:text-white
              ${getProductColor()} ${getHoverColor()}`}>
						{submitState ? (
							<svg
								className="size-5 animate-spin text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24">
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						) : (
							"Submit"
						)}
					</button>
				</form>
			</div>

			{showSuccessModal && (
				<SuccessModal
					onClose={() => {
						setShowSuccessModal(false);
						navigate("https://aiesec.lk");
					}}
				/>
			)}

			{showFailedModal && (
				<FailModal
					onClose={() => {
						setShowFailedModal(false);
						setMessageTitle("");
						setMessageContent("");
					}}
					messageTitle={messageTitle}
					messageContent={messageContent}
				/>
			)}
		</div>
	);
};

export default ProductSignUp;