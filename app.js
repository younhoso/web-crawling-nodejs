const axios = require('axios');
const cheerio = require('cheerio');
const inflearn = require('./models/inflearn');
require('dotenv').config();

//MongoDB 접속
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log('mongodb connect');
});

const { MONGO_URI } = process.env;
mongoose
.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Successfully connected to mongodb'))
.catch(e => console.error(e));

const getHTHL = async(url, keyword) => {
	try {
		return await axios.get(!keyword?`${url}`:`${url}${encodeURI(keyword)}`);
	} catch(err){
		console.log(err);
	}
}

const parsing = async (url, keyword) => {
	const html = await getHTHL(url, keyword);
	const $ = cheerio.load(html.data);
	const $coursList = $('#courses_section > div > div > div > main > div.courses_container > div > div');

	$coursList.each((idx, el) => {
		const title = $(el).find('.course_title').eq(0).text();
		const instructor = $(el).find('.instructor').text();
		const price_del = $(el).find('.price del').text().trim();
		const price_pay = $(el).find('.price .pay_price').text().trim();
		const rating = $(el).find('.star_solid').css('width');
		const img = $(el).find('.card-image > figure > img').attr('src');

		const dataCheckout = new inflearn({
			title,
			instructor,
			price: [{del:price_del, pay:price_pay}],
			rating,
 			img
		})
		
		dataCheckout.save();
	});
}

/** 
	ex) 
	parsing(크롤링할 URL);
	혹은
	parsing(크롤링할 URL, 키워드);

	특정사이트 URL로만 크롤링 가능하고, 키워드를 넣어서 크롤링할수도 있습니다.
*/
parsing('https://www.inflearn.com/');
parsing('https://www.inflearn.com/courses?s=','타입스크립트');
