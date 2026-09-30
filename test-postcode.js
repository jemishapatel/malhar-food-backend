const fetch = require('node-fetch');

(async () => {
  try {
    // Local dev: 'http://localhost:5000/api/orders/serviceable-postcodes'
    const response = await fetch('http://13.134.230.136:3121/api/orders/serviceable-postcodes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        postcode: "395007",
        serviceable: true,
        quick_delivery_available: true,
        estimated_minutes: 20,
        delivery_charge: 0
      })
    });
    const data = await response.json();
    console.log("Test Result:", data);
  } catch (error) {
    console.error("Test Failed:", error);
  }
})();
