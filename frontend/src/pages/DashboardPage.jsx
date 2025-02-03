import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useUser,
  RedirectToSignIn,
  SignedIn,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";
import { ChartNoAxesGantt } from "lucide-react";
import AddCircleIcon from "../assets/addIcon.svg";
import LogoutIcon from "../assets/logOut.svg";
import editSite from "../assets/editSite.svg";
import publishSite from "../assets/publishSite.svg";
import siteDeployed from "../assets/siteDeployed.svg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const Dashboard = () => {
  const backend = process.env.REACT_APP_BACKEND_URL;
  const { getToken } = useAuth();
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [isAccountVisible, setIsAccountVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const [title, setTitle] = useState(""); // For the title input
  const [description, setDescription] = useState(""); // For the description input
  const [isLoading, setIsLoading] = useState(false);
  // Initial hardcoded sites array
  const [sites, setSites] = useState([]);
  const [error, setError] = useState(null);
  // Function to send user data to the backend
  const sendUserDataToBackend = async (user) => {
    if (!user) return;

    const userData = {
      clerk_user_id: user.id,
      email: user.primaryEmailAddress?.emailAddress || "",
      name: user.fullName
        ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
        : user.id,
    };

    try {
      setIsLoading(true);
      const token = await getToken();
      if (!token) {
        console.error("Token could not be fetched or has expired.");
        return;
      }
      const response = await fetch(`${backend}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        
        console.error("Failed to send user data to the database.");
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error sending user data:", error);
    }
  };
  const toggleModal = () => setIsModalVisible((prev) => !prev);

  // Function to fetch additional sites from API and append them to the existing array
  const fetchSites = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setError("Failed to fetch token. Please try again.");
        return;
      }

      const response = await fetch(`${backend}/user/projects`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
      });

      if (!response.ok) {
        setError("Failed to fetch sites. Please try again.");
        return;
      }

      const data = await response.json();

      // Transform API response to match the `sites` array structure
      const dynamicSites = data.map((site) => ({
        title: site.title,
        description: site.description,
        user: site.user_id,
        status: site.status,
        messages: site.messages,
        projectId: site._id,
        deployment_link: site.deployment_link || "",
        lastEdited: new Date(site.last_edited).toLocaleDateString(),
      }));

      // Append the dynamic sites to the existing array
      setSites(dynamicSites); // Overwrite instead of appending
    } catch (err) {
      console.error("Error fetching sites:", err);
      setError("An error occurred while fetching sites.");
    }
  };

  // Send user data to the backend and fetch sites when user is signed in
  useEffect(() => {
    if (user && isSignedIn) {
      setSites([]); // ✅ Fix: Clear state before fetching
      sendUserDataToBackend(user);
      fetchSites();
    }
  }, [user, isSignedIn]);

  // Handle account modal toggle
  const toggleAccountModal = () => {
    setIsAccountVisible((prev) => !prev);
  };
  // Redirect to sign-in page if the user is not signed in
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  const deploySiteHandle = async (projectId) => {
    try {
      const token = await getToken();
      if (!token) return;

      // Immediately update the site status to "DEPLOYING"
      setSites((prevSites) =>
        prevSites.map((site) =>
          site.projectId === projectId ? { ...site, status: "DEPLOYING" } : site
        )
      );

      const response = await fetch(`${backend}/deploy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ project_id: projectId }),
      });

      const data = await response.json();

      // Update the corresponding site with the new deployment data
      setSites((prevSites) =>
        prevSites.map((site) => {
          if (site.projectId === projectId) {
            return {
              ...site,
              status: data.status,
              deployment_link: data.deployment_link,
              deployment_error: data.deployment_error,
            };
          }
          return site;
        })
      );

      // If deployment succeeded (i.e. valid link and no error), open it in a new tab
      if (data.deployment_link && !data.deployment_error) {
        window.open(data.deployment_link, "_blank");
      }
    } catch (error) {
      console.error("Error deploying site:", error);
    }
  };

  const handleCreateSite = async (title, description) => {
    try {
      const token = await getToken();
      if (!token) {
        setError("Failed to fetch token. Please try again.");
        return;
      }

      // Construct the request body
      const requestBody = {
        title: title,
        description: description,
        editable: "HELLO",
        non_editable_file: "WORLD",
      };

      // Send the POST request
      const response = await fetch(`${backend}/project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to create the site. Please try again.");
      }

      const data = await response.json();

      // Use the returned ID to redirect
      navigate(`/edit/${data._id}`);
    } catch (err) {
      console.error("Error creating site:", err);
      setError("An error occurred while creating the site.");
    } finally {
      toggleModal(); // Close the modal after submission
      setTitle("");
      setDescription("");
    }
  };

  const deleteSiteHandle = async (id) => {
    const response = await fetch(`${backend}/project/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ project_id: id, user_id: user.id })
    });
    
    if (!response.ok) {
      throw new Error("Failed to delete the site. Please try again.");
    } else {
      toast.info("Project deleted successfully");
      await new Promise((resolve) => setTimeout(resolve, 200)); 
      window.location.reload();
    }
  };
  return (
    <div className="bg-gradient-to-br from-[#171124] to-[#1c142b] text-text-color min-h-screen overflow-x-hidden relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full h-11 md:h-16 flex justify-center items-center bg-gradient-to-br from-[#171124] to-[#1c142b] border-b border-gray-500/60 z-50">
        <div className="w-full  flex justify-between items-center px-4">
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-text-color">
              IITG
            </h1>
            <h1 className="text-2xl md:text-3xl font-bold text-text-color-2">
              WebPro
            </h1>
          </div>
          <ul className="flex items-center space-x-4 md:space-x-8">
            <li className="hidden sm:block hover:underline">
              <Link
                to="/about"
                className="text-base md:text-lg text-text-color"
              >
                About Us
              </Link>
            </li>
            <li className="cursor-pointer">
              <SignedIn>
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="Dashboard"
                      labelIcon={<ChartNoAxesGantt size={15} />}
                      href="/dashboard"
                    />
                    <UserButton.Action label="manageAccount" />
                  </UserButton.MenuItems>
                </UserButton>
              </SignedIn>
            </li>
          </ul>
        </div>
      </nav>
      {/* Dashboard Section */}
      <div className="flex justify-center w-full pt-24 md:pt-28 px-4">
        <div className="w-full max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-semibold text-text-color">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-text-color-2 mt-2">
            Manage all your projects in one place
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-500 mt-4">
          <p>{error}</p>
        </div>
      )}

      {/* Sites List */}
      <div className="flex justify-center w-full bg-gradient-to-br from-[#171124] to-[#1c142b] mt-8 px-4">
      {isLoading && (
                // Spinner Overlay
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center transition-opacity duration-500">
                  <ClipLoader color="#ffffff" size={60} />
                </div>
              )}
        <div className="w-full max-w-7xl flex flex-col space-y-6 pb-4">
          {sites.map((site, index) => (
            <div className="w-full rounded-[25px] h-17 flex flex-col md:flex-row bg-dashboard-item shadow-custom">
              {/* Website Name and URL Section */}
              <div className="w-full px-4 py-2 md:px-8 md:py-4 ">
                <div className="w-full">
                  <div className="text-lg md:text-2xl font-semibold font-montserrat text-[var(--text-color)] truncate">
                    {site.title}
                    <span className="text-sm font-inter ml-2 font-normal">
                      {site.status === "DEPLOYING"
                        ? "Deploying"
                        : site.deployment_link && !site.deployment_error
                        ? "Deployed"
                        : "Not deployed"}
                    </span>
                  </div>
                  <div className="text-sm md:text-base text-gray-400 font-medium">
                    <span className="text-sm font-inter font-normal">
                      {site.description}
                    </span>
                  </div>
                </div>
              </div>
              {/* Last Edited Section */}
              <div className="w-full md:w-3/12 mr-9 justify-end py-2 md:py-4 border-gray-400 flex  items-center md:flex">
                <div className="text-sm md:text-base font-montserrat text-gray-400">
                  Last Edited:
                </div>
                <div className=" font-montserrat ml-1 text-gray-500">
                  {site.lastEdited}
                </div>
              </div>
              {/* Action Buttons Section (Delete, Edit, Deploy) */}
              <div className="w-full flex flex-row md:w-1/4 justify-around py-2 md:py-4">
                {/* Delete Button */}
                <div
                  className="flex justify-center w-[30%] border-l border-r border-gray-400 items-center cursor-pointer hover:bg-gray-800/30 transition-colors duration-200"
                  onClick={() => deleteSiteHandle(site.projectId)}
                >
                  <img
                    src={LogoutIcon}
                    alt="Delete site"
                    className="w-6 h-6 md:w-8 md:h-8"
                  />
                </div>

                {/* Edit Button */}
                <div
                  className="flex justify-center w-[30%] border-r border-gray-400 items-center cursor-pointer hover:bg-gray-800/30 transition-colors duration-200"
                  onClick={() => navigate(`/edit/${site.projectId}`)}
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
                  onClick={() => {
                    if (
                      site.deployment_link &&
                      !site.deployment_error &&
                      site.status !== "DEPLOYING"
                    ) {
                      window.open(site.deployment_link, "_blank");
                    } else {
                      deploySiteHandle(site.projectId);
                    }
                  }}
                >
                  <img
                    src={site.deployment_link ? siteDeployed : publishSite}
                    alt={
                      site.deployment_link ? "Site deployed" : "Publish site"
                    }
                    className="w-6 h-6 md:w-8 md:h-8"
                  />
                </div>
              </div>
                  
            </div>
          ))}
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={toggleModal} // Open the modal
        className="fixed bottom-10 right-10 z-[2] w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full hover:scale-110 transition-transform duration-200"
      >
        <img src={AddCircleIcon} alt="Add" className="w-full h-full" />
      </button>

      {/* Account Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gradient-to-br from-[#171124] to-[#1c142b] text-white font-['Montserrat'] rounded-lg w-96 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Create New Site</h2>
              {/* <button onClick={toggleModal}>
             <img src={CloseIcon} alt="Close" className="w-6 h-6" />
           </button> */}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                className="md:w-[90%] h-8 md:text-sm bg-transparent border-b border-gray-500 self-center font-['Inter'] text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#5271ff]"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                className="w-full text-sm border border-gray-400 bg-transparent rounded-lg p-2 mt-1"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={toggleModal}
                className="w-[35%] md: h-10 text-sm font-['Inter'] font-semibold text-[#38bdf8] bg-[#2d2351] rounded-full self-center mt-3 shadow-xl hover:bg-[#3a2c6a] hover:scale-105 transition-transform duration-150 ease-out border-0"
              >
                Cancel &nbsp; &#9654;
              </button>
              <button
                onClick={() => handleCreateSite(title, description)}
                className="w-[35%] md: h-10 text-sm font-['Inter'] font-semibold text-[#38bdf8] bg-[#2d2351] rounded-full self-center mt-3 shadow-xl hover:bg-[#3a2c6a] hover:scale-105 transition-transform duration-150 ease-out border-0"
              >
                Continue &nbsp; &#9654;
              </button>
            </div>
          </div>
              
        </div>
      )}
    </div>
  );
};

export default Dashboard;
