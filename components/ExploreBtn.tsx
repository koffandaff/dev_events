'use client'
import Image from "next/image";

const ExploreBtn = () => {
    return ( 
        <button type="button" id="expolre-btn" className=" flex justify-center mt-7 mx-auto" onClick={() => console.log("Damn")}>
        <a href="#events" className="flex items-center 
                    text-white text-lg font-medium 
                    hover:text-cyan-400 transition-colors duration-200
                    group
                    bg-gray-800/50        
                    hover:bg-gray-700     
                    px-6 py-3              
                    rounded-full">
            Explore Events
            <Image src='/icons/arrow-down.svg' alt='arrow-down' width={24} height={24}/>
            
        </a>
        </button>
     );
}
 
export default ExploreBtn;