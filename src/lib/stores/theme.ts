import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

const storedTheme = browser ? window.localStorage.getItem('theme') : null;
const initialTheme: Theme =
	storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';

export const theme = writable<Theme>(initialTheme);

if (browser) {
	theme.subscribe((value) => {
		document.documentElement.classList.toggle('dark', value === 'dark');
		window.localStorage.setItem('theme', value);
	});
}
