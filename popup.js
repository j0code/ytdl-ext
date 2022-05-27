import browser from "./compat.js"

const serverUrl = "http://www.localhost:3772/"
const [tab] = await browser.tabs.query({active: true, currentWindow: true})

const icons = {
	1: "./assets/video_muted.png",
	2: "./assets/audio.png",
	3: "./assets/video.png"
}

;(() => {

	if(!tab.url) {
		console.log("Not youtube.")
		return
	}

	let url = new URL(tab.url)

	if(url.host != "www.youtube.com") {
		console.log("Not youtube.")
		return
	}

	if(url.pathname != "/watch") {
		console.log("Not youtube /watch.")
		return
	}

	let vidurl = url.origin + url.pathname + "?v=" + url.searchParams.get("v")
	getInfo(vidurl).then(i => {
		let d = i.videoDetails
		console.log(d)

		$("#title").innerText = d.title
		/*$("#views").innerText = d.viewCount
		$("#likes").innerText = d.likes
		$("#channelname").innerText = d.author.name
		$("#views-label").innerText = browser.i18n.getMessage("views")
		$("#likes-label").innerText = browser.i18n.getMessage("likes")*/

		//$("#preview").innerText = i.formats[0].url
		$("#preview").src = i.formats[0].url
		$("#preview").muted = true
		$("#preview").play()
		if(i.formats[0].hasVideo) {
			$("#preview").play()
			$("#preview").className = "video"
			$("#preview").height = 202.5
		} else {
			$("#preview").className = "audio"
			$("#preview").height = 40
		}

		for(let f of i.formats) {
			let div = e("div.format")
			let iconEncDiv = e("div.icon-enc")
			let iconDiv = e("img.icon") // video, muted video or audio
			let encDiv = e("div.encoding") // mp4, webm
			let resDiv = e("div.resolution") // 1080p60 or tiny, small,...
			let cdsDiv = e("div.codecs")

			iconDiv.src = icons[f.hasVideo + f.hasAudio*2]
			encDiv.innerText = f.container
			resDiv.innerText = f.hasVideo ? (f.qualityLabel + f.fps) : f.quality
			cdsDiv.innerText = f.codecs
			iconEncDiv.appendChild(iconDiv)
			iconEncDiv.appendChild(encDiv)
			div.appendChild(iconEncDiv)
			div.appendChild(resDiv)
			div.appendChild(cdsDiv)

			div.addEventListener("click", e => {
				$("#preview").src = f.url
				if(f.hasVideo) {
					$("#preview").play()
					$("#preview").className = "video"
					$("#preview").height = 202.5
				} else {
					$("#preview").className = "audio"
					$("#preview").height = 40
				}
			})

			$("#formats").appendChild(div)
			console.log(f)
		}
	})

})()

function getInfo(url) {
	return fetch(serverUrl + url)
	.then(res => res.json())
	.catch(console.error)
}
