const queue = [];
const logFile = [];
const processingInterval = 15 * 60 * 1000; // 15 minutes
const maxProcessingTime = 24 * 60 * 60 * 1000; // 24 hours

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest({ request, env }) {
  try {
    // Parse the form data from the request
    const formData = await request.formData();
const get_ip = request.headers.get("CF-Connecting-IP");
  const alpha_val = formData.get("alpha_val");
  const demo_val = formData.get("demo_val");
  const display = formData.get("display");
  const touch = formData.get("touch");
  const lang = formData.get("lang");
  const tz = formData.get("tz");
  const feedback_msg = formData.get("feedback_msg");
  const secret = env.SECRET1;

    const body = {
      ip_address: get_ip, 
        alpha_val: alpha_val,  
        demo_val: demo_val, 
        display: display,  
        touch: touch,  
        lang: lang,  
        tz: tz, 
        feedback_msg: feedback_msg,  
        secret: secret, 
      errors: null,
      msg: "I sent this to the fetch",
    };

    // Send the form data to the API endpoint
    const apiResponse = await Promise.race([
      fetch('http://httpbin.org/post', {
        method: 'POST',
        body: body,

      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000))
    ]);

    // Get the response code from the server
    const responseCode = apiResponse.status;

    // If the API response is successful, send the form data to Notion API
    if (apiResponse.ok) {
//      const notionResponse = await fetch('https://api.notion.com/v1/pages', {
//        method: 'POST',
 //       headers: {
  //        'Authorization': `Bearer ${NOTION_API_KEY}`,
   //       'Content-Type': 'application/json',
    //      'Notion-Version': '2022-06-28',
     //   },
//        body: JSON.stringify({
 //         parent: { database_id: NOTION_DATABASE_ID },
  //        properties: {
   //         // Map your form data to Notion properties here
    //      },
     //   }),
      //});

//      if (notionResponse.ok) {
        // Return a "Thank you" HTML page
        return new Response(getThankYouPage(responseCode, request, env), {
          headers: { 'Content-Type': 'text/html' },
        });
//      } else {
        // If Notion API call fails, return a 500 error
//        return new Response(getErrorPage(responseCode, request, env), {
//          headers: { 'Content-Type': 'text/html' },
//          status: 500,
//        });
 //     }
    } else {
      // If the API response is not successful, queue the form data and return a "Thank you" page
      queue.push({ formData, timestamp: Date.now() });
      return new Response(getThankYouPage(responseCode, request, env), {
        headers: { 'Content-Type': 'text/html' },
      });
    }
  } catch (error) {
    // If there is a timeout or any other error, queue the form data and return a "Thank you" page
    queue.push({ formData, timestamp: Date.now() });
    return new Response(getThankYouPage(500, request, env), {
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
      try {
        const apiResponse = await fetch('http://httpbin.org/post', {
          method: 'POST',
          body: body,
        });

        if (apiResponse.ok) {
          logFile.push({ formData, timestamp, status: 'Success', responseCode: apiResponse.status });
        } else {
          logFile.push({ formData, timestamp, status: 'Error', responseCode: apiResponse.status });
        }
        queue.splice(i, 1);
      } catch (error) {
        // Retry logic can be added here if needed
      }
    }
  }

  // Save logFile to a persistent storage (e.g., KV, Durable Object, etc.)
  // Example: await MY_KV.put('logFile', JSON.stringify(logFile));
}

setInterval(processQueue, processingInterval);

function getThankYouPage({responseCode, request, env }) {
  const get_ip = request.headers.get("CF-Connecting-IP");
  const alpha_val = formData.get("alpha_val");
  const demo_val = formData.get("demo_val");
  const display = formData.get("display");
  const touch = formData.get("touch");
  const lang = formData.get("lang");
  const tz = formData.get("tz");
  const feedback_msg = formData.get("feedback_msg");
  const secret = env.SECRET1;
  const code = responseCode;

      const form1 = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <title></title> </head> <body> <div> <p> <a href="">';
      const form2 = '</a> </p> </div> <div> <p> <a href="">'; 
      const form3 = '</a> </p> </div> </body> </html>';

      const html = form1 + get_ip + form2 + alpha_val + form2 + demo_val + form2 + display + form2 + touch + form2 + lang + form2 + tz + form2 + feedback_msg + form2 + secret + form2 + code + form3;

  return html;
}

function getErrorPage(responseCode) {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
          h1 { color: #F44336; }
        </style>
      </head>
      <body>
        <h1>500 Error</h1>
        <p>Server Response Code: ${responseCode}</p>
      </body>
    </html>
  `;
}


