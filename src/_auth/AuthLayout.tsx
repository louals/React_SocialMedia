import { Outlet, Navigate } from "react-router-dom";


const AuthLayout = () => {
  const isAuthenticated = false;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <div className="flex flex-col lg:flex-row h-screen w-full bg-black overflow-hidden">
          
          {/* Left Side: Fancy Image Cards */}
          <section className="hidden lg:flex flex-1 justify-center items-center relative">
            <div className="relative w-[450px] h-[600px] flex justify-center items-center lg:translate-x-20">
              
              {/* LEFT CARD - Tilted Right */}
              <div className="absolute w-[200px] h-[360px] mr-[200px] rounded-[40px] overflow-hidden -translate-x-36 -rotate-6 z-10 shadow-2xl  transition-transform duration-500 ">
                <img src="/assets/images/side-image-3.jpg" className="w-full h-full object-cover" alt="story1" />
              </div>

              {/* RIGHT CARD - Tilted Left */}
              <div className="absolute w-[200px] h-[360px] ml-[200px] rounded-[40px] overflow-hidden  translate-x-36 rotate-6 z-10 shadow-2xl  transition-transform duration-500 ">
                <img src="/assets/images/side-image-1.jpg" className="w-full h-full object-cover" alt="story2" />
              </div>

              {/* CENTER CARD (Front & Largest) */}
              <div className="absolute w-[380px] h-[520px] rounded-[48px] z-30 shadow-[0_35px_60px_-15px_rgba(0,0,0,1)] overflow-hidden bg-zinc-900">
                <img src="/assets/images/side-image-2.jpg" className="w-full h-full object-cover" alt="story3" />
              </div>

            </div>
          </section>

          {/* Right Side: Form Section */}
          <section className="flex flex-1 justify-center items-center flex-col py-10 z-50">
            <div className="w-full max-w-[400px] flex flex-col items-center">
              <Outlet />
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default AuthLayout;