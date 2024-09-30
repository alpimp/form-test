const queue = [];
const logFile = [];
const processingInterval = 15 * 60 * 1000; // 15 minutes
const maxProcessingTime = 24 * 60 * 60 * 1000; // 24 hours

export async function onRequestPost(context) {
  try {
    const response = await handleRequest(context);
    return response;
  } catch (e) {
    console.error(e);
    return new Response("Error sending message", { status: 500 });
  }
}

async function handleRequest({ request, env }) {
  const formData = await request.formData();
  const get_ip = request.headers.get("CF-Connecting-IP");
  const body = createBody(get_ip, formData, env.SECRET1);

  // Send the form data to the API endpoint
  const apiResponse = await Promise.race([
    fetch('http://httpbin.org/post', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000)),
  ]);

  const responseCode = apiResponse.status;

  if (apiResponse.ok) {
    return new Response(getThankYouPage(responseCode, formData), {
      headers: { 'Content-Type': 'text/html' },
    });
  } else {
    queue.push({ formData, timestamp: Date.now() });
    await processQueue(); // Call processQueue here
    return new Response(getThankYouPage(responseCode, formData), {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

async function processQueue() {
  const now = Date.now();

  for (let i = queue.length - 1; i >= 0; i--) {
    const { formData, timestamp } = queue[i];

    if (now - timestamp >= maxProcessingTime) {
      logFile.push({ formData, timestamp, status: 'No response from server' });
      queue.splice(i, 1);
    } else {
      const body = createBody("", formData, ""); // Modify as necessary

      try {
        const apiResponse = await fetch('http://httpbin.org/post', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        });

        if (apiResponse.ok) {
          logFile.push({ formData, timestamp, status: 'Success', responseCode: apiResponse.status });
        } else {
          logFile.push({ formData, timestamp, status: 'Error', responseCode: apiResponse.status });
        }
        queue.splice(i, 1);
      } catch (error) {
        // Optionally retry logic can be added here if needed
      }
    }
  }

  // Schedule the next processing of the queue if there are items left
  if (queue.length > 0) {
    setTimeout(processQueue, processingInterval);
  }
}

function createBody(get_ip, formData, secret) {
  return {
    ip_address: get_ip,
    alpha_val: formData.get("alpha_val"),
    demo_val: formData.get("demo_val"),
    display: formData.get("display"),
    touch: formData.get("touch"),
    lang: formData.get("lang"),
    tz: formData.get("tz"),
    feedback_msg: formData.get("feedback_msg"),
    secret: secret,
    errors: null,
    msg: "I sent this to the fetch",
  };
}

function getThankYouPage(responseCode, formData) {
  // Construct your thank you page here
const body = createBody(get_ip, formData, secret);
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head><meta charset="UTF-8"><title>Thank You</title></head>
      <body>
        <h1>Thank You!</h1>
        <p>Your response has been recorded.</p>
        <p>Status Code: ${responseCode}</p>
                   <p>${body}</p>
      </body>
    </html>`;
}
