import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import GVLogo from "../assets/GV.png";
import GTeLogo from "../assets/GTe.png";
import GT from "../assets/GT.png";
import bg from "../assets/bg.png";
import aiesec from "../assets/pbaiesec.png";
import back from "../assets/back.svg";
import alignment from "../assets/alignment.json";
import * as yup from "yup";
import ProductSignUpHeader from "./ProductSignUp/ProductSignUpHeader";
import ProductSignUpForm from "./ProductSignUp/ProductSignUpForm";
import SuccessModal from "./ProductSignUp/SuccessModal";
import FailModal from "./ProductSignUp/FailModal";

const AppScriptURL = import.meta.env.VITE_APP_SCRIPT_URL;

// Validation schema outside component
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
		permission: yup.boolean().oneOf([true], "You must accept the terms and conditions"),
		alignmentId: yup.string().required("Your educational institution is required"),
	})
	.required("Data is required");

const ProductSignUp = (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const [submitState, setSubmitState] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showFailedModal, setShowFailedModal] = useState(false);
	const [messageTitle, setMessageTitle] = useState("");
	const [messageContent, setMessageContent] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);

	const passedAlignmentId = useMemo(
		() => alignment.find((item) => item.alignment === queryParams?.get("ley"))?.["data-id"] || undefined,
		[queryParams]
	);
	const passedMedium = useMemo(() => queryParams?.get("utm_medium") || undefined, [queryParams]);
	const ProductLogo = useMemo(
		() => (props.product === "GV" ? GVLogo : props.product === "GTe" ? GTeLogo : props.product === "GTa" ? GT : null),
		[props.product]
	);

	// Color helpers
	const getProductColor = () => {
		if (props.product === "GTa") return "bg-cyan-500";
		if (props.product === "GV") return "bg-red-500";
		if (props.product === "GTe") return "bg-amber-500";
		return "";
	};
	const getHoverColor = () => {
		if (props.product === "GTa") return "hover:bg-cyan-800";
		if (props.product === "GV") return "hover:bg-red-800";
		if (props.product === "GTe") return "hover:bg-amber-800";
		return "";
	};

	// Form submission handler
	const handleFormSubmit = async (data) => {
		setSubmitState(true);
		const selectedProgramme =
			props.product === "GV" ? 7 : props.product === "GTe" ? 9 : props.product === "GTa" ? 8 : 7;
		const extractedParams = {};
		for (const [key, value] of (queryParams ? queryParams.entries() : [])) {
			extractedParams[key] = value;
		}
		let formD = {
			product: props.product || "GV",
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			contactNumber: data.contactNumber,
			university: alignment.find((item) => String(item["data-id"]) === String(data.alignmentId))?.lc || "other",
			leadAlignment: data.alignmentId,
			howFoundUs: data.howFoundUs,
		};
		let combinedData = { ...extractedParams, ...formD };
		const sendDataToSheet = () => {
			const url = AppScriptURL;
			combinedData.url = window.location.href;
			// Fire-and-forget with keepalive
			fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams(combinedData),
				keepalive: true,
			}).catch((error) => {
				console.error("Error sending data to sheet:", error);
			});
		};
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
				lc: alignment.find((item) => String(item["data-id"]) === String(data.alignmentId))?.value || 1821,
				referral_type: data.howFoundUs || "Other",
				allow_phone_communication: data.permission,
				allow_email_communication: data.permission,
				selected_programmes: [selectedProgramme],
			},
		};
		try {
			await (await import("axios")).default.post(
				"https://auth.aiesec.org/users.json",
				payload,
				{ headers: { "Content-Type": "application/json" } }
			);
			if (Object.keys(combinedData).length !== 0) {
				sendDataToSheet();
			}
			setSubmitState(false);
			setShowSuccessModal(true);
		} catch (error) {
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

	return (
		<div
			className="-z-50 w-full bg-cover bg-center bg-no-repeat"
			style={{
				backgroundImage: `url(${bg})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				minHeight: "100vh",
			}}
		>
			<ProductSignUpHeader
				product={props.product}
				ProductLogo={ProductLogo}
				aiesecLogo={aiesec}
				backIcon={back}
				getProductColor={getProductColor}
			/>
			<div className="flex w-full justify-center items-center md:mt-20">
				<ProductSignUpForm
					schema={schema}
					alignment={alignment}
					product={props.product}
					passedAlignmentId={passedAlignmentId}
					passedMedium={passedMedium}
					getProductColor={getProductColor}
					getHoverColor={getHoverColor}
					onSubmit={handleFormSubmit}
					submitState={submitState}
					passwordVisible={passwordVisible}
					setPasswordVisible={setPasswordVisible}
				/>
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

ProductSignUp.propTypes = {
	product: PropTypes.string.isRequired,
};

export default ProductSignUp;
