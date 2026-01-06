document.getElementById("analyzeBtn").addEventListener("click", function () {
  const emailText = document.getElementById("emailInput").value.trim();

  if (emailText === "") {
    alert("Please enter some email text to analyze.");
    return;
  }

  document.getElementById("loading").removeAttribute("hidden");
  // Clear previous results
  document.getElementById("classifierResult").innerHTML = "";

  const formData = new FormData();
  formData.append("text", emailText);

  fetch("http://localhost:8000/predict", {
    method: "POST",
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      document.getElementById("result").innerText = JSON.stringify(data, null, 2);

      // Fix: Check if .myClass exists to avoid null reference error if HTML changes
      const resultDiv = document.querySelector(".myClass");
      if(resultDiv) {
        resultDiv.innerText = `Label: ${data.label} | Risk Score: ${parseFloat(data.risk_score).toFixed(4)}`;
      }

      document.getElementById("classifierResult").innerHTML = `
        <p><strong>Label:</strong> ${data.label}</p>
        <p><strong>Risk Score:</strong> ${parseFloat(data.risk_score).toFixed(4)}</p>
      `;

      document.getElementById("loading").setAttribute("hidden", true);

      // --- Chart & Risk Label Logic (Moved inside .then) ---
      
      const score = parseFloat(data.risk_score);
      const pieData = {
        high: score >= 0.7 ? score : 0,
        medium: score >= 0.4 && score < 0.7 ? score : 0,
        low: score < 0.4 ? score : 0
      };

      // Calculate "Safety" score for the chart (remainder up to 1.0)
      // If score is 0.8 (High risk), Safety is 0.2
      // We will categorize the risk for the chart display logic
      
      renderPieChart(score);
      updateRiskLabel(score);

    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById("classifierResult").innerText = "An error occurred.";
      document.getElementById("loading").setAttribute("hidden", true);
    });
});

let myPieChart; // Global variable to store the chart instance

function renderPieChart(riskScore) {
  const ctx = document.getElementById('pieChart').getContext('2d');
  
  // Destroy previous chart if it exists
  if (myPieChart) {
    myPieChart.destroy();
  }

  // Determine color based on risk
  let riskColor;
  if (riskScore >= 0.7) riskColor = '#ff6384'; // Red
  else if (riskScore >= 0.4) riskColor = '#ffcd56'; // Yellow
  else riskColor = '#36a2eb'; // Blue/Greenish

  const safetyScore = Math.max(0, 1 - riskScore);

  myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Risk', 'Safety'],
      datasets: [{
        data: [riskScore, safetyScore],
        backgroundColor: [
            riskColor,
            '#4bc0c0' // Green/Teal for safety
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'Risk Probability'
        }
      }
    }
  });
}

function updateRiskLabel(score) {
  const resultDiv = document.getElementById("result");
  if (!resultDiv) return;

  let riskLevel = "Low";
  let color = "green";

  if (score >= 0.7) {
    riskLevel = "High";
    color = "red";
  } else if (score >= 0.4) {
    riskLevel = "Medium";
    color = "orange";
  }

  // We can update the styling of the main result box based on risk
  resultDiv.style.borderColor = color;
  resultDiv.style.borderWidth = "2px";
  resultDiv.style.borderStyle = "solid";
  
  // Optionally append the text logic if not already done in the main flow
  // (We already set the text in the main flow, so just updating style here is good)
}