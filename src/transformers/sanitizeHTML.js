module.exports = (html) => {
	if(!html || html === '') return ''
	if(typeof(html) !== String) return html
	
	return (
		html
			.replace(/<a.*>/gi, '')
			.replace(/<script.*>/gi, '')
			.replace(/<img.*>/gi, '')
			.replace(/<iframe.*>/gi, '')
			.replace(/<form.*>/gi, '')
			.replace(/<source.*>/gi, '')
			.replace(/<applet.*>/gi, '')
			.replace(/<input.*>/gi, '')
			.replace(/<object.*>/gi, '')
			.replace(/<isindex.*>/gi, '')
			.replace(/<meta.*>/gi, '')
			.replace(/expression\(.*\)/gi, '')
	)
};