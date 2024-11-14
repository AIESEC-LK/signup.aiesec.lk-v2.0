import email_bg from '../assets/email_bg.png'
import aiesec_man from '../assets/aiesec_man.png'

const SampleEmail = () => {

    return (
        <>
        <div  className='bg-gray-500'>
            <div id="upper-part" style={{backgroundImage: `url(${email_bg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" , paddingTop: "20px", paddingBottom: "20px", paddingLeft: "150px", paddingRight: "150px"}}>
                <div id="content-section" style={{backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "20px", paddingBottom: "40px", paddingLeft: "40px", paddingRight: "40px"}}>
                    <center>
                        <img src={aiesec_man} style={{width: "auto", height: "20vh"}}/>
                        <br/>
                        <h1 className='text-4xl font-semibold text-blue-500'>Thank you for signing up!</h1>
                        <br/>
                        <h1 className='text-2xl font-light text-gray-500'>Your account has been successfully created.</h1>
                        <br />
                        <p className='text-gray-500 font-semibold'>Explore the opportunities waiting for you. IoT devices are pieces of hardware that can be embedded into other devices, such as sensors, actuators, appliances, or machines. They can be used in a variety of settings, including the home, industrial equipment, and medical devices.</p>
                        <button className="mt-6 mx-2 px-5 py-2 rounded-lg text-white font-normal transition duration-300 ease-in-out bg-blue-500 hover:bg-blue-700"
                            >
                            EXPLORE OPPORTUNITIES
                        </button>
                    </center>
                </div>
            </div>
            <div id="lower-part" style={{paddingTop: "20px", paddingBottom: "20px", paddingLeft: "150px", paddingRight: "150px"}}>
                <center>
                    <p className='text-white font-normal'>If you have any questions please email us at <a href="mailto:hrdivision@aiesec.org" className='font-semibold underline'>hrdivision@aiesec.org</a> or visit our <a href ="" className='font-semibold underline'>FAQs.</a></p>
                    <br/>
                    <p className='text-white font-semibold'>Connect with us</p>
                    <br/>
                    <a href="https://www.linkedin.com/company/aieseclk/">
                        <i className="fa-brands fa-linkedin fa-2xl text-white hover:text-yellow-600"></i>
                    </a>
                    <a href="https://www.instagram.com/aiesecinsrilanka">
                        <i className="fa-brands fa-instagram fa-2xl text-white mx-24 hover:text-yellow-600"></i>
                    </a>
                    <a href="https://web.facebook.com/AIESECLK">
                        <i className="fa-brands fa-facebook fa-2xl text-white hover:text-yellow-600"></i>
                    </a>      
                </center>
            </div>
        </div>
        </>
    )
}

export default SampleEmail