import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ProductSignUpField from "./ProductSignUpField";
import ProductSignUpButton from "./ProductSignUpButton";

// eslint-disable-next-line react/prop-types
const ProductSignUpForm = ({schema, alignment, product, passedAlignmentId, passedMedium, getProductColor, getHoverColor, onSubmit, submitState, passwordVisible, setPasswordVisible}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      alignmentId: passedAlignmentId,
      howFoundUs: passedMedium,
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const togglePasswordVisibility = (event) => {
    event.preventDefault();
    setPasswordVisible((v) => !v);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-[#F9F9F9] z-10 md:p-8 p-4 pt-4 rounded-2xl w-full max-w-[90%] md:max-w-[80%] mb-6">
      <div className="grid md:grid-cols-2 grid-cols-1 justify-between w-full gap-y-2 gap-x-8">
        <ProductSignUpField
          label="First Name:*"
          name="firstName"
          register={register}
          error={errors.firstName?.message}
        />
        <ProductSignUpField
          label="Last Name:*"
          name="lastName"
          register={register}
          error={errors.lastName?.message}
        />
        <ProductSignUpField
          label="Email:*"
          name="email"
          type="email"
          autoComplete="email"
          register={register}
          error={errors.email?.message}
        />
        <ProductSignUpField
          label="Phone Number:*"
          name="contactNumber"
          type="text"
          autoComplete="tel-national"
          register={register}
          error={errors.contactNumber?.message}
        />
        <ProductSignUpField
          label="University / Institute:*"
          name="alignmentId"
          type="select"
          register={register}
          error={errors.alignmentId?.message}
          hidden={passedAlignmentId !== undefined}
        >
          <option value="">Select University</option>
          {alignment.map((item) => (
            <option key={item["data-id"]} value={item["data-id"]}>
              {item.name}
            </option>
          ))}
        </ProductSignUpField>
        <ProductSignUpField
          label="How did you find us:*"
          name="howFoundUs"
          type="select"
          register={register}
          error={errors.howFoundUs?.message}
          hidden={passedMedium !== undefined}
        >
          <option value="">Select option</option>
          {[
            "Blog",
            "Classroom",
            "Email",
            "Event",
            "Facebook",
            "Friend",
            "Instagram",
            "Linkedin",
            "Offline_Media",
            "Stall",
            "TikTok",
            "WhatsApp",
            "Website",
            "Other",
          ].map((opt) => (
            <option key={opt} value={opt}>
              {opt.replace("_", " ")}
            </option>
          ))}
        </ProductSignUpField>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 justify-between w-full gap-y-2 gap-x-8 mt-2">
        <label className="md:row-span-6 w-full">
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
              className="absolute mt-1 right-2 transform text-gray-500 h-[42px]"
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-red-500 my-1">{errors.password?.message || " "}</p>
        </label>
        <div></div>
        <div className="col-start-1">
          <div className="flex items-center flex-nowrap">
            <input
              type="checkbox"
              {...register("permission")}
              className="focus:outline-none mr-2 h-4 text-indigo-600 rounded focus:ring-indigo-500 flex-shrink-0"
            />
            <span className="text-gray-700 whitespace-nowrap">
              I have read and agree to AIESEC Sri Lanka's {" "}
              <a
                href="https://aiesec.lk/privacy-and-cookie-policy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0cb9c1" }}
              >
                Privacy Policy
              </a>{" "}
              and I may be contacted by AIESEC representatives for further processing.
            </span>
          </div>
          <p className="text-red-500 my-1">{errors.permission?.message || " "}</p>
        </div>
      </div>
      <ProductSignUpButton
        loading={submitState}
        className={`${getProductColor()} ${getHoverColor()}`}
      >
        Submit
      </ProductSignUpButton>
    </form>
  );
};

export default ProductSignUpForm;

