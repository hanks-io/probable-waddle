import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import fs from 'fs';

dotenvExpand.expand(dotenv.config());

async function fetchConfig() {
	try {
		console.log('Fetching config from', process.env.VITE_TRPC_HOST);
		const res = await fetch('https://' + process.env.VITE_TRPC_HOST);
		console.log('Response:', res.status);
		const result = await res.text();
		const configMatch = result.match(/__APP_CONFIG__\s*=\s*({[^;]+});/);
		if (configMatch) {
			const config = JSON.parse(configMatch[1]);
			console.log('Writing config to fetch.config.json');
			return fs.writeFileSync('fetch.config.json', JSON.stringify(config, null, 2));
		}
	} catch (err) {
		console.error(err);
	}
}
fetchConfig();
