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

      <div className="w-full h-5 bg-[#037EF3]"
        style={{
          position: window.innerWidth > 822 ? 'fixed' : 'static',
          top: window.innerWidth > 822 ? '0' : 'auto',
        }}
      ></div>

      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center"
        style={{
          paddingTop: window.innerWidth < 822 ? '20px' : '0',
          paddingBottom: window.innerWidth < 822 ? '20px' : '0',
        }}
      >

        <div className="flex flex-col items-center justify-center">
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

        <div className="flex flex-wrap justify-center gap-7 mt-8 sm:mt-14">
          <div
            onClick={() => navigate('/globalVolunteer')}
            className="card w-64 bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-500 hover:scale-110"
          >
            <img src={int} alt="Intern" className="w-full h-64 object-cover" />
            <div className="bg-[#F85A40] text-white text-center p-2">
              <div className="font-bold text-2xl">Volunteer</div>
              <div>with AIESEC</div>
            </div>
          </div>

          <div
            onClick={() => navigate('/globalTalent')}
            className="card w-64 bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-500 hover:scale-110 delay-75"
          >
            <img src={vol} alt="Volunteer" className="w-full h-64 object-cover" />
            <div className="bg-[#0CB9C1] text-white text-center p-2">
              <div className="font-bold text-2xl">Intern</div>
              <div>with AIESEC</div>
            </div>
          </div>

          <div
            onClick={() => navigate('/globalTeacher')}
            className="card w-64 bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-500 hover:scale-110 delay-150"
          >
            <img src={teach} alt="Teach" className="w-full h-64 object-cover" />
            <div className="bg-[#F48924] text-white text-center p-2">
              <div className="font-bold text-2xl">Teach</div>
              <div>with AIESEC</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full"
        style={{
          position: window.innerWidth > 822 ? 'fixed' : 'static',
          bottom: window.innerWidth > 822 ? '0' : 'auto',
          marginTop: window.innerWidth < 822 ? '30px' : '0px',
        }}
      >
        <div className="flex justify-center">
          <img src={aiesec} className="w-52 mb-4" alt="" />
        </div>
        <div className="final text-center text-[12px] sm:text-base font-extralight text-[#828282] pb-7">
          Made with Love 💗 by &lt;/Dev.Team&gt; 
          {/* <br className="sm:hidden" />  */}
          of AIESEC in Sri Lanka
        </div>
      </div>
    </div>
  );
}

export default SignUp;