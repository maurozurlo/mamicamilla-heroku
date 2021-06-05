module.exports = (html) => {
	if(typeof(html) === 'string') return (
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
  return html
}