document.addEventListener("DOMContentLoaded", () => {
    const askButton = document.getElementById("askButton");
    const questionField = document.getElementById("question");
    const answerField = document.getElementById("answer");
    const spinnerContainer = document.getElementById("spinnerContainer");

    const submitBtn = document.getElementById("submit_btn");
    const userInputField = document.getElementById("user_input");
    const messagesContainer = document.getElementById("messages");

    const createMessage = (text, sender) => {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = `${sender}: ${text}`;
        messageDiv.className = sender === "User" ? "user-message" : "ai-message";
        messagesContainer.appendChild(messageDiv);
    };

    askButton.addEventListener("click", () => {
        const question = questionField.value.trim();
        if (!question) {
            answerField.textContent = "請輸入問題！";
            return;
        }
        spinnerContainer.style.display = "flex";
        fetch("/get_response", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: question }),
        })
        .then((response) => response.json())
        .then((data) => {
            spinnerContainer.style.display = "none";
            answerField.textContent = data.response || "錯誤：" + data.error;
        })
        .catch((error) => {
            spinnerContainer.style.display = "none";
            answerField.textContent = "請求失敗，請檢查網絡或後端服務。";
            console.error("Error:", error);
        });
    });

    submitBtn.addEventListener("click", async () => {
        const userInput = userInputField.value.trim();
        if (userInput === "") {
            displayError("Input cannot be empty.");
            return;
        }
        clearError();
        createMessage(userInput, "User");
        try {
            const response = await fetch("/get
