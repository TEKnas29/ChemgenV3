/** @type {import('./$types').PageLoad} */

// import { TINYMCE_API_KEY } from '$env/static/private'
import { redirect } from '@sveltejs/kit';

export function load() {
    throw redirect(307, '/English_Gen');  // temporary bloker
    // return {
    //     apiK: TINYMCE_API_KEY,
    //     conf: {
    //       width:800,
    //       height:900,
    //       menubar: false,
    //       toolbar: false,
    //       skin:'oxide-dark',
    //       contextmenu: false,
    //       content_css: 'dark',
    //       plugins: ' table',
          
    //    }
    // };
  }