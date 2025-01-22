import React from "react";
import editSite from "../../assets/editSite.svg";
import publishSite from "../../assets/publishSite.svg";
import siteDeployed from "../../assets/siteDeployed.svg";
import { useLocation } from "react-router-dom";

export default function WebsiteDetails({ name, url }) {

  const editSiteHandle = () => {
      //Clicked on edit
  }

  const deploySiteHandle = () => {
    //Deploy site logic
  }
  
  return (
    <div className="w-full h-20 flex">
      <div className="w-11/12 rounded-l-[40px] border border-gray-400 px-8 py-2 md:py-2">
        <div className="w-full">
          <h1 className="text-2xl md:text-3xl font-medium font-montserrat text-[var(--text-color)] truncate">
            {name}
          </h1>
          <h3 className="text-xs text-gray-400 font-medium mt-1">
            {url ? url : "Not deployed yet"}
          </h3>
        </div>
      </div>
      <div 
        className="w-1/12 border border-gray-400 flex justify-center items-center cursor-pointer hover:bg-gray-800/30 transition-colors duration-200" 
        onClick={editSiteHandle}
      >
        <img 
          src={editSite} 
          alt="Edit site" 
          className="w-6 h-6 md:w-8 md:h-8"
        />
      </div>
      <div 
        className="w-1/12 border border-gray-400 rounded-r-[40px] flex justify-center items-center cursor-pointer hover:bg-gray-800/30 transition-colors duration-200" 
        onClick={url ? () => console.log("deployed") : deploySiteHandle}
      >
        <img 
          src={url ? siteDeployed : publishSite} 
          alt={url ? "Site deployed" : "Publish site"} 
          className="w-6 h-6 md:w-8 md:h-8"
        />
      </div>
    </div>
  );
}
