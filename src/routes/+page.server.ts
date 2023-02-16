/** @type {import('./$types').PageLoad} */

import { TINYMCE_API_KEY } from '$env/static/private'

export function load() {
    return {
        apiK: TINYMCE_API_KEY,
        conf: {
          width:800,
          height:900,
          menubar: false,
          toolbar: false,
          skin:'oxide-dark',
          contextmenu: false,
          content_css: 'dark',
          plugins: ' table',
          
       }
    };
  }