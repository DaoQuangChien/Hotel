(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/all.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
$(document).ready(function(){
	$('a[title = "facebook"]').on('click', function() {
		FB.ui({
			method: 'share',
			display: 'popup',
			href: 'https://developers.facebook.com/docs/',
		}, function(response){});
	});
});