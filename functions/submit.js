export function onRequest(context) {
//  return new Response("Hello, world!")
    try {
      const body = context.formData();

      const { 
        get_ip,
        alpha_val,
        demo_val,
        display,
        touch,
        lang,
        tz,
        feedback_msg
      } = Object.fromEntries(body);

      const form1 = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <title></title> </head> <body> <div> <p> <a href="">';
      const form2 = '</a> </p> </div> <div> <p> <a href="">'; 
      const form3 = '</a> </p> </div> </body> </html>';

      const html = form1 + get_ip + form2 + alpha_val + form2 + demo_val + form2 + display + form2 + touch + form2 + lang + form2 + tz + form2 + feedback_msg + form3;

      return new Response(html, {
        headers: {
          'content-type': 'text/html',
        }
      });

    } catch (e) {
      let pathname = new URL(request.url).pathname;
      return new Response(`"${pathname}" not found`, {
        status: 404,
        statusText: 'not found',
      });
    }
};


