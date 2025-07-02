document.getElementById("analyzeBtn").addEventListener("click", function () {
  const emailText = document.getElementById("emailInput").value.trim();

  if (emailText === "") {
    alert("Please enter some email text to analyze.");
    return;
  }

  document.getElementById("loading").removeAttribute("hidden");

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

      document.querySelector(".myClass").innerText = 
        `Label: ${data.label} | Risk Score: ${parseFloat(data.risk_score).toFixed(4)}`;

      document.getElementById("classifierResult").innerHTML = `
        <p><strong>Label:</strong> ${data.label}</p>
        <p><strong>Risk Score:</strong> ${parseFloat(data.risk_score).toFixed(4)}</p>
      `;

      document.getElementById("loading").setAttribute("hidden", true);
    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById("classifierResult").innerText = "An error occurred.";
      document.getElementById("loading").setAttribute("hidden", true);
    });



    // Convert risk_score to risk levels (example logic)
    const score = parseFloat(data.risk_score);
    const pieData = {
      high: score >= 0.7 ? score : 0,
      medium: score >= 0.4 && score < 0.7 ? score : 0,
      low: score < 0.4 ? score : 0
    };

    renderPieChart(pieData);
    updateRiskLabel(pieData.high ? "high" : pieData.medium ? "medium" : "low");

});