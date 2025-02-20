import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
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
import { CheckCircleIcon, LifebuoyIcon } from "@heroicons/react/16/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import { useForm, Controller } from "react-hook-form";
// import ReCAPTCHA from "react-google-recaptcha";

import * as yup from "yup";
let recaptchaInstance;
const executeCaptcha = (e) => {
	e.preventDefault();
	recaptchaInstance.execute();
};
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
			.matches(/^(?=.*[A-Z])/, "Passowrd must contain at least one uppercase character")
			.matches(/^(?=.*[0-9])/, "Password must contain at least one number"),
		contactNumber: yup
			.string()

			.required("Phone number is required")
			.min(9, "Phone number must contain at least 9 digits")
			.max(10, "Phone number must contain at most 10 digits")
			.matches(/^[0-9]*$/, "Phone number must contain only digits")
			.transform((value, originalValue) => {
				//if the number starts with 0, remove it
				if (originalValue.startsWith("0")) {
					return originalValue.slice(1);
				}
				return originalValue;
			}),
		howFoundUs: yup.string().required("Referral is required"),
		permission: yup.boolean().oneOf([true], "You must accept the terms and conditions"),
		alignmentId: yup.string().required("Your educational institution is required"),
		// captcha: yup.string().required("Please complete the captcha", { nullable: false }),
	})
	.required("Data is required");
const SuccessModal = ({ onClose }) => {
	useEffect(() => {
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = "auto";
		};
	}, []);

	return (
		<div className={`fixed inset-0 z-50 bg-opacity-90 bg-gray-950 flex items-center justify-center`}>
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
		<div className={`fixed inset-0 z-50 bg-opacity-90 bg-gray-950 flex items-center justify-center`}>
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

// getting the ley from the url and assignining the alignment (data-id)
const ProductSignUp = (props) => {
	const navigate = useNavigate();
	const queryParams = new URLSearchParams(location.search);
	const [submitState, setSubmitState] = useState(false);

	const passedAlignmentId = useRef(
		alignment.find((item) => item.alignment === queryParams?.get("ley"))?.["data-id"] || undefined
	);
	const passedMedium = useRef(queryParams?.get("utm_medium") || undefined);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			alignmentId: passedAlignmentId.current,
			howFoundUs: passedMedium.current,
		},
		mode: "onChange",
		resolver: yupResolver(schema),
	});
	const ProductLogo =
		props.product === "GV" ? GVLogo : props.product === "GTe" ? GTeLogo : props.product === "GTa" ? GT : null;

	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showFailedModal, setShowFailedModal] = useState(false);
	const [messageTitle, setMessageTitle] = useState("");
	const [messageContent, setMessageContent] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);

	const togglePasswordVisibility = (event) => {
		event.preventDefault();
		setPasswordVisible(!passwordVisible);
	};
	function onError(errors, event) {
		console.log(errors, event);
	} // get to know what the issue is

	const onSubmit = async (data) => {
		console.log("first");
		setSubmitState(true);
		const selectedProgramme =
			props.product === "GV" ? 7 : props.product === "GTe" ? 8 : props.product === "GTa" ? 9 : 7;

		const extractedParams = {};
		for (const [key, value] of queryParams?.entries()) {
			extractedParams[key] = value;
		}

		//form data that will be sent to the tracker
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
		console.log(formD);
		let combinedData = { ...extractedParams, ...formD };
		const sendDataToSheet = async () => {
			const url =
				"https://script.google.com/macros/s/AKfycby1UjBdN7R_p1Wam_gN9NlXJeIKH29po0PUrc0hmcDMmDL4hxEVwFQwxsAof0LN7_R6dw/exec";
			combinedData.url = window.location.href;

			try {
				const response = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: new URLSearchParams(combinedData),
				});
				response.ok ? console.log("Data sent to sheet") : console.log(JSON.stringify(response));
			} catch (error) {
				console.error("Error sending data:", error);
			}
		};
		// contact number validity check
		// const contactNumberRegex = /^[0-9]{9}$/;
		// if (!contactNumberRegex.test(formData.contactNumber)) {
		// 	setMessageTitle("Incorrect Contact Number.");
		// 	setMessageContent("Please enter a valid 10-digit contact number. In the format: 712345678");
		// 	setShowFailedModal(true);
		// 	return;
		// }

		// password strength check
		// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=.{8,}).*$/;
		// if (!passwordRegex.test(formData.password)) {
		// 	setMessageTitle("Password requirements not met.");
		// 	setMessageContent(
		// 		"Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
		// 	);
		// 	setShowFailedModal(true);
		// 	return;
		// }

		// should default to GV
		console.log(data.alignmentId);
		console.log(alignment.find((item) => item["data-id"] == data.alignmentId)?.value || 1821);
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
				"https://auth.aiesec.org/users.json", // use this for production
				// "http://localhost:3000/api/users",   // use this for testing
				payload,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			console.log("Email notification sent!");
			if (Object.keys(combinedData).length !== 0) {
				await sendDataToSheet();
			}
			setSubmitState(false);
			setShowSuccessModal(true);
		} catch (error) {
			console.log("Error during form submission:", error);
			setSubmitState(false);
			if (error.response) {
				console.error("Error response:", error.response.data);
				console.error("Error status:", error.response.status);
				console.error("Error headers:", error.response.headers);
			} else {
				console.error("Error message:", error.message);
			}

			if (error.response?.data?.errors?.email[0] === "has already been taken") {
				setMessageTitle("Already registered.");
				setMessageContent(
					"The email address has already been taken. Please try again with a different email address."
				);
				setShowFailedModal(true);
			} else {
				setMessageTitle("Network error.");
				setMessageContent("An error occurred while submitting the form. Please try again.");
				setShowFailedModal(true);
			}
		}
	};

	// component rendering
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
				className=" fixed top-12 left-2 z-10 sm:left-6 md:left-9 cursor-pointer hidden md:block">
				<img src={back} alt="" className="h-5 sm:h-8" />
			</div>
			<div
				className={`absolute top-0 left-0 w-full ${
					props.product === "GTa"
						? "bg-cyan-500"
						: props.product === "GV"
						? "bg-red-500"
						: props.product === "GTe"
						? "bg-amber-500"
						: ""
				} h-60`}
				style={{
					zIndex: 1, // Set this layer above the background
				}}></div>
			<div className="ml-6 mr-6 mb-6">
				<div className="flex justify-center"></div>
			</div>
			<div className="flex w-full justify-center   items-center md:mt-20 ">
				<form
					onSubmit={handleSubmit(onSubmit, onError)}
					className="bg-[#F9F9F9] z-10 md:p-8 p-4 pt-4 rounded-2xl  w-full max-w-[90%] md:max-w-[80%] mb-6">
					<div className="flex justify-between p-3">
						<img src={ProductLogo} className=" h-6 sm:h-7 mt-3 md:mt-0 md:h-11 flex" alt="" />
						<img src={aiesec} className=" h-6 sm:h-7 mt-3 md:mt-0 md:h-9 flex" alt="" />
					</div>
					<div>
						<div className="text-xl sm:text-2xl font-bold sm:mb-5 mt-8 mb-8 sm:mt-5 text-gray-800 text-center">
							{props.product === "GV" && <span className="text-[#F85A40]">Volunteer </span>}
							{props.product === "GTe" && <span className="text-[#F48924]">Teach </span>}
							{props.product === "GTa" && <span className="text-[#0CB9C1]">Intern </span>}
							Abroad. Inspire the Future!
						</div>
					</div>

					<div className=" grid md:grid-cols-2 grid-cols-1  justify-between w-full  gap-y-2 gap-x-8">
						<label>
							<span className="block font-bold text-m text-gray-700 mb-2">First Name:*</span>
							<input
								{...register("firstName")}
								type="text"
								name="firstName"
								className="focus:outline-none mt-1 px-4 py-2 w-full border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
							/>
							<p className="text-red-500 my-1">{errors.firstName?.message || " "} </p>
						</label>

						<label>
							<span className="block font-bold text-m text-gray-700 mb-2">Last Name:*</span>
							<input
								{...register("lastName")}
								type="text"
								name="lastName"
								className="focus:outline-none mt-1 px-4 py-2 w-full border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
							/>
							<p className="text-red-500 my-1">{errors.lastName?.message || " "} </p>
						</label>

						<label>
							<span className="block font-bold text-m text-gray-700 mb-2 ">Email:*</span>
							<input
								{...register("email")}
								type="email"
								autoComplete="email"
								name="email"
								className="focus:outline-none mt-1 px-4 py-2 w-full border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
							/>
							<p className="text-red-500 my-1">{errors.email?.message || " "} </p>
						</label>

						<label>
							<span className="block font-bold text-m text-gray-700 mb-2">Phone Number:*</span>
							<input
								{...register("contactNumber")}
								type="text"
								name="contactNumber"
								autoComplete="tel-national"
								className="focus:outline-none mt-1 px-4 py-2 w-full border  rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
							/>
							<p className="text-red-500 my-1">{errors.contactNumber?.message || " "} </p>
						</label>

						<label hidden={passedAlignmentId.current !== undefined}>
							<span className="block font-bold text-m text-gray-700 mb-2">University / Institute:*</span>
							<select
								{...register("alignmentId")}
								name="alignmentId"
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

						<label hidden={passedMedium.current !== undefined}>
							<span className="block font-bold text-m text-gray-700 mb-2">How did you find us:*</span>
							<select
								{...register("howFoundUs")}
								name="howFoundUs"
								style={{ height: "42px" }}
								className="w-full px-4 py-2 border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500">
								<option value="">Select option</option>
								<option key="blog" value="Blog">
									Blog
								</option>
								<option key="classroom" value="Classroom">
									Classroom
								</option>
								<option key="email" value="Email">
									Email
								</option>
								<option key="event" value="Event">
									Event
								</option>
								<option key="facebook" value="Facebook">
									Facebook
								</option>
								<option key="friend" value="Friend">
									Friend
								</option>
								<option key="instagram" value="Instagram">
									Instagram
								</option>
								<option key="linkedin" value="Linkedin">
									Linkedin
								</option>
								<option key="offline_media" value="Offline_Media">
									Offline Media
								</option>
								<option key="stall" value="Stall">
									Stall
								</option>
								<option key="tiktok" value="TikTok">
									TikTok
								</option>
								<option key="whatsapp" value="WhatsApp">
									WhatsApp
								</option>
								<option key="website" value="Website">
									Website
								</option>
								<option key="other" value="Other">
									Other
								</option>
							</select>
							<p className="text-red-500 my-1">{errors.howFoundUs?.message || " "} </p>
						</label>
					</div>
					<div className="grid md:grid-cols-2 grid-cols-1  justify-between w-full  gap-y-2 gap-x-8 mt-2">
						<label className="md:row-span-6  ">
							{/* <label className="block md:w-full md:pr-2 md:mr-10    "> */}

							<span className="block font-bold text-m text-gray-700">Password:*</span>
							<div className="relative">
								<input
									{...register("password")}
									type={passwordVisible ? "text" : "password"}
									name="password"
									className="mt-1 px-4 py-2 w-full border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
								/>
								<button
									type="button"
									onClick={togglePasswordVisibility}
									className="absolute mt-1 right-2 transform  text-gray-500 h-[42px]">
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
									name="permission"
									{...register("permission")}
									className="focus:outline-none mr-2 h-4  text-indigo-600 rounded focus:ring-indigo-500 "
								/>
								<span className=" text-gray-700">
									I give permission to be contacted by phone/email.
								</span>
							</div>
							<p className="text-red-500 my-1">{errors.permission?.message || " "} </p>
						</div>
						{/* <ReCAPTCHA
							ref={(e) => (recaptchaInstance = e)}
							sitekey={process.env.REACT_APP_SITE_KEY}
							size="invisible"
							verifyCallback={handleSubmit(onSubmit)}
						/> */}
					</div>

					<button
						// onClick={executeCaptcha}
						disabled={submitState}
						type="submit"
						className={`flex justify-center items-center mt-6 px-5 w-32 min-w-32 min-h-10 py-2 rounded-lg text-white font-bold transition duration-300 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed disabled:text-white
              ${
					props.product === "GTa"
						? "bg-cyan-500"
						: props.product === "GV"
						? "bg-red-500"
						: props.product === "GTe"
						? "bg-amber-500"
						: ""
				}
              ${
					props.product === "GTa"
						? "hover:bg-cyan-800"
						: props.product === "GV"
						? "hover:bg-red-800"
						: props.product === "GTe"
						? "hover:bg-amber-800"
						: ""
				}

          `}>
						{submitState ? (
							<svg
								className="size-5 animate-spin text-white "
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						) : (
							"Submit"
						)}
					</button>
					{/* <button
						disabled={submitState}
						type="reset"
						className="mt-6 mx-2 px-5 py-2 rounded-lg text-white font-bold transition duration-300 ease-in-out bg-gray-500 hover:bg-gray-700"
						onClick={handleReset}>
						Clear form
					</button> */}
				</form>
			</div>
			{showSuccessModal && (
				<SuccessModal
					product={props.product}
					onClose={() => {
						setShowSuccessModal(false);
						navigate("https://aiesec.lk");
					}}
				/>
			)}
			{showFailedModal && (
				<FailModal
					product={props.product}
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
