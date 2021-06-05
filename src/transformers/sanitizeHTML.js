module.exports = (html) => {
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
			.replace(/\S*@\S*\s?/gi, '')
	)
};