export async function onRequestPost(context) {
  try {
    return await handleRequest(context);
  } catch (e) {
    console.error(e);
    return new Response("Error sending message", { status: 500 });
  }
}

async function handleRequest({ request }) {
  const ip = request.headers.get("CF-Connecting-IP");

  const formData = await request.formData();
  const get_ip = formData.get("get_ip");
  const alpha_val = formData.get("alpha_val");
  const demo_val = formData.get("demo_val");
  const display = formData.get("display");
  const touch = formData.get("touch");
  const lang = formData.get("lang");
  const tz = formData.get("tz");
  const feedback_msg = formData.get("feedback_msg");

      const form1 = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <title></title> </head> <body> <div> <p> <a href="">';
      const form2 = '</a> </p> </div> <div> <p> <a href="">'; 
      const form3 = '</a> </p> </div> </body> </html>';

      const html = form1 + get_ip + form2 + alpha_val + form2 + demo_val + form2 + display + form2 + touch + form2 + lang + form2 + tz + form2 + feedback_msg + form3;


      return new Response(html, {
        headers: {
          'content-type': 'text/html',
        }
      });
}




