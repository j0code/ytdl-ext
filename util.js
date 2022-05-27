function $(q) {
	return document.querySelector(q)
}

function e(q) {
	var q = cssQuery(q)
	if(!q.tag) return null
	var el = document.createElement(q.tag)
	if(q.id) el.id = q.id
	if(q.className) el.className = q.className
	if(q.attrs) for(var a in q.attrs) el[a] = q.attrs[a]
	return el
}

function cssQuery(q) {
  var obj = {tag: "", classes: [], id: "", attrs: {}, className: ""}
  if(q) q.split(/(?=\.)|(?=#)|(?=\[)/).forEach(token => {
    switch (token[0]) {
      case '#':
        obj.id = token.slice(1)
        break
      case '.':
        obj.classes.push(token.slice(1))
        break;
      case '[':
				var a = token.slice(1,-1).split(';')
        for(var b of a) {
          var kv = b.split("=")
  				obj.attrs[kv[0]] = kv[1]
        }
        break
      default:
        obj.tag = token
        break
    }
  })
	obj.className = obj.classes.join(" ")
  return obj
}
