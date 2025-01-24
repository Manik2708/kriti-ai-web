import React from "react";
import editSite from "../../assets/editSite.svg";
import publishSite from "../../assets/publishSite.svg";
import siteDeployed from "../../assets/siteDeployed.svg";
import deleteIcon from "../../assets/deleteIcon.svg";
import { useLocation } from "react-router-dom";

const WebsiteDetails = ({ name, url, lastEdited }) => {
  const editSiteHandle = () => {
    //Clicked on edit
  };

  const deploySiteHandle = () => {
    //Deploy site logic
  };

  const deleteSiteHandle = () => {
    //Delete site logic
  };

  return (
    <div className="w-full rounded-[25px] h-17 flex flex-col md:flex-row bg-dashboard-item shadow-custom">
      {/* Website Name and URL Section */}
      <div className="w-full px-4 py-2 md:px-8 md:py-4 ">
        <div className="w-full">
          <div className="text-lg md:text-2xl font-semibold font-montserrat text-[var(--text-color)] truncate">
            {name}
          </div>
          <div className="text-sm md:text-base text-gray-400 font-medium">
            {url ? url : "Not deployed yet"}
          </div>
        </div>
      </div>

      {/* Last Edited Section */}
      <div className="w-full md:w-1/12 py-2 md:py-4 border-gray-400 flex flex-col items-center hidden md:flex">
        <div className="text-sm md:text-base font-montserrat text-gray-400">Last Edited:</div>
        <div className="text-lg font-montserrat text-500">{lastEdited}</div>
      </div>

      {/* Action Buttons Section (Delete, Edit, Deploy) */}
      <div className="w-full flex flex-row md:w-1/4 justify-around py-2 md:py-4">
        {/* Delete Button */}
        <div
          className="flex justify-center w-[30%] border-l border-r border-gray-400 items-center cursor-pointer hover:bg-gray-800/30 transition-colors duration-200"
          onClick={deleteSiteHandle}
        >
          <img
            src={deleteIcon}
            alt="Delete site"
            className="w-6 h-6 md:w-8 md:h-8"
          />
        </div>
        
        {/* Edit Button */}
        <div
          className="flex justify-center w-[30%] border-r border-gray-400 items-center cursor-pointer hover:bg-gray-800/30 transition-colors duration-200"
          onClick={editSiteHandle}
        >
          <img
            src={editSite}
            alt="Edit site"
            className="w-6 h-6 md:w-8 md:h-8"
          />
        </div>

        {/* Deploy Button */}
        <div
          className="flex justify-center w-[30%] items-center cursor-pointer hover:bg-gray-800/30 transition-colors duration-200"
          onClick={url ? () => console.log("deployed") : deploySiteHandle}
        >
          <img
            src={url ? siteDeployed : publishSite}
            alt={url ? "Site deployed" : "Publish site"}
            className="w-6 h-6 md:w-8 md:h-8"
          />
        </div>
      </div>
    </div>
  );
};

export default WebsiteDetails;
