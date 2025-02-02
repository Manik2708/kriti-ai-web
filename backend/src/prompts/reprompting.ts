export const rePrompting = `This is the context of the file constraints and the actual file. Make changes as per the prompt and don't do any unnecessary change. Make sure to follow
every grapes.js constraint that are:
ULTRAIMPORTANT: Every information is very important inside this, make sure not even a single point is missed.
<system_constraints>
Write code in simple HTML, CSS, JAVASCRIPT ONLY!
IMPORTANT: Don't write code in Typescript, only in HTML, CSS, JAVASCRIPT.
IMPORTANT: Git is NOT available.
IMPORTANT: Don't write any shell script.
IMPORTANT: Write all of the code in a single index.html file and embed all the code of HTML, CSS, JAVASCRIPT into it.
IMPORTANT: Dependencies can't be installed locally. Don't use any dependency, write code from scratch!
ULTRAIMPORTANT: Use Navbar cautiously, don't use any external router to navigate, write the navigation function from scratch.
VERY-VERY-VERY IMPORTANT: Don't give suggestions, always return the whole file with the changes
VERY-VERY-VERY IMPORTANT Don't give reasons like: Previous code remains exactly the same until the navbar section, where we add a new gallery link, even if the new code is same as previous still give the whole code
VERY-VERY-VERY IMPORTANT: Don't do any other change than specified, if user has said to you to change color then only change color WITHOUT MAKING ANY OTHER CHANGE
</system_constraints>
<file_starting_info>
Start the html file by this tag: <iitg_ai_file> and end the file by this tag </iitg_ai_file>
For example:
<iitg_ai_file>
// All the HTML, CSS, JAVASCRIPT code here
</iitg_ai_file>
</file_starting_info>
<grapesjs_constraints>
1. Declare the id of root div as gjs and decare the root div exactly like this:
    <div id="gjs" style="height: 0px; overflow: hidden">
2. Every html component for example pages, buttons, navbar etc should be inside this div
3. The style tag should also be wrapped inside this div and all the css should be inside that style. This implies you should firstly declare this root div then create a style tag inside it and embed css into it.
4. ULTRAIMPORTANT: Load all of these cdns no matter whether they are used or not without changing the versions and links:
    <script src="https://cdnjs.cloudflare.com/ajax/libs/grapesjs/0.21.10/grapes.min.js"></script>
    <script src="https://unpkg.com/grapesjs-preset-webpage"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>
    <script src="https://unpkg.com/grapesjs-blocks-basic"></script>
    <script src="https://unpkg.com/grapesjs-plugin-forms"></script>
    <script src="https://unpkg.com/grapesjs-plugin-export"></script>
5. Initialize the graps.js exactly like this and make it globalized by using window instance:
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
      window.editor = editor; // Making it global
6. Put every functionality of the components like buttons, navbar, checkbox etc inside the event of 'load' of window.editor, like this:
window.editor.on("load", () => {
        const wrapper = window.editor.DomComponents.getWrapper();
        // Insert the javascript here for core functionality
})
7. VERY-VERY-IMPORTANT: Don't put any javascript functionality outside the load event else it will not work
</grapesjs_constraints>
<very_important_info>
I am again explaining this important info, follow all these points. Never ever ignore this:
VERY-VERY-VERY IMPORTANT: Don't give suggestions, always return the whole file with the changes
VERY-VERY-VERY IMPORTANT Don't give reasons like: Previous code remains exactly the same until the navbar section, where we add a new gallery link, even if the new code is same as previous still give the whole code
VERY-VERY-VERY IMPORTANT: Don't do any other change than specified, if user has said to you to change color then only change color WITHOUT MAKING ANY OTHER CHANGE
</very_important_info>
`