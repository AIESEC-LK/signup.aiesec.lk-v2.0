import React, { useState } from 'react';
import axios from 'axios';
import { ApolloClient, InMemoryCache, gql, ApolloProvider, useMutation } from '@apollo/client';
import GTeLogo from '../assets/GTe.png'

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        contactNumber: '',
        howFoundUs: '',
        yearOfStudy: '',
        permission: false
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/signup', formData)
            .then(response => {
                setSubmitted(true);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    if (submitted) {
        return (
            <div>
                <h2>Thank you for signing up!</h2>
                <p>One of our team members will contact you soon.</p>
                <button onClick={() => setSubmitted(false)}>Close</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center text-black ">
         
          <form onSubmit={handleSubmit} className="bg-white p-8 pt-4 rounded-lg shadow-md w-full max-w-[80%] md:max-w-[50%]">
          <div className='flex flex-row border-b border-b-black py-4 my-6 justify-between items-center'>
            <h1 className='text-black text:xl md:text-2xl font-semibold'>Global Teacher</h1>
            <img src={GTeLogo} alt="" className='w-18 h-12' />
          </div>
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700 mt-3">Sign up for Global Teacher</h2>
            <p className="text-gray-500 mb-4 text-center max-w-50%">Please note that Your information is secure with us. We prioritze your privacy and handle 
                all information with highest security standards.
            </p>
      
            <div className="space-y-4">

                <div className='md:flex md:flex-row justify-between w-full '>
                <label className="block md:w-1/2 md:pr-2 ">
                <span className="block text-sm font-medium text-gray-700">First Name:</span>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required 
                  className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
              </label>
      
              <label className="block md:w-1/2 md:pl-2">
                <span className="block text-sm font-medium text-gray-700">Last Name:</span>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required 
                  className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
              </label>
                </div>


                <div className='md:flex'>
                <label className="block md:w-1/2 md:pr-2 ">
                <span className="block text-sm font-medium text-gray-700">Email:</span>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required 
                  className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
              </label>
      
              <label className="block md:w-1/2 md:pl-2">
                <span className="block text-sm font-medium text-gray-700">Password:</span>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required 
                  className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
              </label>
                </div>

             
        <div>
        <label className="block md:w-1/2 md:pr-2 ">
                <span className="block text-sm font-medium text-gray-700">Contact Number:</span>
                <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required 
                  className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
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
        
            
      
              <label className="flex items-center">
                <input type="checkbox" name="permission" checked={formData.permission} onChange={handleChange} 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <span className="ml-2 text-gray-700 w-full ">I give permission to reach out by phone/email.</span>
              </label>
      
              <label className="block max-w-xs">
                <span className="block text-sm font-medium text-gray-700">CAPTCHA:</span>
                <input type="text" required 
                  className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
              </label>
      
              <button type="submit" className="w-full py-2 px-4 mt-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                Submit
              </button>
            </div>
          </form>
        </div>
      );
      
};

export default SignUpForm;
