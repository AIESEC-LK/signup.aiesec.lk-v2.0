import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GTeLogo from '../assets/GT.png';
import alignment from '../assets/alignment.json';

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        contactNumber: '',
        howFoundUs: '',
        yearOfStudy: '',
        permission: false,
        alignmentName: '', // New field for alignment name
    });

    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [suggestions, setSuggestions] = useState([]); 
    const [inputValue, setInputValue] = useState(''); 

    useEffect(() => {
        if (inputValue) {
            const filteredSuggestions = alignment.filter(item =>
                item.name.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [inputValue]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
        if (name === 'alignmentName') {
            setInputValue(value);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSuggestions([]);
        setInputValue(suggestion.name); 
        setFormData({
            ...formData,
            alignmentName: suggestion, 
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
        const lead_alignment_id = alignment.find(item => item.name === inputValue)?.id || 1821;


        const payload = {
            user: {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                country_code: "+94",
                phone: formData.contactNumber,
                password: formData.password,
                alignment_id: formData.alignmentName?.value || lead_alignment_id,
                lc: formData.alignmentName?.value || lead_alignment_id,
                referral_type: formData.howFoundUs || "Other",
                allow_phone_communication: formData.permission,
                allow_email_communication: formData.permission,
                selected_programmes: [9],
            },
        };

        try {
            const res = await axios.post('https://auth.aiesec.org/users.json', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            await axios.post('http://localhost:3000/api/email', {
              email: payload.user.email,
              name : payload.user.first_name + ' ' + payload.user.last_name
            }, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            setSubmitted(true);
            console.log('Form submitted successfully!' + JSON.stringify(payload));
            console.log('Response:', res);
        } catch (error) {
            console.error('There was an error!', error);
            if (error.response?.data?.errors?.email[0] === 'has already been taken') {
                setErrorMessage('The email address has already been taken. Please try again with a different email address.');
            } else {
                setErrorMessage('An error occurred while submitting the form. Please try again.');
            }
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-blue-500 text-white p-8 rounded-lg shadow-lg max-w-sm text-center">
                    <h2 className="text-2xl font-semibold mb-4">Thank you for signing up!</h2>
                    <p className="mb-6">One of our team members will contact you soon.</p>
                    <button 
                        onClick={() => setSubmitted(false)} 
                        className="bg-white text-blue-500 hover:bg-blue-100 font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <form onSubmit={handleSubmit} className="bg-white p-8 pt-4 rounded-lg shadow-md w-full max-w-[80%] md:max-w-[50%]">
                <div className='flex flex-row border-b border-b-black py-4 my-6 justify-between items-center'>
                    <h1 className='text-black text:xl md:text-2xl font-semibold'>Global Talent</h1>
                    <img src={GTeLogo} alt="" className='w-18 h-12' />
                </div>
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700 mt-3">Sign up for Global Talent</h2>
                <p className="text-gray-500 mb-4 text-center max-w-50%">Please note that your information is secure with us. We prioritize your privacy and handle 
                    all information with the highest security standards.
                </p>

                {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

                <div className="space-y-4">
                    {/* Existing fields */}
                    <div className='md:flex md:flex-row justify-between w-full'>
                        <label className="block md:w-1/2 md:pr-2 ">
                            <span className="block text-sm font-medium text-gray-700">First Name:</span>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required 
                                className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"/>
                        </label>

                        <label className="block md:w-1/2 md:pl-2">
                            <span className="block text-sm font-medium text-gray-700">Last Name:</span>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required 
                                className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"/>
                        </label>
                    </div>

                    <div>
                        <label className="block">
                            <span className="block text-sm font-medium text-gray-700">Alignment Name:</span>
                            <input 
                                type="text" 
                                name="alignmentName" 
                                value={inputValue} 
                                onChange={handleChange} 
                                required 
                                className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </label>
                        {suggestions.length > 0 && (
                            <ul className="border text-black border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto">
                                {suggestions.map(suggestion => (
                                    <li 
                                        key={suggestion['data-id']} 
                                        onClick={() => handleSuggestionClick(suggestion)} 
                                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {suggestion.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className='md:flex'>
                        <label className="block md:w-1/2 md:pr-2 ">
                            <span className="block text-sm font-medium text-gray-700">Email:</span>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required 
                                className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"/>
                        </label>

                        <label className="block md:w-1/2 md:pl-2">
                            <span className="block text-sm font-medium text-gray-700">Password:</span>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required 
                                className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"/>
                        </label>
                    </div>

                    <div>
                        <label className="block md:w-1/2 md:pr-2 ">
                            <span className="block text-sm font-medium text-gray-700">Contact Number:</span>
                            <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required 
                                className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"/>
                        </label>
                    </div>

                    <div className='md:flex '>

                      <label className="block md:w-1/2 md:pr-2 ">
                          <span className="block text-sm font-medium text-gray-700">How did you find us?</span>
                          <select name="howFoundUs" value={formData.howFoundUs} onChange={handleChange} required 
                            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">Select</option>
                            <option value="socialMedia">Social Media</option>
                            <option value="friend">Friend</option>
                            <option value="other">Other</option>
                          </select>
                        </label>
      
                        <label className="block md:w-1/2 md:pl-2">
                          <span className="block text-sm font-medium text-gray-700">Year of Study:</span>
                          <select name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} required 
                            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">Select</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                          </select>
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input 
                            type="checkbox" 
                            name="permission" 
                            checked={formData.permission} 
                            onChange={handleChange} 
                            className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">
                            I give permission to be contacted by phone/email.
                        </span>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="mt-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUpForm;