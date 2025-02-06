// Textbox
const textarea = document.getElementById('dynamicTextarea');

textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
});

const textarea2 = document.getElementById('dynamicTextarea2');

textarea2.addEventListener('input', () => {
    textarea2.style.height = 'auto';
    textarea2.style.height = `${textarea2.scrollHeight}px`;
});

// Export
async function exportToTxt() {
    let text1 = "Explanation:\n";
    text1 += document.getElementById("dynamicTextarea").value;
    let text2 = document.getElementById("dynamicTextarea2").value;

    if(text1=="Explanation:\n"){
        alert("Your explanation text box is empty!");
        return;
    }

    if(text2){
        text1+="\n\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n\n";
        text1+="Knowledge Gaps:\n";
        text1+= text2;
    }else{
        alert("Congrats, you have no knowledge gaps!");
    }

    const blob1 = new Blob([text1], { type: "text/plain" });
    const link1 = document.createElement("a");

    link1.href = URL.createObjectURL(blob1);
    link1.download = "feynman.txt";
    link1.click();

    URL.revokeObjectURL(link1.href);
}