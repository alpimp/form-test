export default {
  async fetch(request, env, ctx, headers) {
    try {
      const body = await request.formData();

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

      const html = '<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head>' +
        '<meta charset="UTF-8">' +
        '<title></title>' +
        '</head>' +
        '<body>' +
        '<div>' +
        '<p>' +
        '<a href="">' + get_ip + '</a>' +
        '</p>' +
        '</div>' +
        '<div>' +
        '<p>' +
        '<a href="">' + alpha_val + '</a>' +
        '</p>' +
        '</div>' +
        '<div>' +
        '<p>' +
        '<a href="">' + demo_val + '</a>' +
        '</p>' +
        '</div>' +
        '<div>' +
        '<e>' +
        '<a href="">' + display + '</a>' +
        '</p>' +
        '</div>' +
        '<div>' +
        '<p>' +
        '<a href="">' + touch + '</a>' +
        '</p>' +
        '</div>' +
        '<div>' +
        '<p>' +
        '<a href="">' + lang + '</a>' +
        '</p>' +
        '</div>' +
        '<div>' +
        '<p>' +
        '<a href="">' + tz + '</a>' +
        '</p>' +
        '</div>' +
        '<div>' +
        '<p>' +
        '<a href="">' + feedback_msg + '</a>' +
        '</p>' +
        '</div>' +
        '</body>' +
        '</html>';

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
  },
};


