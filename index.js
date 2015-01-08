// Það sem þarf að nota
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

// Heroku port
app.set('port', (process.env.PORT || 5000));

app.get('/car/:number', function(req, res) {

	// Ná í bílnúmer úr params
	var carParams = req.param('number');

	// URLið sem á að scrapa
	var url = 'http://ww2.us.is/upplysingar_um_bil?vehinumber=' + carParams;

	// Tengjast URL
	request(url, function(error, response, html) {
		if (error) {
			return res.status(500).json({ error: 'Tókst ekki að tengjast URL' });
		} else {
			try {
				var $ = cheerio.load(html);
			} catch (e) {
				return res.status(500).json({ error: 'Tókst ekki að tengjast URL' });
			}

			// Json object
			var obj = {
				results: []
			}

			// Gögn sem við ætlum að sækja
			car = {
				'registryNumber': 0,
				'number': 0,
				'factoryNumber': 0,
				'type': '',
				'subType': '',
				'color': '',
				'registeredAt': '',
				'status': '',
				'nextCheck': '',
				'pollution': '',
				'weight': 0
			};

			// Gögnin
			var fields = ['registryNumber','number','factoryNumber','type','subType','color','registeredAt','status','nextCheck','pollution','weight'];

			// Byrja að scrapa hér
			var field_items = $('.field-items');

			// Fara í gegnum öll tr í töflunni
			field_items.find('table tr').each(function(index) {
				// Gögnin eru í <b>
				var val = $(this).find('b').text();

				// Setja gögn í car obj
				car[fields[index]] = val;
			});

			// Setja í result arrayið í json obj
			obj.results.push(car);

			// Skila json til baka
			return res.json(obj);
		}
	});

});

app.listen(app.get('port'), function() {
	console.log("Server i gangi a porti: " + app.get('port'));
});