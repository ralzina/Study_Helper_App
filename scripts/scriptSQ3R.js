let questions = []; // array to store questions
let content = []; // array to store question content
let resolved = []; // array to store resolved questions
let resolvedContent = []; // array to store resolved question content

function addQuestion() {
    const questionInput = document.getElementById("dynamicTextarea");
    const questionText = questionInput.value.trim();

    if(questionText==""){
        alert("Please enter a question");
        return;
    }

    // Add question to array
    questions.push(saveText(questionText));

    // Clear input box;
    questionInput.value = "";
    const event = new Event('submitted');
    questionInput.dispatchEvent(event);

    // Render UI
    saveContent();
    content.push('');
    renderQuestions();
}

function saveText(answer) {
    const formattedText = answer.replace(/\n/g, "<br>");
    return formattedText;
}

function htmlToTxt(htmlTxt) {
    const normalText = htmlTxt.replace(/<br>/g, "\n");
    return normalText;
}

function addResolved(question, answer){
    resolved.push(question);
    resolvedContent.push(saveText(answer));

    renderResolved();
}

function deleteQuestion(index) {
    saveContent();

    questions.splice(index,1);
    content.splice(index,1);

    renderQuestions();
}

function resolveQuestion(index) {
    saveContent();

    if(content[index]==""){
        alert("Please answer your question before resolving.");
        return;
    }

    addResolved(questions[index],content[index]);

    questions.splice(index,1);
    content.splice(index, 1);

    renderQuestions();
}

function deleteResolved(index) {
    resolved.splice(index,1);
    resolvedContent.splice(index, 1);

    renderResolved();
}

function editResolved(index) {
    saveContent();

    questions.push(htmlToTxt(resolved[index]));
    content.push(htmlToTxt(resolvedContent[index]));

    resolved.splice(index,1);
    resolvedContent.splice(index,1);

    renderQuestions();
    renderResolved();
}

function saveContent() {
    const textareas = document.querySelectorAll("#questionInput textarea");
    content = [];

    textareas.forEach((textarea) => {
        content.push(textarea.value);
    });
}

function renderQuestions() {

    const container = document.getElementById("questionsContainer");
    container.innerHTML = ""; // Clear everything

    if (questions.length>0){
        const questionTitle = document.createElement("h1");
        questionTitle.textContent = "Questions:"
        questionTitle.style = "color: white; margin-bottom: 0;"
        container.appendChild(questionTitle);
    }

    // Loop through questions and create UI
    questions.forEach((question,index) => {

        const questionDiv = document.createElement("div");
        questionDiv.className = "typing-sub-container";
        questionDiv.style = "margin-top: 20px";
        questionDiv.id = "questionInput";

        const questionLabel = document.createElement("label");
        questionLabel.innerHTML = question;
        questionLabel.className = "typing-title";

        const answerInput = document.createElement("textarea");
        answerInput.placeholder = "Type your answer...";
        answerInput.id = "dynamicTextarea";
        answerInput.value = content[index] || "";

        const buttonContainer = document.createElement("div");
        buttonContainer.style = "display: flex; align-self: center;";

        const resolveButton = document.createElement("button");
        resolveButton.textContent = "Resolve";
        resolveButton.onclick = () => resolveQuestion(index);
        resolveButton.id = "submitButton";
        resolveButton.style = "margin-right: 10px;";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteQuestion(index);
        deleteButton.id = "deleteButton";
        deleteButton.style = "margin-left: 10px;";

        buttonContainer.appendChild(resolveButton);
        buttonContainer.appendChild(deleteButton);

        // Append elements
        questionDiv.appendChild(questionLabel);
        questionDiv.appendChild(answerInput);
        questionDiv.appendChild(buttonContainer);

        container.appendChild(questionDiv);

        const adjustHeight = () => {
            answerInput.style.height = 'auto';  // Reset height first
            answerInput.style.height = `${answerInput.scrollHeight}px`; // Adjust based on content
        }
    
        // Adjust height after content is added
        adjustHeight();
    
        // Resize if input is added changes
        answerInput.addEventListener('input', adjustHeight);
    });

    if(questions.length>0){
        const clearButton = document.createElement("button");
        clearButton.textContent = "Clear";
        clearButton.onclick = () => {
            questions = [];
            content = [];
            renderQuestions();
        };
        clearButton.id = "deleteButton";
        container.appendChild(clearButton);
    }
}

function renderResolved() {
    const container = document.getElementById("resolvedContainer");
    container.innerHTML = ""; // Clear everything

    if (resolved.length>0){
        const questionTitle = document.createElement("h1");
        questionTitle.textContent = "Resolved Questions:"
        questionTitle.style = "color: white; margin-bottom: 0;"
        container.appendChild(questionTitle);
    }

    // Loop through questions and create UI
    resolved.forEach((resolve,index) => {

        const resolvedDiv = document.createElement("div");
        resolvedDiv.className = "typing-sub-container";
        resolvedDiv.style = "margin-top: 20px; overflow: hidden;";

        const resolvedLabel = document.createElement("div");
        resolvedLabel.innerHTML = resolve;
        resolvedLabel.className = "typing-title";
        resolvedLabel.style = "font-weight: bolder;";

        const resolvedInput = document.createElement("div");
        resolvedInput.innerHTML = resolvedContent[index];
        resolvedInput.className = "resolvedInput";
        
        const buttonContainer = document.createElement("div");
        buttonContainer.style = "display: flex; align-self: center;";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = () => editResolved(index);
        editButton.id = "submitButton";
        editButton.style = "margin-right: 10px;";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteResolved(index);
        deleteButton.id = "deleteButton";
        deleteButton.style = "margin-left: 10px;";

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        // Append elements
        resolvedDiv.appendChild(resolvedLabel);
        resolvedDiv.appendChild(resolvedInput);
        resolvedDiv.appendChild(buttonContainer);

        container.appendChild(resolvedDiv);

        const adjustHeight = () => {
            resolvedDiv.style.height = 'auto';  // Reset height first
            resolvedDiv.style.height = `${resolvedInput.scrollHeight+ resolvedLabel.scrollHeight + 130}px`; // Adjust based on content
        };
    
        // Adjust height after content is added
        adjustHeight();
    
        // Resize if the window changes
        window.addEventListener('resize', adjustHeight);
    });

    if (resolved.length>0){

        const endButtonContainer = document.createElement("div");
        endButtonContainer.style = "display: flex; align-self: center;";

        const exportButton = document.createElement("button");
        exportButton.textContent = "Export";
        exportButton.onclick = () => exportToTxt();
        exportButton.id = "exportButton";
        exportButton.style = "margin-right: 10px;"

        const clearButton = document.createElement("button");
        clearButton.textContent = "Clear";
        clearButton.onclick = () => {
            resolved = [];
            resolvedContent = []; 
            renderResolved();
        };
        clearButton.id = "stopButton";
        clearButton.style = "margin-left: 10px; margin-top: 20px;";

        endButtonContainer.appendChild(exportButton);
        endButtonContainer.appendChild(clearButton);

        container.appendChild(endButtonContainer);
    }
}

// Textbox
const textarea = document.getElementById('dynamicTextarea');

textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
});

textarea.addEventListener('submitted', () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
});

// Export
async function exportToTxt() {
    let text = "";
    resolved.forEach((resolve,index) => {
        text+=htmlToTxt(resolve);
        text+="\n+-+-+-+-+-+-+-+-+-+-+-+-+\n";
        text+=htmlToTxt(resolvedContent[index]);
        text+="\n\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n\n";
    })

    text = text.slice(0,-47);

    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "resolved_questions.txt";
    link.click();

    URL.revokeObjectURL(link.href);
}

// Quick Access
// Allows you to upload a file with the same format as exported questions
// to automatically generate all the questions
function updateFileName() {
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      fileNameDisplay.textContent = file.name;  // Show the file name
    }
}

function processFile() {
    const fileInput = document.getElementById("fileInput");

    // Check if file was selected
    if(fileInput.files.length === 0) {
        alert("Please select a file first!");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    clearFile();

    reader.onerror = function() {
        alert("Error reading the file. Please try again.");
    }

    reader.onload = function () {
        // Don't push to resovled or resolvedContent arrays yet in case the file
        // is not formatted properly
        let checkresolved = [];
        let checkresolvedContent = [];

        let fileContents = reader.result;

        fileContents = saveText(fileContents);

        const flashcards = fileContents.split("<br><br>+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+<br><br>");
        console.log(flashcards);
        for(let i=0;i<flashcards.length;i++){
            let content = flashcards[i].split("<br>+-+-+-+-+-+-+-+-+-+-+-+-+<br>");
            console.log(content);
            if(content.length!=2){
                alert("File not formatted as a flashcard exported file. Remember to upload the file you exported from this learning module.");
                return;
            }
            checkresolved.push(content[0]);
            checkresolvedContent.push(content[1]);
        }

        // If the file was formatted properly with no errors, add checkfront and checkback
        // to the actual front and back arrays
        for(let i=0;i<checkresolved.length;i++){
            resolved.push(checkresolved[i]);
            resolvedContent.push(checkresolvedContent[i]);
        }
        
        renderResolved();
    }

    reader.readAsText(file);
}

function clearFile() {
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    fileInput.value = '';
    fileNameDisplay.textContent = '';
}