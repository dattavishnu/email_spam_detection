
// let emails = [];

// const emailList = document.getElementById("emailList");
// const classifierResult = document.getElementById("classifierResult");
// const loadingIndicator = document.getElementById("loading");
// const analyzeBtn = document.getElementById("analyzeBtn");
// const emailInput = document.getElementById("emailInput");
// const darkModeToggle = document.getElementById("darkModeToggle");
// const pieChartCtx = document.getElementById("pieChart").getContext("2d");
// const loadDemoBtn = document.getElementById("loadDemo");

// let pieChart;

// function renderEmails() {
//   emailList.innerHTML = "";
//   emails.forEach((email) => {
//     const card = document.createElement("div");
//     card.className = `emailCard ${email.risk}`;
//     card.tabIndex = 0;
//     card.setAttribute("role", "listitem");

//     const subject = document.createElement("div");
//     subject.className = "emailSubject";
//     subject.textContent = email.subject;

//     const snippet = document.createElement("div");
//     snippet.className = "emailSnippet";
//     snippet.textContent = email.body.slice(0, 60) + "...";

//     card.appendChild(subject);
//     card.appendChild(snippet);

//     card.addEventListener("click", () => {
//       alert(
//         `Subject: ${email.subject}\n\nBody:\n${email.body}\n\nRisk Level: ${email.risk.toUpperCase()}`
//       );
//     });

//     emailList.appendChild(card);
//   });
// }

// function setupPieChart() {
//   const counts = { red: 0, yellow: 0, green: 0 };
//   emails.forEach((e) => counts[e.risk]++);
//   if (pieChart) pieChart.destroy();
//   pieChart = new Chart(pieChartCtx, {
//     type: "pie",
//     data: {
//       labels: ["High Risk", "Moderate Risk", "Safe"],
//       datasets: [
//         {
//           data: [counts.red, counts.yellow, counts.green],
//           backgroundColor: ["#d32f2f", "#fbc02d", "#388e3c"],
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       plugins: {
//         legend: { position: "bottom" },
//       },
//     },
//   });
// }

// // function classifyEmail(text) {
// //   const lowered = text.toLowerCase();
// //   const riskScores = { red: 0, yellow: 0, green: 0 };

// //   const redKeywords = ["verify", "bank", "password", "account", "login"];
// //   const yellowKeywords = ["reset", "urgent", "immediately", "action", "alert"];
// //   const greenKeywords = ["thank", "meeting", "team", "schedule", "receipt"];

// //   const words = lowered.split(/\W+/);

// //   words.forEach((word) => {
// //     if (redKeywords.includes(word)) riskScores.red += 2;
// //     else if (yellowKeywords.includes(word)) riskScores.yellow += 1;
// //     else if (greenKeywords.includes(word)) riskScores.green += 0.5;
// //   });

// //   const total = riskScores.red + riskScores.yellow + riskScores.green || 1;

// //   const percentages = {
// //     red: Math.round((riskScores.red / total) * 100),
// //     yellow: Math.round((riskScores.yellow / total) * 100),
// //     green: Math.round((riskScores.green / total) * 100),
// //   };

// //   return percentages;
// // }

// analyzeBtn.addEventListener("click", () => {
//   const text = emailInput.value.trim();
//   if (!text) {
//     classifierResult.textContent = "Please enter email text to analyze.";
//     classifierResult.style.color = "#d32f2f";
//     return;
//   }

//   loadingIndicator.hidden = false;
//   classifierResult.textContent = "";

//   setTimeout(() => {
//     loadingIndicator.hidden = true;
//     const { red, yellow, green } = classifyEmail(text);

//     classifierResult.innerHTML = `
//       <p><strong>High Risk:</strong> ${red}%</p>
//       <p><strong>Moderate Risk:</strong> ${yellow}%</p>
//       <p><strong>Safe:</strong> ${green}%</p>
//     `;

//     classifierResult.style.color = "#222";
//   }, 1000);
// });


// darkModeToggle.addEventListener("click", () => {
//   document.body.classList.toggle("dark");
//   darkModeToggle.textContent = document.body.classList.contains("dark")
//     ? "☀"
//     : "🌙";
// });

// // loadDemoBtn.addEventListener("click", () => {
// //   loadDemoBtn.addEventListener("click", () => {
// //     const searchText = "Verify your bank account";  // Example search text
  
// //     // Encode the searchText for use in a URL query string
// //     const encodedSearchText = encodeURIComponent(searchText);
  
// //     // Construct the URL with the searchText as a query parameter
// //     const url = `http:localhost:8000=${encodedSearchText}`;
  
// //     // Send the GET request to the backend
// //     fetch(url)
// //       .then(response => response.json())  // Parse the JSON response from the backend
// //       .then(data => {
// //         console.log('Response from backend:', data);
// //       })
// //       .catch(error => {
// //         console.error('Error sending GET request:', error);
// //       });
// //   });
// loadDemoBtn.addEventListener("click", () => {
//   const text = "Verify your bank account now!";  // Example text to predict spam/ham

//   // Send POST request to the backend with text as JSON
//   fetch('https://example.com/predict', {
//     method: 'POST',  // HTTP method
//     headers: {
//       'Content-Type': 'application/json'  // We are sending JSON data
//     },
//     body: JSON.stringify({ text: text })  // The text to be sent as JSON in the request body
//     })
//     .then(response => response.json())  // Parse the JSON response from the backend
//     .then(data => {
//       console.log('Prediction Response:', data);
//       // You can use the 'data' object to update the UI or show the result
//       console.log(`Risk Score: ${data.risk_score}`);
//       console.log(`Label: ${data.label}`);
//     })
//     .catch(error => {
//       console.error('Error sending POST request:', error);
//     });


  
//   renderEmails();
//   setupPieChart();
// });

// renderEmails();
// setupPieChart();


// // Function to format error messages based on the schema
// function formatErrorMessages(response) {
//   if (!response || !response.detail || !Array.isArray(response.detail)) {
//     return "No error details found.";
//   }

//   return response.detail.map(item => {
//     const location = item.loc ? item.loc.join(" > ") : "Unknown location";
//     const message = item.msg || "No message provided";
//     const type = item.type || "Unknown type";

//     // Return a formatted string for each error detail
//     return `Error at ${location}: ${message} (Type: ${type})`;
//   }).join("\n");
// }

// // Example response data (could be dynamic)
// const response = {
//   "detail": [
//     {
//       "loc": ["emailInput", 0],
//       "msg": "Email format is incorrect",
//       "type": "validation_error"
//     },
//     {
//       "loc": ["emailList", 1],
//       "msg": "Unable to load emails",
//       "type": "connection_error"
//     }
//   ]
// };

// // Call the function and log the formatted string
// console.log(formatErrorMessages(response));

// Function to format error messages based on the schema
function formatErrorMessages(response) {
  if (!response || !response.detail || !Array.isArray(response.detail)) {
    return "No error details found.";
  }

  return response.detail.map(item => {
    const location = item.loc ? item.loc.join(" > ") : "Unknown location";
    const message = item.msg || "No message provided";
    const type = item.type || "Unknown type";

    // Return a formatted string for each error detail
    return `Error at ${location}: ${message} (Type: ${type})`;
  }).join("\n");
}

// Function to handle the analyze button click
document.getElementById("analyzeBtn").addEventListener("click", function() {
  // Get the email input value
  const emailText = document.getElementById("emailInput").value.trim();
  
  // Check if the input is empty
  if (emailText === "") {
    alert("Please enter some email text to analyze.");
    return;
  }

  // Show the loading message
  document.getElementById("loading").removeAttribute("hidden");

  // Prepare the payload to send to the backend
  const requestData = {
    email_text: emailText
  };

  // Send the POST request to the backend
;

const formData = new FormData();
formData.append("text", "asasadsadasdas"); // Append your text field here


});
