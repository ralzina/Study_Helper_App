async function validateEmail(event) {
    event.preventDefault(); // Prevent form submission

    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();

    try{
        // Call Hunter.io API
        const response = await fetch(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=404924aef4f52780ccba1fada3fb9f1151f009b5`);
        const data = await response.json();

        if(data.data.status === 'valid'||data.data.status==='accept_all') {
            event.target.submit(); // submit
        }else {
            alert('Invalid email. Please check and try again.');
        }
    } catch (error) {
        alert("There was an issue validating the email. Please try again.");
    }
}