let front = []; // array to store questions
let back = []; // array to store resolved questions
let flipped = [];
let tested = [];
let testedFlipped = 0;
let n = 0;
let regenerate = 0;
let testing = 0;

function addFlashcard() {
    const frontInput = document.getElementById("dynamicTextarea");
    const frontText = frontInput.value.trim();

    if(frontText==""){
        alert("Please enter a text for the front of the flashcard.");
        return;
    }

    const backInput = document.getElementById("dynamicTextarea2");
    const backText = backInput.value.trim();

    if(backText==""){
        alert("Please enter a text for the back of the flashcard");
        return;
    }

    // Add text to arrays
    front.push(saveText(frontText));
    back.push(saveText(backText));
    flipped.push(0);

    // Clear input box;
    frontInput.value = "";
    backInput.value = "";

    // Reset size
    const event = new Event('submitted');
    frontInput.dispatchEvent(event);
    backInput.dispatchEvent(event);

    // Render UI
    renderFlashcards();
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
    flipped.push(0);

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
        alert("Please enter text before submitting.");
        return;
    }

    addResolved(questions[index],content[index]);

    questions.splice(index,1);
    content.splice(index, 1);

    renderQuestions();
}

function deleteFlashcard(index) {
    front.splice(index,1);
    back.splice(index, 1);
    flipped.splice(index,1);

    renderFlashcards();
}

function editFlashcard(index) {
    const textarea = document.getElementById("dynamicTextarea");
    const textarea2 = document.getElementById("dynamicTextarea2");

    if(textarea.value!=""||textarea2.value!=""){
        alert("Remove or save your text from both textboxes in Create Flashcard!");
        return;
    }

    textarea.value = front[index];
    textarea2.value = back[index];

    front.splice(index,1);
    back.splice(index,1);
    flipped.splice(index,1);

    renderFlashcards();
}

function flipFlash(index) {
    if(flipped[index]==0){
        flipped[index] = 1;
    }else{
        flipped[index] = 0;
    }

    renderFlashcards();
}

function play() {
    tested.push(0);

    renderFlashcards();
}

function newCard(terminate) {
    // Generate random number

    // If only one card is left, return that card
    if(front.length-terminate == 1){
        n = Math.floor(Math.random() * front.length);
        if(tested[n]==1){
            while(tested[n]==1){
                n = (n+1)%front.length;
            }
        }
    }
    // If more than one card is left, make sure that the next
    // flashcard is not the same one before in case the user
    // wanted to retry that flashcard
    else{
        let save = n;
        while(save==n){
            n = Math.floor(Math.random() * front.length);
            if(tested[n]==1){
                while(tested[n]==1){
                    n = (n+1)%front.length;
                }
            }
        }
    }

    // Card starts in the front
    testedFlipped = 0;
}

function renderFlashcards() {
    const container = document.getElementById("resolvedContainer");
    container.innerHTML = ""; // Clear everything

    if(tested.length==0){

        if (front.length>0){
            const questionTitle = document.createElement("h1");
            questionTitle.textContent = "Flashcards:"
            questionTitle.style = "color: white; margin-bottom: 0;"
            container.appendChild(questionTitle);
        }

        // Loop through questions and create UI
        front.forEach((f,index) => {

            const resolvedDiv = document.createElement("div");
            resolvedDiv.className = "typing-sub-container";
            resolvedDiv.style = "margin-top: 20px; overflow: hidden;";

            const resolvedLabel = document.createElement("div");

            if(flipped[index]==0){
                resolvedLabel.innerHTML = f;
                resolvedLabel.className = "typing-title";
                resolvedLabel.style = "font-weight: bolder;font-size: 2rem;line-height: 2.5rem;justify-content: center;min-height: 150px;display:flex;align-items:center;";
            }else{
                resolvedLabel.innerHTML = back[index];
                resolvedLabel.className = "typing-title";
                resolvedLabel.style = "font-size: 2rem;line-height: 2.5rem;justify-content: center;font-weight: 300; min-height: 150px;display:flex;align-items:center;";
            }
            
            const buttonContainer = document.createElement("div");
            buttonContainer.style = "display: flex; align-self: center;";

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.onclick = () => editFlashcard(index);
            editButton.id = "submitButton";
            editButton.style = "margin-right: 10px;";

            const flipButton = document.createElement("button");
            flipButton.textContent = "Flip";
            flipButton.onclick = () => flipFlash(index);
            flipButton.id = "flipButton";
            flipButton.style = "margin-left: 10px; margin-right: 10px;";

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => deleteFlashcard(index);
            deleteButton.id = "deleteButton";
            deleteButton.style = "margin-left: 10px;";

            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(flipButton);
            buttonContainer.appendChild(deleteButton);

            // Append elements
            resolvedDiv.appendChild(resolvedLabel);
            resolvedDiv.appendChild(buttonContainer);

            container.appendChild(resolvedDiv);

            const adjustHeight = () => {
                resolvedLabel.style.height = 'auto';
                resolvedLabel.style.height = `${resolvedLabel.scrollHeight}px`
            };
        
            // Adjust height after content is added
            adjustHeight();
        
            // Resize if the window changes
            window.addEventListener('resize', adjustHeight);
        });

        if (front.length>0){
            const endButtonContainer = document.createElement("div");
            endButtonContainer.style = "display: flex; align-self: center;";

            const exportButton = document.createElement("button");
            exportButton.textContent = "Export";
            exportButton.onclick = () => exportToTxt();
            exportButton.id = "exportButton";
            exportButton.style = "margin-left: 10px;"

            const playButton = document.createElement("button");
            playButton.textContent = "Test";
            playButton.onclick = () => play();
            playButton.id = "flipButton";
            playButton.style = "margin-right: 10px;"

            const clearButton = document.createElement("button");
            clearButton.textContent = "Clear";
            clearButton.onclick = () => {
                front = [];
                back = []; 
                flipped = [];
                renderFlashcards();
            };
            clearButton.id = "stopButton";
            clearButton.style = "margin-right: 10px; margin-left: 10px; margin-top: 20px;";

            endButtonContainer.appendChild(playButton);
            endButtonContainer.appendChild(clearButton);
            endButtonContainer.appendChild(exportButton);

            container.appendChild(endButtonContainer);
        }
    }else{
        const create = document.getElementById("questionApp");
        create.style = "display: none;";

        const questionTitle = document.createElement("h1");
        questionTitle.textContent = "Test Mode:"
        questionTitle.style = "color: white; margin-bottom: 0;"
        container.appendChild(questionTitle);

        // Initialize array to keep track of tested flashcards
        // The length is 1 because the play function adds a 0 to make
        // the length be greater than 0
        if(testing==0){
            testing = 1;
            tested = Array(front.length).fill(0);
        }

        // Check if all cards have been tested and terminate if true
        let terminate = 0;
        for(let i=0;i<tested.length;i++){
            if(tested[i]==1){
                terminate++;
            }
        }
        if(terminate==front.length){
            tested = [];
            testing = 0;
            create.style = "display: flex;";
            renderFlashcards();
            return;
        }

        if(regenerate==1){
            regenerate = 0;
            newCard(terminate);
        }

        const resolvedDiv = document.createElement("div");
        resolvedDiv.className = "typing-sub-container";
        resolvedDiv.style = "margin-top: 20px; overflow: hidden; position: relative;";

        const counter = document.createElement("div");
        counter.style = "position: absolute; top: 0; right: 0; padding: 10px;color: white;";
        counter.textContent = `${terminate} / ${front.length}`;

        // Calculate max scrollHeight for resolvedLabel
        const tempElement = document.createElement("div");
        tempElement.className = "typing-title";
        tempElement.style = "font-size: 2rem;line-height: 2.5rem;justify-content: center;min-height: 150px;display:flex;align-items:center;";

        container.appendChild(tempElement);

        // Measure the height with front[n]
        tempElement.style.fontWeight = "bolder";
        tempElement.innerHTML = front[n];
        const frontHeight = tempElement.scrollHeight

        // Measure the height with back[n]
        tempElement.style.fontWeight = "300";
        tempElement.innerHTML = back[n];
        const backHeight = tempElement.scrollHeight;
        container.removeChild(tempElement);

        // Find the max height
        const maxHeight = Math.max(frontHeight,backHeight);

        resolvedDiv.appendChild(counter);

        const resolvedLabel = document.createElement("div");

        if(testedFlipped==0){
            resolvedLabel.innerHTML = front[n];
            resolvedLabel.className = "typing-title";
            resolvedLabel.style = "font-weight: bolder;font-size: 2rem;line-height: 2.5rem;justify-content: center;min-height: 150px;display:flex;align-items:center;";
        }else{
            resolvedLabel.innerHTML = back[n];
            resolvedLabel.className = "typing-title";
            resolvedLabel.style = "font-size: 2rem;line-height: 2.5rem;justify-content: center;font-weight: 300; min-height: 150px;display:flex;align-items:center;";
        }

        const buttonContainer = document.createElement("div");
        buttonContainer.style = "display: flex; align-self: center;";

        if(front.length>1){
            const retryButton = document.createElement("button");
            retryButton.textContent = "Retry";
            retryButton.onclick = () => {
                regenerate = 1;
                renderFlashcards();
            };
            retryButton.id = "deleteButton";
            retryButton.style = "margin-right: 10px;";
            buttonContainer.appendChild(retryButton);
        }

        const flipButton = document.createElement("button");
        flipButton.textContent = "Flip";
        flipButton.onclick = () => {
            testedFlipped = Math.abs(testedFlipped-1);
            renderFlashcards();
        };

        flipButton.id = "flipButton";
        flipButton.style = "margin-left: 10px; margin-right: 10px;";

        const masterButton = document.createElement("button");
        masterButton.textContent = "Mastered";
        masterButton.onclick = () => {
            tested[n] = 1;
            regenerate = 1;
            renderFlashcards();
        };
        masterButton.id = "submitButton";
        masterButton.style = "margin-left: 10px;";

        // moved up buttonContainer.appendChild(retryButton);
        buttonContainer.appendChild(flipButton);
        buttonContainer.appendChild(masterButton);

        // Append elements
        resolvedDiv.appendChild(resolvedLabel);
        resolvedDiv.appendChild(buttonContainer);

        container.appendChild(resolvedDiv);

        const adjustHeight = () => {
            resolvedLabel.style.height = 'auto';
            //resolvedLabel.style.height = `${resolvedLabel.scrollHeight}px`
            resolvedLabel.style.height = `${maxHeight}px`
        };
    
        // Adjust height after content is added
        adjustHeight();
    
        // Resize if the window changes
        window.addEventListener('resize', adjustHeight);

        const stopButton = document.createElement("button");
        stopButton.textContent = "Stop";
        stopButton.onclick = () => {
            tested = [];
            testing = 0;
            create.style = "display: block;";
            renderFlashcards();
        };
        stopButton.id = "stopButton";
        stopButton.style = "margin-top: 20px;";

        container.append(stopButton);
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

const textarea2 = document.getElementById('dynamicTextarea2');

textarea2.addEventListener('input', () => {
    textarea2.style.height = 'auto';
    textarea2.style.height = `${textarea2.scrollHeight}px`;
});

textarea2.addEventListener('submitted', () => {
    textarea2.style.height = 'auto';
    textarea2.style.height = `${textarea2.scrollHeight}px`;
});

// Export
async function exportToTxt() {
    let text = "";
    front.forEach((f,index) => {
        text+=htmlToTxt(f);
        text+="\n+-+-+-+-+-+-+-+-+-+-+-+-+\n";
        text+=htmlToTxt(back[index]);
        text+="\n\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n\n";
    })

    text = text.slice(0,-47);

    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "flashcards.txt";
    link.click();

    URL.revokeObjectURL(link.href);
}

// Quick Access
// Allows you to upload a file with the same format as exported flashcards
// to automatically generate all the flashcards
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
        // Don't push to the front or back arrays yet in case the file
        // is not formatted properly
        let checkfront = [];
        let checkback = [];

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
            checkfront.push(content[0]);
            checkback.push(content[1]);
        }

        // If the file was formatted properly with no errors, add checkfront and checkback
        // to the actual front and back arrays
        for(let i=0;i<checkfront.length;i++){
            front.push(checkfront[i]);
            back.push(checkback[i]);
            flipped.push(0);
        }
        
        renderFlashcards();
    }

    reader.readAsText(file);
}

function clearFile() {
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    fileInput.value = '';
    fileNameDisplay.textContent = '';
}