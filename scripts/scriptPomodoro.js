let timer;
let timeRemaining = 0; // Default
let mode = "study"; // Default

document.getElementById("mode").value="study";

document.getElementById("startButton").addEventListener("click",startTimer);
document.getElementById("stopButton").addEventListener("click",stopTimer);
document.getElementById("pauseButton").addEventListener("click",pauseTimer);

function disable() {
    // Disable inputs and button
    document.getElementById("studyMinutes").disabled = true;
    document.getElementById("studySeconds").disabled = true;
    document.getElementById("breakMinutes").disabled = true;
    document.getElementById("breakSeconds").disabled = true;
    document.getElementById("mode").disabled = true;
}

function enable() {
    document.getElementById("studyMinutes").disabled = false;
    document.getElementById("studySeconds").disabled = false;
    document.getElementById("breakMinutes").disabled = false;
    document.getElementById("breakSeconds").disabled = false;
    document.getElementById("mode").disabled = false;
}

function startTimer() {
    if(timeRemaining==0){
        
        mode = document.getElementById("mode").value;

        let sm = document.getElementById("studyMinutes");
        let ss = document.getElementById("studySeconds");
        let bm = document.getElementById("breakMinutes");
        let bs = document.getElementById("breakSeconds");

        let valid = 1;
        
        // Check if fields are empty or invalid
        if (sm.value === "" || isNaN(parseInt(sm.value)) || parseInt(sm.value) < 0) {
            alert("Please enter a valid number for study minutes (0 or greater).");
            sm.value = 25;
            valid = 0;
        }

        if (ss.value === "" || isNaN(parseInt(ss.value)) || parseInt(ss.value) < 0) {
            alert("Please enter a valid number for study seconds (0 or greater).");
            ss.value = 0;
            valid = 0;
        }

        if (sm.value === "" || isNaN(parseInt(bm.value)) || parseInt(sm.value) < 0) {
            alert("Please enter a valid number for break minutes (0 or greater).");
            bm.value = 5;
            valid = 0;
        }

        if (ss.value === "" || isNaN(parseInt(bs.value)) || parseInt(ss.value) < 0) {
            alert("Please enter a valid number for break seconds (0 or greater).");
            bs.value = 0;
            valid = 0;
        }

        if(valid==0){
            return;
        }

        let studyMinutes = parseInt(sm.value)
        let studySeconds = parseInt(ss.value)
        let breakMinutes = parseInt(bm.value)
        let breakSeconds = parseInt(bs.value)

        // Set initial time based on the mode (Study or Break)
        if (mode === "study") {
            timeRemaining = studyMinutes * 60 + studySeconds;
        } else if (mode === "break") {
            timeRemaining = breakMinutes * 60 + breakSeconds;
        }
    }else{
        const display = document.getElementById("timerDisplay").textContent;

        const [minutesStr, secondsStr] = display.split(":");

        const minutes = parseInt(minutesStr,10) || 0;
        const seconds = parseInt(secondsStr,10) || 0;

        timeRemaining = minutes * 60 + seconds;
    }

    disable();

    document.getElementById("startButton").disabled = true;

    updateTimer();

    
    timer = setInterval(updateTimer, 1000);
}

function next() {
    if(mode=="study"){
        mode = "break";
        document.getElementById("mode").value="break";
    }else if (mode=="break"){
        mode = "study";
        document.getElementById("mode").value = "study";
    }

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
    document.getElementById("timerDisplay").textContent = "00:00";
}

function pauseTimer() {
    clearInterval(timer)
    document.getElementById("startButton").disabled = false;
}