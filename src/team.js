import { storage } from '../storage.js';
import { API_BASE_URL } from './constant.js';

export const team = async () => {
	const { authCookie } = storage.getStore();

	const headers = new Headers();
	headers.append('Cookie', authCookie);

	const response = await fetch(`${API_BASE_URL}/team/get?team_id=364887`, {
		method: 'GET',
		headers,
		redirect: 'follow',
	});

	const body = await response.json();

	if (!response.ok) {
		throw new Error(JSON.stringify(body));
	}

	const data = await fetch(body.link).then((response) => response.json());
	console.log(data);
};
