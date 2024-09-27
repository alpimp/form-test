export async function onRequestPost(context) {
  try {
    return await handleRequest(context);
  } catch (e) {
    console.error(e);
    return new Response("Error sending message", { status: 500 });
  }
}

async function handleRequest({ request, env }) {

  const formData = await request.formData();
//  const get_ip = formData.get("get_ip");
  const get_ip = request.headers.get("CF-Connecting-IP");
  const alpha_val = formData.get("alpha_val");
  const demo_val = formData.get("demo_val");
  const display = formData.get("display");
  const touch = formData.get("touch");
  const lang = formData.get("lang");
  const tz = formData.get("tz");
  const feedback_msg = formData.get("feedback_msg");
  const secret = env.SECRET1;

      const form1 = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <title></title> </head> <body> <div> <p> <a href="">';
      const form2 = '</a> </p> </div> <div> <p> <a href="">'; 
      const form3 = '</a> </p> </div> </body> </html>';

      const html = form1 + get_ip + form2 + alpha_val + form2 + demo_val + form2 + display + form2 + touch + form2 + lang + form2 + tz + form2 + feedback_msg + form2 + secret + form3;
    const url = "http://httpbin.org/post";

    const body = {
        get_ip: get_ip, 
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

    /**
     * gatherResponse awaits and returns a response body as a string.
     * Use await gatherResponse(..) in an async function to get the response body
     * @param {Response} response
     */
    async function gatherResponse(response) {
      const { headers } = response;
      const contentType = headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        return JSON.stringify(await response.json());
      } else if (contentType.includes("application/text")) {
        return response.text();
      } else if (contentType.includes("text/html")) {
        return response.text();
      } else {
        return response.text();
      }
    }

    const init = {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    };
    const response = await fetch(url, init);
    const results = await gatherResponse(response);
    return new Response(results, init);

}




