var TwitchWebSub = require("twitchwebsub");

var twitch_id = 19571641;
var twitch_topic = `https://api.twitch.tv/helix/users/follows?first=1&to_id=${twitch_id}`; // new follower

var WebSub = TwitchWebSub.server({
  //callback: "http://172.104.16.35:3003/webhook",
  callback: "http://xamb.xyz:3003/webhook",
	// client_id: process.env.CLIENT_ID,
	client_id: "3vxqileh6oxdhv2qqox7x9cx0cff3o",
	secret: "pineapple"
});
var closingTime = false;

WebSub.listen(3003);

WebSub.on('denied', () => {
	console.log('DENIED', arguments);
	process.exit(2);
});

WebSub.on('error', () => {
	console.log('ERROR', arguments);
	process.exit(3);
});

WebSub.on('listen', () => {
	WebSub.on('subscribe', (d) => {
		console.log(`${d.topic} subscribed until ${(new Date(d.lease * 1000)).toLocaleString()}`);
	});

	WebSub.on('unsubscribe', (d) => {
		console.log(`${d.topic} unsubscribed.`);
		if (!closingTime) WebSub.subscribe(twitch_topic);
		if (closingTime) process.exit(0);
	});

	WebSub.subscribe(twitch_topic);

	WebSub.on('feed', (d) => {
		console.log("\n--[\x1b[34m New Feed Request \x1b[0m]------------------------------------")
		console.log(d);
	});
});

process.on('SIGINT', () => {
	closingTime = true;
	WebSub.unsubscribe(twitch_topic);
});
