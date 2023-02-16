import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	},
	optimizeDeps: {
        exclude: ["codemirror", "@codemirror/language-javascript" /* ... */],
    },
};

export default config;
