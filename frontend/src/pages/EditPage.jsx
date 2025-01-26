import React, { useState, useRef } from "react";
import {
  useAuth,
  RedirectToSignIn,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { useParams } from "react-router-dom";

export default function EditPage({ name, messagesArray }) {
  const [messages, setMessages] = useState(messagesArray);
  const [inputMessage, setInputMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isSignedIn, getToken } = useAuth();
  const {id} = useParams();
  const user = useUser().user;
  const iframeRef = useRef(null);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const saveHtml = async () => {
    const iframe = iframeRef.current;
    const indexResponse = await fetch("/uploads/index.html");
    const indexHtml = await indexResponse.text();
    // Improved regex to capture the entire script block
    const scriptMatch = indexHtml.match(
      /window\.editor\.on\("load",[\s\S]*?(?=\s*<\/script>)/
    );
    const editablejs = scriptMatch ? scriptMatch[0] : "";
    //console.log("Extracted JS:", editablejs); // Debug log
    // Check if iframe and editor are accessible
    if (iframe && iframe.contentWindow && iframe.contentWindow.editor) {
      const editor = iframe.contentWindow.editor;
      //console.log("Editor:", editor);
      try {
        // Retrieve HTML, CSS, and JS from the editor
        const htmlContent = editor.getHtml();
        const cssContent = editor.getCss();
        const jsContent = editor.getJs ? editor.getJs() : ""; // Ensure getJs exists

        // Construct the final HTML template
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

    <!-- GrapesJS Core CSS -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/grapesjs/0.21.10/css/grapes.min.css"
    />
    <link
      rel="stylesheet"
      href="https://unpkg.com/grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.css"
    />
  </head>
  <body>
    <!-- GrapesJS editable area -->
    <div id="gjs" style="height: 0px; overflow: hidden">
      <!-- HERE WE CAN PUT THE INSIDE HTML CODE OF GJS WHICH IS STORED IN DATABASE  -->
      ${htmlContent}

      <!-- Styles -->
      <style>
        /* HERE ALL CSS THAT COMES FROM BACKEND SHOULD BE KEPT HERE ONLY DYNAMIC */
        ${cssContent}
      </style>
    </div>

    <!-- Scripts -->
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
        //  console.log("Constructed Template:", template);
        //   console.log("Constructed EditableTemplate:", template2);
        console.log("User:", template);
        console.log("USERRR2" , template2);

        // Send the HTML template to the backend
        const response = await fetch("http://localhost:4000/project", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
            "Access-Control-Request-Method": "PUT",
            "Access-Control-Allow-Origin": "http://localhost:4000"
          },
          body: JSON.stringify({
            project_id:id,
            non_editable_file: template,
            editable_file: template2,
          }),
        });

        if (response.ok) {
          alert("HTML saved successfully!");
        } else {
          alert("Failed to save HTML.");
        }
      } catch (error) {
        console.error("Error saving HTML:", error);
        alert("An error occurred while saving.");
      }
    } else {
      console.error("Editor not found in iframe");
      alert(
        "Editor is not accessible. Please ensure the editor is loaded correctly."
      );
    }
  };
  async function fetchData() {
    try {
        const token = await getToken();
      if (!token) {
        console.error("Failed to fetch token");
        return;
      }
  
      const response = await fetch(`http://localhost:4000/project/?projectId=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send the token in the header
        },
      });
  
      if (!response.ok) {
        console.error("Failed to fetch data:", response.statusText);
        return;
      }
  
      const data = await response.json(); 
      console.log("Response data:", data); 
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  fetchData();
  const enterMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== "") {
      setMessages([...messages, [1, inputMessage]]);
      setInputMessage("");
    }
  };
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }
  return (
    <div className="bg-[#13131f] min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full h-16 md:h-20 flex justify-center items-center bg-primary-color border-b border-gray-500/60 z-50">
        <div className="w-11/12 flex justify-between items-center px-4">
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-text-color">
              Web
            </h1>
            <h1 className="text-2xl md:text-3xl font-bold text-text-color-2">
              Weaver
            </h1>
          </div>
          <ul className="flex items-center space-x-4 md:space-x-8">
            <li className="hidden sm:block hover:underline">
              <a href="#" className="text-base md:text-lg text-text-color">
                About Us
              </a>
            </li>
            <li className="hidden sm:block hover:underline">
              <a href="#" className="text-base md:text-lg text-text-color">
                Contact
              </a>
            </li>
            <li className="cursor-pointer">
              <SignedIn>
                <UserButton afterSwitchSessionUrl="/login" />
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

      <main className="pt-16 md:pt-20 h-[calc(100vh-64px)] md:h-[calc(100vh-80px)]">
        <div className="h-full grid grid-cols-1 md:grid-cols-[400px_1fr] gap-4 p-4">
          {/* Chat Section */}
          <div className="flex flex-col h-full relative order-2 md:order-1">
            <div className="flex-grow overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-track-[#1c1c28] scrollbar-thumb-[#2a2a3d]">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`w-[100%] flex ${
                    message[0] ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg p-3 md:p-4 text-white mb-3 md:mb-4 min-h-[40px] inline-block max-w-[85%] ${
                      message[0]
                        ? "bg-[#1e1e2d] text-right"
                        : "bg-[#2d2351] text-left"
                    }`}
                  >
                    {message[1]}
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-[#13131f] pt-2 md:pt-4">
              <form
                className="bg-[#1e1e2d] rounded-xl flex items-center gap-2"
                onSubmit={enterMessage}
              >
                <textarea
                  className="bg-transparent p-3 md:p-4 h-[45px] text-white text-sm md:text-base flex-grow resize-none placeholder-gray-500"
                  placeholder="Make a website that..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                ></textarea>
                <button
                  type="submit"
                  className="p-3 md:p-4 text-white hover:text-blue-500 transition-colors duration-200 flex items-center"
                >
                  <span>▶</span>
                </button>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div
            className={`bg-[#1e1e2d] rounded-lg overflow-hidden order-1 md:order-2 ${
              isSidebarOpen ? "fixed inset-0 z-40 m-4" : "hidden md:block"
            }`}
          >
            <div className="h-full bg-[#2a2a3d] rounded-lg overflow-hidden">
              {/* Attach the ref to the iframe */}
              <iframe
                ref={iframeRef}
                src="/uploads/index.html"
                frameBorder="0"
                className="w-full h-full"
                title="Rendered Preview"
              ></iframe>
            </div>
          </div>
        </div>
        {/* Save Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={saveHtml}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Current State
          </button>
        </div>
      </main>
    </div>
  );
}
