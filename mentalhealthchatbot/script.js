AOS.init({
    once: true, // Animation happens only once
    duration: 1000, // Animation duration in ms
    easing: 'ease-in-out', // Smooth easing
  });
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  const API_KEY = ''; // enter your API_KEY

  const chatContainer = document.getElementById('chat-container');
  const userInput = document.getElementById('user-input');
  const historyList = document.getElementById('history-list');

  let history = JSON.parse(localStorage.getItem("chatHistory")) || [];

  function saveToHistory(user, bot) {
    const entry = { user, bot, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    history.push(entry);
    localStorage.setItem("chatHistory", JSON.stringify(history));
    renderHistory();
  }

  function renderHistory() {
    historyList.innerHTML = '';
    history.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${item.time}:</strong> ${item.user}`;
      li.classList.add('cursor-pointer', 'hover:underline');
      li.onclick = () => {
        addMessageToChat(item.user, 'user');
        addMessageToChat(item.bot, 'assistant');
      };
      historyList.appendChild(li);
    });
  }
  function clearHistory() {
  if (confirm("Are you sure you want to delete all chat history?")) {
  localStorage.removeItem("chatHistory");
  history = [];
  renderHistory();
  alert("Chat history deleted.");
}
}

  const sidebar = document.getElementById("sidebar");
  const toggleSidebarBtn = document.getElementById("toggleSidebar");

toggleSidebarBtn.addEventListener("click", () => {
  sidebar.classList.toggle("-translate-x-full");
  sidebar.classList.toggle("translate-x-0");
});
  async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessageToChat(userMessage, 'user');
    userInput.value = '';

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: userMessage }] }] })
      });

      const data = await response.json();
      const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response received.";
      addMessageToChat(assistantMessage, 'assistant');
      saveToHistory(userMessage, assistantMessage);
      speakResponse(assistantMessage);
    } catch (error) {
      console.error('Error:', error);
      addMessageToChat('⚠️ Error processing your request. Please try again.', 'error');
    }
  }

  function addMessageToChat(message, role) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'}`;
    const contentDiv = document.createElement('div');
    contentDiv.className = `p-4 rounded-2xl max-w-[80%] shadow-md text-base leading-relaxed ${
      role === 'user' ? 'bg-blue-100 text-green-700 self-end rounded-br-none' :
      role === 'error' ? 'bg-red-100 text-red-800' :
      'bg-white text-gray-800 self-start rounded-bl-none'
    }`;
    contentDiv.innerHTML = formatMessage(message);

    const timeStamp = document.createElement('div');
    timeStamp.className = 'text-xs text-gray-700 mt-2 text-right';
    timeStamp.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    contentDiv.appendChild(timeStamp);
    messageDiv.appendChild(contentDiv);
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function formatMessage(message) {
  return message
  // Bold text with **double asterisks**
  .replace(/\*\*\s*(.*?)\s*\*\*/g, '<b>$1</b>')
  // Bold text with single asterisk at the start of a word/line
  .replace(/(^|\s)\*\s*(\S.*?)(?=\s|$)/g, '$1<b>$2</b>')
  // Replace newlines with <br>
  .replace(/\n/g, '<br>');
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }

  function quickStart(text) {
    userInput.value = text;
    sendMessage();
  }

  // Speech Recognition
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';

  function startSpeech() {
const input = document.getElementById("user-input");
input.placeholder = "Listening...";
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.start();

recognition.onresult = function(event) {
  input.value = event.results[0][0].transcript;
  input.placeholder = "Ask me anything...";
  sendMessage();
};

recognition.onerror = function() {
  input.placeholder = "Ask me anything...";
};
}

  // Voice Output
  function speakResponse(text) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    // synth.speak(utter); // Uncomment if you want voice output
  }
  renderHistory();

  document.querySelectorAll(".faq-question").forEach(button => {
          button.addEventListener("click", function() {
              const answer = this.nextElementSibling;
              const icon = this.querySelector(".faq-icon");

              // Toggle answer display
              answer.style.display = (answer.style.display === "block") ? "none" : "block";

              // Rotate arrow icon
              icon.style.transform = (answer.style.display === "block") ? "rotate(180deg)" : "rotate(0deg)";
          });
      });
