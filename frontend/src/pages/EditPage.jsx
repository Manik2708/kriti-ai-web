import React, { useState, useRef, useEffect } from "react";
import {
  useAuth,
  RedirectToSignIn,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChartNoAxesGantt } from "lucide-react";
export default function EditPage() {
  const aiQuotes = [
    "Brewing brilliance for your website...",
    "Crafting your digital masterpiece...",
    "Spinning the web magic...",
    "Stirring up creativity for your site...",
    "Mixing ideas into a stunning website...",
    "Forging the perfect online presence...",
    "Weaving your vision into reality...",
    "Cooking up something amazing for you...",
    "Generating web wonders...",
    "Building your digital dream...",
    "Designing with artificial intelligence...",
    "Transforming thoughts to code...",
    "Conjuring captivating content...",
    "Animating your aspirations...",
    "Architecting your online presence...",
    "Engineering excellence for your website...",
    "Coding with care and precision...",
    "Developing dynamic designs...",
    "Fostering flawless functionality...",
    "Innovating your internet identity...",
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const backend = process.env.REACT_APP_BACKEND_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [template5, setTemplate5] = useState("");
  const [editablejs, setEditablejs] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isSignedIn, getToken } = useAuth();
  const { id } = useParams();
  const user = useUser().user;
  const iframeRef = useRef(null);

  const sendButtonRef = useRef(null);

  // Effect to handle quote rotation
  useEffect(() => {
    let quoteInterval;

    if (isLoading) {
      quoteInterval = setInterval(() => {
        setCurrentQuoteIndex((prevIndex) =>
          prevIndex === aiQuotes.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // Change quote every 3 seconds
    }

    return () => {
      if (quoteInterval) {
        clearInterval(quoteInterval);
      }
    };
  }, [isLoading, aiQuotes.length]);

  useEffect(() => {
    const scriptMatch = template5?.match(
      /window\.editor\.on\("load",[\s\S]*?(?=\s*<\/script>)/
    );
    const editablejava = scriptMatch ? scriptMatch[0] : "";
    setEditablejs(editablejava);
  }, [template5]);
  useEffect(() => {
    console.log(messages);
  }, [messages]);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      className: "custom-toast",
      progressClassName: "custom-progress",
    });
  };
  const saveHtml = async () => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow && iframe.contentWindow.editor) {
      const editor = iframe.contentWindow.editor;
      try {
        const wrapper = editor.getWrapper();

        // **Step 1: Toggle a 0.5px CSS change**
        const currentPadding = wrapper.getStyle()["padding"] || "0px";
        const newPadding = currentPadding === "0px" ? "0.000000001px" : "0px";
        wrapper.addStyle({ padding: newPadding });

        console.log("Triggered CSS change: Padding set to", newPadding);

        // **Step 2: Store and get updated HTML**
        editor.store();
        await new Promise((resolve) => setTimeout(resolve, 200)); // Ensure changes apply
        const htmlContent = editor.getHtml();
        console.log(htmlContent);
        console.log(htmlContent);
        const cssContent = editor.getCss();
        const jsContent = editor.getJs ? editor.getJs() : "";

        const template = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document</title>
              <style>
                  ${cssContent}
              </style>
          </head>
          <body>
              ${htmlContent}
              <script>
                  ${jsContent}
              </script>
          </body>
          </html>
        `;

        const template2 = `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8" />
              <title>Todo App - GrapesJS</title>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/grapesjs/0.21.10/css/grapes.min.css" />
              <link rel="stylesheet" href="https://unpkg.com/grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.css" />
            </head>
            <body>
              <div id="gjs" style="height: 0px; overflow: hidden">
                ${htmlContent}
                <style>
                  ${cssContent}
                </style>
              </div>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/grapesjs/0.21.10/grapes.min.js"></script>
              <script src="https://unpkg.com/grapesjs-preset-webpage"></script>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>
              <script src="https://unpkg.com/grapesjs-blocks-basic"></script>
              <script src="https://unpkg.com/grapesjs-plugin-forms"></script>
              <script src="https://unpkg.com/grapesjs-plugin-export"></script>
              <script>
                // Initialize GrapesJS
                const editor = grapesjs.init({
                  container: "#gjs",
                  height: "100vh",
                  fromElement: true,
                  storageManager: false,
                  plugins: [
                    "grapesjs-preset-webpage",
                    "gjs-blocks-basic",
                    "grapesjs-plugin-forms",
                    "grapesjs-plugin-export",
                  ],
                  pluginsOpts: {
                    "grapesjs-preset-webpage": {
                      modalImportTitle: "Import Template",
                      modalImportLabel:
                        '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
                      modalImportContent: function (editor) {
                        return (
                          editor.getHtml() + "<style>" + editor.getCss() + "</style>"
                        );
                      },
                    },
                  },
                  canvas: {
                    styles: [
                      "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css",
                    ],
                  },
                });
                window.editor = editor;
                ${editablejs}
              </script>
            </body>
          </html>
        `;

        const back = `${backend}/project/update`;

        const response = await fetch(back, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            project_id: id,
            non_editable_file: template,
            editable_file: template2,
            user_id: user.id,
          }),
        });

        let outputString = "";
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let doneReading = false;
        while (!doneReading) {
          const { done, value } = await reader.read();
          if (done) {
            doneReading = true;
            break;
          }
          outputString += decoder.decode(value);
        }

        const object = JSON.parse(outputString);
        setTemplate5(object.editable_file);
        setMessages(object.messages);

        if (response.ok) {
          handleSuccess("HTML saved successfully!");
        } else {
          console.log("Failed to save HTML:", response);
          handleSuccess("Failed to save HTML.");
        }
      } catch (error) {
        console.error("Error saving HTML:", error);
        handleSuccess("An error occurred while saving.");
      }
    } else {
      console.error("Editor not found in iframe");
      handleSuccess(
        "Editor is not accessible. Please ensure the editor is loaded correctly."
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error("Failed to fetch token");
          return;
        }

        const response = await fetch(`${backend}/project/?projectId=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch data:", response.statusText);
          return;
        }

        const data = await response.json();
        setTemplate5(data.editable_file);
        setMessages(data.messages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, getToken]);
  const fetchPromptResponse = async (message) => {
    try {
      const response = await fetch(`${backend}/prompt/reprompt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          file: template5,
          prompt: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const aidata = await response.text();

      const regex = /<iitg_ai_file>([\s\S]*?)<\/iitg_ai_file>/;
      const cleanResponse = aidata.replace(regex, "").trim();
      const match = aidata.match(regex);

      if (match && match[1]) {
        const aiContent = match[1].trim();
        return {
          project_id: id,
          message: cleanResponse,
          user_type: "AI",
          website_content: aiContent,
          user_id: user.id,
        };
      } else {
        throw new Error("No content found inside <iitg_ai_file> tags.");
      }
    } catch (error) {
      console.log("Error fetching AI response:", error);
      return null;
    }
  };
  // Refactored fetchAiResponse to return the AI message instead of setting state
  const fetchAiResponse = async (message) => {
    try {
      const response = await fetch(`${backend}/prompt/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          prompt: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const aidata = await response.text();

      const regex = /<iitg_ai_file>([\s\S]*?)<\/iitg_ai_file>/;
      const cleanResponse = aidata.replace(regex, "").trim();
      const match = aidata.match(regex);

      if (match && match[1]) {
        const aiContent = match[1].trim();
        return {
          project_id: id,
          message: cleanResponse,
          user_type: "AI",
          website_content: aiContent,
          user_id: user.id,
        };
      } else {
        throw new Error("No content found inside <iitg_ai_file> tags.");
      }
    } catch (error) {
      console.log("Error fetching AI response:", error);
      return null;
    }
  };
  const handleMessageClk = async (message_id, project_id) => {
    try {
      console.log(message_id, project_id);
      const response = await fetch(`${backend}/message/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ project_id, message_id, user_id: user.id }),
      });

      // Check if the response is OK (status 200-299)
      if (!response.ok) {
        const errorText = await response.text(); // Read response as text
        throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
      }

      // Try parsing JSON, but check if the response has content first
      const text = await response.text();
      const responseData = text ? JSON.parse(text) : {}; // Parse only if non-empty

      setTemplate5(responseData.website_content);
    } catch (error) {
      console.error("Error fetching message:", error.message);
    }
  };

  const enterMessage = async (e) => {
    e.preventDefault();

    if (inputMessage.trim() !== "") {
      try {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            project_id: id,
            message: inputMessage,
            user_type: "USER",
            website_content: template5,
          },
        ]);

        setInputMessage("");

        setIsLoading(true);
        let aiResponse = "";
        if (template5) {
          aiResponse = await fetchPromptResponse(inputMessage);
        } else {
          aiResponse = await fetchAiResponse(inputMessage);
        }
        if (aiResponse) {
          // Append the AI response after the user's message
          setMessages((prevMessages) => [...prevMessages, aiResponse]);
          setTemplate5(aiResponse.website_content);
        } else {
          throw new Error("AI response is empty or invalid.");
        }

        const payload = {
          project_id: id,
          message: inputMessage,
          website_content: template5 ? template5 : "INITIAL PROMPT",
          user_type: "USER",
          user_id: user.id,
        };

        const response = await fetch(`${backend}/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(payload),
        });
        aiResponse.message = aiResponse.message
          ? aiResponse.message
          : "Here are the changes you suggested to do ";
        console.log(aiResponse);
        const response2 = await fetch(`${backend}/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(aiResponse),
        });
        console.log(response2);
        if (response.ok && response2.ok) {
          // const responseData = await response.json();
        } else {
          console.error("Failed to send message:", response.statusText);
          handleSuccess("Failed to send message. Please try again.");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        handleSuccess("An error occurred while sending the message.");
      } finally {
        saveHtml();
        setIsLoading(false);
      }
    }
  };

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendButtonRef.current.click();
    }
  };

  return (
    <div className="bg-[#13131f] min-h-screen">
      <nav className="fixed top-0 left-0 w-full h-11 md:h-16 flex justify-center items-center bg-primary-color border-b border-gray-500/60 z-50">
        <div className="w-full flex justify-between items-center px-4">
          <a href="/dashboard">
            <div className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-text-color">
                IITG
              </h1>
              <h1 className="text-2xl md:text-3xl font-bold text-text-color-2">
                WebPro
              </h1>
            </div>
          </a>
          <ul className="flex items-center space-x-4 md:space-x-8">
            <li className="hidden sm:block hover:underline">
              <a href="#" className="text-base md:text-lg text-text-color">
                About Us
              </a>
            </li>
            <li className="cursor-pointer">
              <SignedIn>
                <UserButton afterSwitchSessionUrl="/login">
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

      {/* Mobile Toggle Button */}
      <button
        className="fixed bottom-4 right-4 md:hidden z-50 bg-[#2d2351] p-3 rounded-full text-white"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? "✕" : "👁️"}
      </button>

      <main className="pt-16 md:pt-20 h-[calc(110vh-64px)] md:h-[calc(110vh-80px)]">
        <div className="h-full grid grid-cols-1 md:grid-cols-[400px_1fr] gap-4 p-4">
          {/* Chat Section */}
          <div className="flex flex-col min-h-96 scroll-auto relative order-2 md:order-1">
            <div className="flex-grow overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-track-[#1c1c28] scrollbar-thumb-[#2a2a3d]">
              {messages &&
                messages.map((message, index) => (
                  <button
                  disabled={isLoading}
                    className="w-full"
                    onClick={() =>
                      handleMessageClk(message._id, message.project_id)
                    }
                  >
                    {" "}
                    <div
                      key={index}
                      className={`w-[100%] flex ${
                        message.user_type === "USER"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg p-3 md:p-4 text-white mb-3 md:mb-4 min-h-[40px] inline-block max-w-[85%] ${
                          message.user_type === "USER"
                            ? "bg-[#1e1e2d] text-right"
                            : "bg-[#2d2351] text-left"
                        }`}
                      >
                        {message.message}
                      </div>
                    </div>
                  </button>
                ))}
            </div>

            <div className="sticky bottom-0 bg-[#13131f] pt-2 md:pt-4">
              <form
                className="bg-[#1e1e2d] h-11 overflow-hidden rounded-xl flex items-center gap-2"
                onSubmit={enterMessage}
              >
                <textarea
                  disabled={isLoading} // Disable during loading
                  className="bg-transparent p-3 md:p-4 h-[55px] outline-none text-white text-sm md:text-base flex-grow resize-none placeholder-gray-500"
                  placeholder="Make a website that..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                ></textarea>
                <button
                  ref={sendButtonRef}
                  type="submit"
                  disabled={isLoading} // Disable during loading
                  className={`p-3 md:p-4 text-white hover:text-blue-500 transition-colors duration-200 flex items-center ${
                    isLoading ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  <span className="text-2xl">&#10148;</span>
                </button>
              </form>
              <div className="flex justify-center items-center">
                <button
                  onClick={saveHtml}
                  disabled={isLoading}
                  className="w-[70%] md:w-1/2  h-10 text-base font-['Inter'] font-semibold text-[#38bdf8] bg-[#2d2351] rounded-full self-center mt-6 md:mt-3 shadow-xl hover:bg-[#3a2c6a] hover:scale-105 transition-transform duration-150 ease-out border-0"
                >
                  Save work &nbsp; &#9654;  
                </button>
                <button
                  onClick={() => window.location.reload()}
                  disabled={isLoading}
                  className="w-[70%] md:w-1/2 ml-[20%] h-10 text-base font-['Inter'] font-semibold text-[#38bdf8] bg-[#2d2351] rounded-full self-center mt-6 md:mt-3 shadow-xl hover:bg-[#3a2c6a] hover:scale-105 transition-transform duration-150 ease-out border-0"
                >
                  Reload <span className="text-2xl">&#8634;</span>  
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div
            className={`bg-[#1e1e2d] rounded-lg overflow-hidden order-1 md:order-2 ${
              isSidebarOpen ? "fixed inset-0 z-40 m-4" : "hidden md:block"
            }`}
          >
            <div className="h-full bg-[#2a2a3d] rounded-lg overflow-hidden relative">
              {isLoading && (
                // Spinner Overlay
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center transition-opacity duration-500">
                  <ClipLoader color="#ffffff" size={60} />
                  <p className="text-white mt-4 text-lg fade-in">
                    {aiQuotes[currentQuoteIndex]}
                  </p>
                </div>
              )}
              <iframe
                ref={iframeRef}
                srcDoc={template5}
                frameBorder="0"
                className="w-full h-full"
                title="Rendered Preview"
              ></iframe>
            </div>
          </div>
        </div>
        {/* Save Button
        <div className="px-4 flex mt-4">
          <button
            onClick={saveHtml}
            disabled={isLoading} // Optional: Disable during saving
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            Save Current State
          </button>
        </div> */}
      </main>
    </div>
  );
}
