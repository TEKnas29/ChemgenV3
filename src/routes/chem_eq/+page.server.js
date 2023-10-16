/** @type {import('./$types').PageLoad} */

import { TINYMCE_API_KEY } from '$env/static/private'
import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment'

export function load() {
      if (dev) {
        return {
            apiK: TINYMCE_API_KEY,
            conf: {
              width:650,
              height:500,
              menubar: false,
              toolbar: false,
              skin:'oxide-dark',
              contextmenu: false,
              content_css: 'dark',
              plugins: ' table',
              
           }
        };
      } else {
        
        throw redirect(307, '/English_Gen');  // temporary bloker
      }
  }