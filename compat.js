let x = null
try {
	x = browser || chrome
} catch(e) {
	x = chrome
}

try {
	window.browser = x
} catch(ignore) {}

export default x
