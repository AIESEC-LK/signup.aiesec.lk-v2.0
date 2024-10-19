import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GVLogo from '../assets/GTe.png';
import alignment from '../assets/alignment.json';
import { useNavigate } from 'react-router-dom';

const Modal = ({ onClose }) => (
    <div className="fixed inset-0 bg-amber-500 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm text-center">
            <h2 className="text-2xl text-black font-semibold mb-4">Thank you for signing up!</h2>
            <p className="text-black mb-6">One of our team members will contact you soon.</p>
            <button 
                onClick={onClose} 
                className="bg-white  shadow-2xl text-black  font-semibold py-2 px-8 rounded hover:bg-gray-100 transition duration-300"
            >
                Close
            </button>
        </div>
    </div>
);



const SignUpForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        contactNumber: '',
        howFoundUs: '',
        yearOfStudy: '',
        permission: false,
        alignmentName: '', 
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.permission) {
            alert('Please give permission to reach out by phone/email.');
            return;
        }
    
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=.{8,}).*$/;
        if (!passwordRegex.test(formData.password)) {
            alert('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
            return;
        }
        
        const lead_alignment_id = alignment.find(item => item.name === formData.alignmentName)?.id || 1821;
        const payload = {
            user: {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                country_code: "+94",
                phone: formData.contactNumber,
                password: formData.password,
                alignment_id: lead_alignment_id,
                lc: lead_alignment_id,
                referral_type: formData.howFoundUs || "Other",
                allow_phone_communication: formData.permission,
                allow_email_communication: formData.permission,
                selected_programmes: [8],
            },
        };
    
        try {
    
            const res = await axios.post('https://auth.aiesec.org/users.json', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            console.log('Signup response:', res);
            setShowModal(true);  
    
            await axios.post('http://localhost:3000/api/email', {
                email: payload.user.email,
                name: payload.user.first_name + ' ' + payload.user.last_name,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log("Email notification sent!");
    
        } catch (error) {
            console.error('Error during form submission:', error); 
    
            if (error.response?.data?.errors?.email[0] === 'has already been taken') {
                setErrorMessage('The email address has already been taken. Please try again with a different email address.');
            } else {
                setErrorMessage('An error occurred while submitting the form. Please try again.' + error.response?.data?.errors?.email[0]);
            }
        }
    };

    return (
        <div className="">
            <div className='bg-amber-500 h-5 mb-6'>
            </div>
            <div className='ml-6 mr-6 mb-6'>
                <div className='flex justify-center'>
                    <div className=' font-bold text-black text-lg md:text-3xl mt-3'>Sign Up Form</div>                    
                </div>
                <img src={GVLogo} className=' h-7 mt-3 md:mt-0 md:h-14 absolute top-10 right-6' alt="" />
            </div>
            <div className='flex w-full justify-center   items-center md:mt-20'>

                <form onSubmit={handleSubmit} className="bg-white p-8 pt-4 rounded-lg  w-full max-w-[80%] md:max-w-[80%]">
                    {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

                    <div className="space-y-4">
                        <div className='md:flex md:flex-row justify-between w-full'>
                            <label className="block md:w-full md:pr-2 md:mr-10 ">
                                <span className="block font-bold text-m text-gray-700 mb-2">First Name:</span>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required 
                                    className="focus:outline-none mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"/>
                            </label>

                            <label className="block md:w-full md:pl-2">
                                <span className="block font-bold text-m text-gray-700 mb-2">Last Name:</span>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required 
                                    className="focus:outline-none mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"/>
                            </label>
                        </div>

                        

                        <div className='md:flex'>
                            <label className="block md:w-1/2 md:pr-2 md:mr-10 ">
                                <span className="block font-bold text-m text-gray-700 mb-2 ">Email:</span>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required 
                                    className="focus:outline-none mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"/>
                            </label>

                            <label className="block md:w-1/2 md:pl-2 ">
                                <span className="block font-bold text-m text-gray-700 mb-2">Contact Number:</span>
                                    <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required 
                                        className="focus:outline-none mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"/>
                            </label>
                        </div>

                        <div className="md:flex flex-1 space-x-4">
                            <label className="block flex-1 md:mr-10">
                                <span className="block font-bold text-m text-gray-700 mb-2">University / Institute:</span>
                                <select
                                    name="alignmentName"
                                    value={formData.alignmentName}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Select University</option>
                                    {alignment.map(item => (
                                        <option key={`${item.id}-${item.name}-${item['data-id']}`} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="md:block flex-1">
                                <span className="block font-bold text-m text-gray-700 mb-2">Year of Study:</span>
                                <select
                                    name="yearOfStudy"
                                    value={formData.yearOfStudy}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Select Year of Study</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4nd Year</option>
                                </select>
                            </label>
                        </div>
                        <div className="md:flex flex-1 space-x-4">
                            <label className="block flex-1 md:mr-10">
                                <span className="block font-bold text-m text-gray-700 mb-2 ">Password:</span>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required 
                                    className="focus:outline-none mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"/>
                            </label>

                            <label className="md:block flex-1">
                                <span className="block font-bold text-m text-gray-700 mb-2">How did you find us:</span>
                                <select
                                    name="howFoundUs"
                                    value={formData.howFoundUs}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Select option</option>
                                    <option key="friend" value="Friend">Friend</option>
                                    <option key="social_media" value="Social Media">Social Media</option>
                                    <option key="other" value="Other">Other</option>

                                </select>
                            </label>
                        </div>
                        

                        <div className="flex items-center">
                            <input 
                                type="checkbox" 
                                name="permission" 
                                checked={formData.permission} 
                                onChange={handleChange} 
                                className="focus:outline-none mr-2 h-4  text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 "
                            />
                            <span className="text-sm text-gray-700">
                                I give permission to be contacted by phone/email.
                            </span>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="mt-6 px-5 bg-gray-400  py-2 rounded-lg text-black font-bold hover:bg-orange-400 transition duration-300 ease-in-out"
                    >
                        Submit
                    </button>
                </form>
            </div>
            {showModal && <Modal onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default SignUpForm;