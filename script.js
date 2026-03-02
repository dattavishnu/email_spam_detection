document.getElementById("analyzeBtn").addEventListener("click", function () {
  const emailText = document.getElementById("emailInput").value.trim();

  if (emailText === "") {
    alert("Please enter some text to analyze.");
    return;
  }

  // UI State: Loading
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("emptyState").classList.add("hidden");
  document.getElementById("classifierResult").classList.add("hidden");
  document.getElementById("chartWrapper").classList.add("hidden");

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
      // Simulate a small delay for "AI processing" feel
      setTimeout(() => {
        displayResult(data);
      }, 500);
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An error occurred while communicating with the server.");
      document.getElementById("loading").classList.add("hidden");
      document.getElementById("emptyState").classList.remove("hidden");
    });
});

document.getElementById("darkModeToggle").addEventListener("click", function () {
  document.body.classList.toggle("dark");
  // Re-render chart to update colors for dark mode if result exists
  const resultVisible = !document.getElementById("classifierResult").classList.contains("hidden");
  if (resultVisible && window.lastScore !== undefined) {
    renderPieChart(window.lastScore);
  }
});

let myPieChart;

function displayResult(data) {
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("classifierResult").classList.remove("hidden");
  document.getElementById("chartWrapper").classList.remove("hidden");

  const score = parseFloat(data.risk_score);
  const label = data.label; // "Spam" or "Ham"
  window.lastScore = score; // Store for theme toggling

  // Update Text Elements
  const badge = document.getElementById("badgeLabel");
  const scoreVal = document.getElementById("scoreValue");
  const msg = document.getElementById("resultMessage");

  // Format Score
  scoreVal.innerText = (score * 100).toFixed(2) + "%";

  // Styles based on risk
  badge.className = "badge"; // reset
  if (label === "Spam") {
    badge.classList.add("danger");
    badge.innerText = "Spam Detected";
    msg.innerText = "This message shows high probability of being malicious.";
  } else {
    badge.classList.add("safe");
    badge.innerText = "Safe";
    msg.innerText = "This message appears to be legitimate.";
  }

  renderPieChart(score);
}

function renderPieChart(riskScore) {
  const ctx = document.getElementById('pieChart').getContext('2d');

  if (myPieChart) {
    myPieChart.destroy();
  }

  const isDark = document.body.classList.contains("dark");

  // Vibrant Colors matching CSS Gradients
  // Danger: #ff5f6d, Safe: #43e97b
  const riskColor = '#ff5f6d';
  const safeColor = '#43e97b';
  const emptyColor = isDark ? '#374151' : '#e2e8f0'; // Gray-700 / Gray-200

  // Chart Data Logic
  // If Risk > 0.5 (Spam), we show the Risk % in Red.
  // If Risk < 0.5 (Safe), we show the Safety % (1-Risk) in Green.

  let chartData, chartColors;

  if (riskScore > 0.5) {
    // Spam Case: Show Risk
    chartData = [riskScore, 1 - riskScore];
    chartColors = [riskColor, emptyColor];
  } else {
    // Safe Case: Show Safety Score primarily
    chartData = [(1 - riskScore), riskScore];
    chartColors = [safeColor, emptyColor];
  }

  myPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Score', 'Remaining'],
      datasets: [{
        data: chartData,
        backgroundColor: chartColors,
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '80%', // Thinner ring
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  });
}