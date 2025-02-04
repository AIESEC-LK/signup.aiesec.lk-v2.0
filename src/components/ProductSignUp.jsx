import React, { useState, useEffect } from "react";
import { TiTick } from "react-icons/ti";

import axios from "axios";
import GVLogo from "../assets/GV.png";
import GTeLogo from "../assets/GTe.png";
import GT from "../assets/GT.png";
import bg from "../assets/bg.png";

import aiesec from "../assets/pbaiesec.png";
import back from "../assets/back.svg";

import alignment from "../assets/alignment.json";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";

const SuccessModal = ({ onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 bg-opacity-90 bg-gray-950 flex items-center justify-center`}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm text-center">
        <center>
          <CheckCircleIcon className="size-20 text-green-500 mb-4" />
        </center>

        <h1 className="text-3xl text-green-500 font-semibold mb-4">Success!</h1>

        <h2 className="text-2xl text-black font-semibold mb-4">
          Thank you for signing.
        </h2>
        <p className="text-black mb-6">
          One of our team members will contact you soon.
        </p>
        <button
          onClick={onClose}
          className="bg-green-500 shadow-2xl text-white font-semibold py-2 px-8 rounded hover:bg-gray-100 transition duration-300"
        >
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
    <div
      className={`fixed inset-0 z-50 bg-opacity-90 bg-gray-950 flex items-center justify-center`}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm text-center">
        <center>
          <ExclamationTriangleIcon className="size-20 text-red-500 mb-4" />
        </center>

        <h1 className="text-3xl text-red-500 font-semibold mb-4">Error!</h1>

        <h2 className="text-2xl text-black font-semibold mb-4">
          {messageTitle}
        </h2>
        <p className="text-black mb-6">{messageContent}</p>
        <button
          onClick={onClose}
          className="bg-red-500 shadow-2xl text-white font-semibold py-2 px-8 rounded hover:bg-gray-100 transition duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

const queryAlignments = {
  cs: 1340,
  cc: 222,
  usj: 221,
  kandy: 2204,
  ruhuna: 2175,
  sliit: 2188,
  rajarata: 5490,
  nibm: 4535,
  nsbm: 2186,
  cn: 872,
};

const ProductSignUp = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  var EY = queryParams?.get("EY");
  EY = EY ?? "Main";
  if (EY !== "Main") {
    EY = queryAlignments[EY];
  }
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contactNumber: "",
    howFoundUs: "",
    yearOfStudy: "",
    permission: false,
    alignmentName: EY !== "Main" ? EY : "",
  });

  const ProductLogo =
    props.product === "GV"
      ? GVLogo
      : props.product === "GTe"
      ? GTeLogo
      : props.product === "GTa"
      ? GT
      : null;

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [requirementsMet, setRequirementsMet] = useState({
    charCount: false,
    case: false,
    specialChar: false,
  });
  const togglePasswordVisibility = (event) => {
    event.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "password") {
      setRequirementsMet({
        charCount: value.length >= 8,
        case: /[a-z]/.test(value) && /[A-Z]/.test(value),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      contactNumber: "",
      howFoundUs: "",
      yearOfStudy: "",
      permission: false,
      alignmentName: EY !== "Main" ? EY : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.permission) {
      setMessageTitle("Complete required fields.");
      setMessageContent("Please give permission to reach out by phone/email.");
      setShowFailedModal(true);
      return;
    }

    const extractedParams = {};
    for (const [key, value] of queryParams?.entries()) {
      extractedParams[key] = value;
    }

    
    //form data that will be sent to the tracker
    let formD = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      contactNumber: formData.contactNumber,
      yearOfStudy: formData.yearOfStudy,
      university: queryParams?.get("ley") || formData.alignmentName
    };
    let combinedData = { ...extractedParams, ...formD };
    const urlEncodedData = combinedData;
    const serializedData = urlEncodedData.toString();
    console.log("university",formD.university);
    const sendDataToSheet = async () => {
      const url =
        "https://script.google.com/macros/s/AKfycbx_7s6xyRm3bnCTm98PNDA92K20h1y9xQJRwe8ReViqyrqYtWx4gEscu4-u6MRhc-gZKA/exec";
        const urlObj = new URL(url);
        combinedData.url = urlObj.href; 
        console.log("combined data later",combinedData);
        console.log("urlObj",urlObj);
        console.log("urlObj.href",urlObj.href);

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(combinedData),
        });
        const responseText = await response.text();
        if (response.ok) {
          alert("Data sent successfully: " + responseText);
        }
      } catch (error) {
        console.error("Error sending data:", error);
        alert("error sending data please try again.");
      }
    };
  
    const contactNumberRegex = /^[0-9]{9,10}$/;
    if (!contactNumberRegex.test(formData.contactNumber)) {
      setMessageTitle("Incorrect Contact Number.");
      setMessageContent(
        "Please enter a valid 10-digit contact number. In the format: 0712345678"
      );
      setShowFailedModal(true);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=.{8,}).*$/;
    if (!passwordRegex.test(formData.password)) {
      setMessageTitle("Password requirements not met.");
      setMessageContent(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      setShowFailedModal(true);
      return;
    }

    var lead_alignment_id;
    if (EY === "Main") {
      lead_alignment_id =
        alignment.find((item) => item.name === formData.alignmentName)?.id ||
        1821;
    } else {
      lead_alignment_id = EY;
    }
    const selectedProgramme =
      props.product === "GV"
        ? 7
        : props.product === "GTe"
        ? 8
        : props.product === "GTa"
        ? 9
        : null;

    const payload = {
      user: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        country_code: "+94",
        phone: formData.contactNumber,
        contact_number: formData.contactNumber,
        password: formData.password,
        alignment_id: lead_alignment_id,
        lc: lead_alignment_id,
        referral_type: formData.howFoundUs || "Other",
        allow_phone_communication: formData.permission,
        allow_email_communication: formData.permission,
        selected_programmes: [selectedProgramme],
      },
    };
    try {
      // const res = await axios.post(
      //   "https://staging-jruby.aiesec.org/graphql", // use this for production
      //   // "http://localhost:3000/api/users",   // use this for testing
      //   payload,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      console.log("Email notification sent!");
      if (Object.keys(combinedData).length !== 0) {
        await sendDataToSheet();
      }
      setShowSuccessModal(true);
    } catch (error) {
      console.log("Error during form submission:", error);

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
        setMessageContent(
          "An error occurred while submitting the form. Please try again."
        );
        setShowFailedModal(true);
      }
    }
  };

  return (
    <div
      className="-z-50 h-screen w-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        onClick={() => navigate("/")}
        className=" fixed top-12 left-2 z-10 sm:left-6 md:left-9 cursor-pointer"
      >
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
        }}
      ></div>
      <div className="ml-6 mr-6 mb-6">
        <div className="flex justify-center"></div>
      </div>
      <div className="flex w-full justify-center   items-center md:mt-20">
        <form
          onSubmit={handleSubmit}
          className="bg-[#F9F9F9] z-10 p-8 pt-4 rounded-2xl  w-full max-w-[80%] md:max-w-[80%]"
        >
          <div className="flex justify-between p-3">
            <img
              src={ProductLogo}
              className=" h-6 sm:h-7 mt-3 md:mt-0 md:h-11 flex"
              alt=""
            />
            <img
              src={aiesec}
              className=" h-6 sm:h-7 mt-3 md:mt-0 md:h-9 flex"
              alt=""
            />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold sm:mb-5 mt-8 mb-8 sm:mt-5 text-gray-800 text-center">
              {props.product === "GV" && (
                <span className="text-[#F85A40]">Volunteer</span>
              )}
              {props.product === "GTe" && (
                <span className="text-[#F48924]">Teach</span>
              )}
              {props.product === "GTa" && (
                <span className="text-[#0CB9C1]">Intern</span>
              )}
              . Abroad. Inspire the Future!
            </div>
          </div>

          <div className="space-y-4">
            <div className="md:flex md:flex-row justify-between w-full">
              <label className="block md:w-full  md:pr-2 md:mr-10 ">
                <span className="block font-bold text-m text-gray-700 mb-2">
                  First Name:*
                </span>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="focus:outline-none mt-1 px-4 py-2 w-full border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </label>

              <label className="block md:w-full  md:pl-2 mt-5 md:mt-0">
                <span className="block font-bold text-m text-gray-700 mb-2">
                  Last Name:*
                </span>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="focus:outline-none mt-1 px-4 py-2 w-full border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </label>
            </div>

            <div className="md:flex">
              <label className="block md:w-1/2 md:pr-2 md:mr-10 mt-5 md:mt-0">
                <span className="block font-bold text-m text-gray-700 mb-2 ">
                  Email:*
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="focus:outline-none mt-1 px-4 py-2 w-full border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </label>

              {/* <label className="block md:w-1/2 md:pl-2 mt-5 md:mt-0"> */}
              <label className="block md:w-1/2 md:pl-2 mt-5 md:mt-0 ">
                <span className="block font-bold text-m text-gray-700 mb-2">
                  Contact Number:*
                </span>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  className="focus:outline-none mt-1 px-4 py-2 w-full border  rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </label>
            </div>

            <div className="">
              {EY === "Main" ? (
                <div className="md:flex flex-1 space-x-4">
                  <label className="md:block flex-1 md:mr-10">
                    <span className="block font-bold text-m text-gray-700 mb-2">
                      University / Institute:*
                    </span>
                    <select
                      name="alignmentName"
                      value={formData.alignmentName}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select University</option>
                      {alignment.map((item) => (
                        <option
                          key={`${item.id}-${item.name}-${item["data-id"]}`}
                          value={item.name}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex-1 md:block">
                    <span className="block font-bold text-m text-gray-700 mb-2 ">
                      Year of Study:
                    </span>
                    <select
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full px-4 py-2 border  rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Year of Study</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </label>
                </div>
              ) : (
                <>
                  <div className="md:flex md:flex-row justify-between w-full ">
                    <label className="block md:w-full md:pr-2 md:mr-10 mt-5 md:mt-0">
                      <span className="block font-bold text-m text-gray-700 mb-2">
                        Year of Study:
                      </span>
                      <select
                        name="yearOfStudy"
                        value={formData.yearOfStudy}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Year of Study</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4nd Year</option>
                      </select>
                    </label>
                    <div className="block md:w-full md:pl-2 mt-5 md:mt-0">
                      <label className="md:block flex-1">
                        <span className="block font-bold text-m text-gray-700 mb-2">
                          How did you find us:*
                        </span>
                        <select
                          name="howFoundUs"
                          value={formData.howFoundUs}
                          onChange={handleChange}
                          required
                          className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select option</option>
                          <option key="friend" value="Friend">
                            Friend
                          </option>
                          <option key="social_media" value="Social Media">
                            Social Media
                          </option>
                          <option key="other" value="Other">
                            Other
                          </option>
                        </select>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="md:flex md:flex-row justify-between w-full md:mt-4 ">
                      <label className="block md:w-full md:pr-2 md:mr-10   ">
                        {/* <label className="block md:w-full md:pr-2 md:mr-10    "> */}

                        <span className="block font-bold text-m text-gray-700 mb-2 mt-4 ">
                          Password:*
                        </span>
                        <div className="relative">
                          <input
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 px-4 py-2 w-full border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
                          >
                            {passwordVisible ? "Hide" : "Show"}
                          </button>
                        </div>
                      </label>
                      <div className="block md:w-full md:pl-2 mt-5 ">
                        <div className="text-black text-xs mt-2 items-center  ">
                          <div className="requirements ">
                            <p className="">Password must,</p>

                            <ul className="list-disc pl-3 ">
                              <li
                                className={
                                  requirementsMet.charCount ? "met" : ""
                                }
                              >
                                Include at least 8 characters
                              </li>

                              <li className={requirementsMet.case ? "met" : ""}>
                                Include lowercase & uppercase letters
                              </li>
                              <li
                                className={
                                  requirementsMet.specialChar ? "met" : ""
                                }
                              >
                                Include a special character
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="md:flex flex-1 space-x-4">
              {EY === "Main" && (
                <label className="block flex-1 md:mr-10">
                  <span className="block font-bold text-m text-gray-700 mb-2 ">
                    Password:*
                  </span>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="mt-1 px-4 py-1.5 w-full border  rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 text-sm"
                    >
                      {passwordVisible ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="requirements text-xs text-black mt-2 ">
                    <p className="">Password must,</p>

                    <ul className="list-disc pl-3  ">
                      <li className={requirementsMet.charCount ? "met" : ""}>
                        {" "}
                        Include at least 8 characters
                      </li>

                      <li className={requirementsMet.case ? "met" : ""}>
                        Include lowercase & uppercase letters
                      </li>
                      <li className={requirementsMet.specialChar ? "met" : ""}>
                        Include a special character
                      </li>
                    </ul>
                  </div>
                </label>
              )}
              {EY === "Main" && (
                <label className="md:block flex-1">
                  <span className="block font-bold text-m text-gray-700 mb-2">
                    How did you find us:*
                  </span>
                  <select
                    name="howFoundUs"
                    value={formData.howFoundUs}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select option</option>
                    <option key="friend" value="Friend">
                      Friend
                    </option>
                    <option key="social_media" value="Social Media">
                      Social Media
                    </option>
                    <option key="other" value="Other">
                      Other
                    </option>
                  </select>
                </label>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="permission"
                checked={formData.permission}
                onChange={handleChange}
                className="focus:outline-none mr-2 h-4  text-indigo-600 rounded focus:ring-indigo-500 "
              />
              <span className="text-sm text-gray-700">
                I give permission to be contacted by phone/email.
              </span>
            </div>
          </div>

          <button
            type="submit"
            className={`mt-6 px-5   py-2 rounded-lg text-white font-bold transition duration-300 ease-in-out
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

                        `}
          >
            Submit
          </button>
          <button
            type="reset"
            className="mt-6 mx-2 px-5 py-2 rounded-lg text-white font-bold transition duration-300 ease-in-out bg-gray-500 hover:bg-gray-700"
            onClick={handleReset}
          >
            Clear form
          </button>
        </form>
      </div>
      {showSuccessModal && (
        <SuccessModal
          product={props.product}
          onClose={() => {
            setShowSuccessModal(false);
            navigate("/");
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
