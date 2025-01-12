let timer;
let timeRemaining = 0; // Default

document.getElementById("startButton").addEventListener("click",startTimer);
document.getElementById("stopButton").addEventListener("click",stopTimer);
document.getElementById("pauseButton").addEventListener("click",pauseTimer);

function disable() {
    // Disable inputs and button
    document.getElementById("studyMinutes").disabled = true;
    document.getElementById("studySeconds").disabled = true;
}

function enable() {
    document.getElementById("studyMinutes").disabled = false;
    document.getElementById("studySeconds").disabled = false;
}

function startTimer() {
    if(timeRemaining==0){
        let sm = document.getElementById("studyMinutes");
        let ss = document.getElementById("studySeconds");

        let valid = 1;
        
        // Check if fields are empty or invalid
        if (sm.value === "" || isNaN(parseInt(sm.value)) || parseInt(sm.value) < 0) {
            alert("Please enter a valid number for minutes (0 or greater).");
            sm.value = 25;
            valid = 0;
        }

        if (ss.value === "" || isNaN(parseInt(ss.value)) || parseInt(ss.value) < 0) {
            alert("Please enter a valid number for seconds (0 or greater).");
            ss.value = 0;
            valid = 0;
        }

        if(valid==0){
            return;
        }

        let studyMinutes = parseInt(sm.value)
        let studySeconds = parseInt(ss.value)
        
        timeRemaining = studyMinutes * 60 + studySeconds;

    }else{
        const display = document.getElementById("timerDisplay").textContent;

        const [minutesStr, secondsStr] = display.split(":");

        const minutes = parseInt(minutesStr,10) || 0;
        const seconds = parseInt(secondsStr,10) || 0;

        timeRemaining = minutes * 60 + seconds;
    }

    disable();

    document.getElementById("startButton").disabled = true;
    document.getElementById("dynamicTextarea").disabled = true;
    document.getElementById("exportButton").disabled = true;

    updateTimer();

    // Start countdown
    timer = setInterval(updateTimer, 1000);
}

function next() {

    timeRemaining = 0;
    stopTimer();
}

function updateTimer(){
    if(timeRemaining <= 0){
        clearInterval(timer); // stop timer
        document.getElementById("timerDisplay").textContent = "00:00";
        
        // Play alert sound
        document.getElementById("alertSound").play();
        
        next()
        return;
    }

    // Calculate time left
    let minutes = Math.floor(timeRemaining/60);
    let seconds = timeRemaining % 60;

    // Update the display
    document.getElementById("timerDisplay").textContent =
     `${minutes <10? "0" + minutes: minutes}:${seconds<10 ? "0" + seconds: seconds}`;

     // Decrease time by 1 second
     timeRemaining--;
}

function stopTimer() {
    clearInterval(timer)
    timeRemaining = 0;
    enable();
    document.getElementById("startButton").disabled = false;
    document.getElementById("dynamicTextarea").disabled = false;
    document.getElementById("exportButton").disabled = false;
    document.getElementById("timerDisplay").textContent = "00:00";
}

function pauseTimer() {
    clearInterval(timer)
    document.getElementById("startButton").disabled = false;
}

// Textbox
const textarea = document.getElementById('dynamicTextarea');

textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
});

// Export
async function exportToTxt() {
    const text = document.getElementById("dynamicTextarea").value;

    if(text==""){
        alert("Your text box is empty!");
        return;
    }

    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "exported_text.txt";
    link.click();

    URL.revokeObjectURL(link.href); // Clean up the URL object
/*
    Export as Microsoft Word
    const {Document, Packer, Paragraph} = window.docx;
    const text = document.getElementById("dynamicTextarea").value;
/*

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [new Paragraph(text)]
            }
        ]
    });

    const blob = await Packer.toBlob(doc);
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "active_recall_text.docx";
    link.click();

    URL.revokeObjectURL(link.href);*/
}