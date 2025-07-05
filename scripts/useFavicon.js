export function linkIcon({ imgUrl }) {
	const linktags = [
		{ rel: 'apple-touch-icon-precomposed', href: imgUrl, sizes: '192x192' },
		{ rel: 'apple-touch-icon', href: imgUrl, sizes: '180x180' },
		{ rel: 'apple-touch-icon', href: imgUrl, sizes: '120x120' },
		{ rel: 'apple-touch-icon', href: imgUrl, sizes: '152x152' },
		{ rel: 'shortcut icon', href: imgUrl, sizes: '32x32' },
		{ rel: 'icon', href: imgUrl, sizes: '32x32' },
	]
	return linktags
		.reduce((acc, { rel, href, sizes }) => {

			if (href) acc.push(`<link rel="${rel}" href="${href}"${sizes ? ` sizes="${sizes}"` : ''}>`)
			return acc
		}, [])
		.join('\n')
}


