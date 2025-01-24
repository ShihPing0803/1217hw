document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submit_btn");
    const userInputField = document.getElementById("user_input");
    const messagesContainer = document.getElementById("messages");

    // Helper function to create a message
    const createMessage = (text, sender) => {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = `${sender}: ${text}`;
        messageDiv.className = sender === "User" ? "user-message" : "ai-message";
        messagesContainer.appendChild(messageDiv);
    };

    // Handle click event
    submitBtn.addEventListener("click", async () => {
        const userInput = userInputField.value.trim();

        // Input validation
        if (userInput === "") {
            displayError("Input cannot be empty.");
            return;
        }

        clearError();

        // Display user message
        createMessage(userInput, "User");

        // Fetch AI response
        try {
            const response = await fetch("/get_response", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({ user_input: userInput }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            createMessage(data.response || "Error occurred while processing.", "AI");
        } catch (error) {
            console.error("Error:", error);
            createMessage("An error occurred. Please try again later.", "AI");
        }
    });

    // Helper function to display error messages
    const displayError = (message) => {
        let errorElement = document.getElementById("error_message");
        if (!errorElement) {
            errorElement = document.createElement("div");
            errorElement.id = "error_message";
            errorElement.className = "error";
            userInputField.insertAdjacentElement("afterend", errorElement);
        }
        errorElement.textContent = message;
    };

    // Helper function to clear error messages
    const clearError = () => {
        const errorElement = document.getElementById("error_message");
        if (errorElement) {
            errorElement.remove();
        }
    };
});