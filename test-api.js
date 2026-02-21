const baseUrl = "https://bit-cavista.onrender.com";

async function test() {
    const sessionId = "DEMO_SESSION_123";

    // Test 1: getScore
    const res1 = await fetch(`${baseUrl}/api/score/${sessionId}`);
    console.log("getScore status:", res1.status);
    console.log("getScore body:", await res1.text());

    // Test 2: getPrediction
    const res2 = await fetch(`${baseUrl}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, days: 90 })
    });
    console.log("getPrediction status:", res2.status);
    console.log("getPrediction body:", await res2.text());
}

test();
