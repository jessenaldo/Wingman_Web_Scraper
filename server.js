var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var Firebase = require('Firebase');

var firebaseRef = new Firebase("placeholder_url");
var firebase_auth_token = 'placeholder_token'

var articlesRef = new Firebase(firebaseRef + "/articles");


app.get('/scrape', function(req, res) {

	firebaseRef.authWithCustomToken(firebase_auth_token, function(error, result) {
	if(error) {
		console.log("Authentication Failed", error);
	} else {
		console.log("Authenticated successfully", result.auth);
		console.log("Auth expires at:", new Date(result.expires * 1000));

		
		url = "placeholder_url";

		request(url, function(error, response, html) {

			if(!error && response.statusCode == 200) {
				var $ = cheerio.load(html);
				var parsedResults = [];

				$('.node-blog-small-teaser.node-teaser.node-type-blog').each(function(i, element) {

					var data = $(this);

					var teaser_img = data.children().children().children().children().attr('src');

					var title = data.children().children().next().children().children().first().text()
				
					var date_added = data.children().children().next().children().children().next().text()

					// var author = data.children().children().next().children().children().next().attr('href');

					var author = data.find($('.username')).text()
					var avatar = data.find($('.avatar')).children().children().attr('src');
					var oldteaser_txt = data.find($('.teaser-txt')).text()

					var teaser_txt = oldteaser_txt.replace( /\\/g, "");


					var views = data.find($('.viewcount')).text()
					
					// var author = data.filter('.username').children().attr('href');
					// console.log(author);
					// children().children().text()

					var metadata = {
						teaser_img: teaser_img,
						title: title,
						date_added: date_added,
						author: author,
						avatar: avatar,
						teaser_txt: teaser_txt,
						views: views
					};


					parsedResults.push(metadata);

				})

			}

			// fs.writeFile('output.json', JSON.stringify(parsedResults, null, 4), function(err) {
			// 	console.log('File successfully written');
			// })
			console.log('sending results');
			res.send(JSON.stringify(parsedResults));
		})


	}
})




	
})

app.listen('9000');

console.log('Magic happens on port 9000');

exports = module.exports = app;