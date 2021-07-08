const fs = require("fs");
const axios = require("axios");
const apiKey = process.env.api_key;
const root_url = "https://api.musixmatch.com/ws/1.1/";

const getArtistAlbums = async (artist_id) => {
	const params = {
		artist_id,
		g_album_name: 1,
		s_release_date: "desc",
		apikey: apiKey,
	};

	// ARTIST.ALBUMS.GET
	const response = await axios.get(`${root_url}artist.albums.get`, {
		params,
	});

	return response.data.message.body.album_list;
};

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
	const artistsObject = { names: artistsNames };
	fs.writeFileSync(
		"./data/top10names.data",
		JSON.stringify(artistsObject, null, 2)
	);
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
		const newArtist = {
			[artist.artist.artist_name]: {
				id: artist.artist.artist_id,
				mbid: artist.artist.artist_mbid,
				rating: artist.artist.artist_rating,
			},
		};

		condensedLog.push(newArtist);
	});

	fs.writeFileSync(
		"./data/top5data.data",
		JSON.stringify(condensedLog, null, 2)
	);
	// SAVE DATA END

	expect(artists.length).toBe(3);
	expect(response.data.message.header.status_code).toBe(200);
});

test("Get the last top 5 artists from top 10 albums in Mexico", async () => {
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

	const artistsId = croppedArtists.map((artist) => artist.artist.artist_id);
	const artistsAlbums = [];
	for (const artistId of artistsId) {
		const albums = await getArtistAlbums(artistId);
		artistsAlbums.push(albums);
	}
	const outputFile = JSON.stringify(artistsAlbums, null, 2);
	fs.writeFileSync("./data/bottom5top10albums.data", outputFile);

	expect(croppedArtists.length).toBe(5);
	expect(response.data.message.header.status_code).toBe(200);
});
