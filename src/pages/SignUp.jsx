import React from 'react';
import bg from "../assets/bg.png";
import vol from "../assets/volunteer.png";
import int from "../assets/intern.png";
import teach from "../assets/Teach.png";
import aiesec from "../assets/aiesec.png";
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  return (
    <div className="relative w-full">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
      ></div>
      
      <div className="relative z-10 min-h-screen">
        <div className="w-full h-7 bg-[#037EF3]"></div>

        <div className="flex flex-col items-center justify-center mt-24 sm:mt-32 md:mt-36">
          <div className="font-bold text-center md:text-4xl sm:text-3xl text-2xl text-gray-500">
            <div className="flex flex-col sm:flex-row">
              <div className="flex">
                <span>Want</span>
                <span className="ml-2">to</span>
                <span className="ml-2 text-[#F85A40]">volunteer</span>
              </div>
              <div className="flex justify-center">
                <span className="ml-2 text-[#0CB9C1]">intern</span>
                <span className="ml-2 text-[#F48924]">teach</span>
              </div>
              <div className="ml-2 text-gray-500">abroad?</div>
            </div>
          </div>
        </div>

        <div  className="flex flex-wrap justify-center gap-7 mt-8 sm:mt-14">
          <div
            onClick={
              () => {
                navigate('/globalVolunteer');
              }
            }
           className="w-64 bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-110">
            <img src={int} alt="Intern" className="w-full h-64 object-cover"/>
            <div className="bg-[#F85A40] text-white text-center p-2">
              <div className="font-bold text-2xl">Volunteer</div>
              <div>with AIESEC</div>
            </div>
          </div>

          <div onClick={ 
            () => {
              navigate('/globalTalent');
            }
           } className="w-64 bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-110">
            <img src={vol} alt="Volunteer" className="w-full h-64 object-cover"/>
            <div className="bg-[#0CB9C1] text-white text-center p-2">
              <div className="font-bold text-2xl">Intern</div>
              <div>with AIESEC</div>
            </div>
          </div>

          <div onClick={ 
            () => {
              navigate('/globalTeacher');
            }
           } className="w-64 bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-110">
            <img src={teach} alt="Teach" className="w-full h-64 object-cover"/>
            <div className="bg-[#F48924] text-white text-center p-2">
              <div className="font-bold text-2xl">Teach</div>
              <div>with AIESEC</div>
            </div>
          </div>
        </div>

        <div className='flex justify-center mt-20'>
          <img src={aiesec} className='w-52' alt="" />
        </div>
        <div className="final text-center text-[#828282] pb-7">
          Made with Love 💗 by &lt;/Dev.Team&gt; of AIESEC in Sri Lanka
        </div>
      </div>
    </div>
  );
}

export default SignUp;