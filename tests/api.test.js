const fs = require("fs");
const axios = require("axios");
const apiKey = process.env.api_key;
const root_url = "https://api.musixmatch.com/ws/1.1/";
console.log(apiKey);

test("Get the top 10 artists in Mexico", async () => {
	const params = {
		page: 1,
		page_size: 10,
		country: "mx",
		apikey: apiKey,
	};
	const response = await axios.get(`${root_url}chart.artists.get`, {
		params,
	});

	const artists = response.data.message.body.artist_list;
	const artistsNames = artists.map((artist) => artist.artist.artist_name);
	fs.writeFileSync("./data/top10names.data", artistsNames.join('\n'))
	expect(artistsNames.length).toBe(10);
	expect(response.data.message.header.status_code).toBe(200);
});

test("Get the information of top 3 artists in Mexico", async () => {
	const params = {
		page: 1,
		page_size: 3,
		country: "mx",
		apikey: apiKey,
	};
	const response = await axios.get(`${root_url}chart.artists.get`, {
		params,
	});

	const artists = response.data.message.body.artist_list;

	// SAVE DATA START
	const condensedLog = [];
	artists.forEach((artist) => {
		condensedLog.push("===");
		condensedLog.push("artist id " + artist.artist.artist_id);
		condensedLog.push("artist mbid " + artist.artist.artist_mbid);
		condensedLog.push("artist name " + artist.artist.artist_name);
		condensedLog.push("artist rating " + artist.artist.artist_rating);
	});

	fs.writeFileSync("./data/top5data.data", condensedLog.join('\n'))
	// SAVE DATA END

	expect(artists.length).toBe(3);
	expect(response.data.message.header.status_code).toBe(200);
});

test("Get the last top 5 artists in Mexico", async () => {
	const params = {
		page: 1,
		page_size: 10,
		country: "mx",
		apikey: apiKey,
	};

	const response = await axios.get(`${root_url}chart.artists.get`, {
		params,
	});

	const artists = response.data.message.body.artist_list;
	const croppedArtists = artists.splice(0, 5);

		// SAVE DATA START
		const condensedLog = [];
		croppedArtists.forEach((artist) => {
			condensedLog.push("===");
			condensedLog.push("artist id " + artist.artist.artist_id);
			condensedLog.push("artist mbid " + artist.artist.artist_mbid);
			condensedLog.push("artist name " + artist.artist.artist_name);
			condensedLog.push("artist rating " + artist.artist.artist_rating);
		});
	
		fs.writeFileSync("./data/bottom5top10data.data", condensedLog.join('\n'))
		// SAVE DATA END

	expect(croppedArtists.length).toBe(5);
	expect(response.data.message.header.status_code).toBe(200);
});
