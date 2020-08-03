const async = require('async');
const request = require('request');


const PIXABAY_API_KEY = "[YOUR PIXABAY API KEY]";


module.exports=function(app)
{

	app.post('/api-request', function (req, res) {
	

		var ajaxObj = {};
		var ajaxArr = req.body['ajaxArr'];
		
		for(i=0; i < ajaxArr.length; i++) 
		{
			var keyval = ajaxArr[i];
			var kv = keyval.split("-DELIMITER-");
			var key = kv[0];
			var val = kv[1];
			
			ajaxObj[key]=val;
					
		};//for
	
	


		var _VARS = ajaxObj['_VARS'];

		if(Object.prototype.toString.call(_VARS) == "[object String]") var parseit = true;
		if(Object.prototype.toString.call(_VARS) == "[object Array]") var parseit = false;
		if(Object.prototype.toString.call(_VARS) == "[object Object]") var parseit = false;

		if(parseit)
		{
			if(_VARS !== undefined || _VARS !== 'undefined')
			{
				var _VARS = JSON.parse(_VARS);
			
			}

		}//##




		var searchterms = _VARS['searchterms'];
		if(searchterms == '')
		{
			//var searchterms = 'yellow+flower'; // q needs to be URL encoded
			//var searchterms = 'classic+cars';
			var searchterms = 'music';
		}//==


		var pg = _VARS['pg'];
		if(!pg || pg == undefined || pg == null)
		{
			var pg = 1;
		}//==


		var total_per_request = _VARS['total_per_request'];
		if(!total_per_request || total_per_request == undefined || total_per_request == null)
		{
			var total_per_request = 25;
		}//==

		


		var runit = true;//turn on or off for testing
		if(!runit)
		{
		// skipped


			var sof = 'DEFAULT';
			var msg = "Just Testing";
	
			var R = JSON.stringify({

				'sof':sof,
				'result':{
					'message':msg,
					'vars':_VARS
				}
			});

			res.send(R);


		}
		else
		{
		// process


			var ob = {};



			async.waterfall(
			
				//===========================================
				//PROCESSING FUNCTIONS
				// - object of callback functions 
				// - delivers result to final function
				//===========================================
				[
			

					function(callback){


						var key = PIXABAY_API_KEY;

						//var q = 'yellow+flower'; // q needs to be URL encoded
						//var q = 'classic+cars';
						//var q = 'music';

						var q = searchterms;


						var image_type = 'image_type=photo';
						var per_page = total_per_request;
						var page = pg;


						var URL = 'https://pixabay.com/api/';
						URL += '?key='+key;
						URL += '&q='+q;
						URL += '&image_type='+image_type;
						URL += '&per_page='+per_page;
						URL += "&page="+page;


						if(URL 
						&& URL != '' 
						&& URL != undefined
						)
						{

						
							request({uri: URL}, function(error, response, body){


								if(error)
								{ 
									ob['error'] = error;
									ob['response'] = response;
									ob['body'] = 'skipped';
									callback(error,ob);
								}
								else
								if(response.statusCode == 200
								)
								{
									ob['error'] = false;
									ob['response'] = response;
									ob['body'] = baselib.ParseIt(body);

									callback(null,ob);
			
								}else{

									ob['error'] = false;
									//ob['response'] = response.statusCode;
									ob['response'] = response;
									ob['body'] = body;
									callback(null,ob);

								}//====


							});

					

						}else{

							ob['error'] = 'skipped';
							ob['response'] = 'skipped';
							ob['body'] = 'skipped';
							
							callback(null,ob);
						}//===
							

						
					}//== func

			





				], 
				//===============================================
				//FINAL
				// - run any processing and send 
				//===============================================
				
				function(err, result) {
			
		
					var count = 0;
					
					var msg = 'Request (SUCCESS)';

					if(result['error'] 
					)
					{
						var count = count + 1;
						var msg = 'Request (FAILED)';

					}//#



					if(count == 0)
					{
						var sof = 'SUCCESS';
					}
					else
					if(count == 1)
					{
						var sof = 'FAILED';
					}//#
					else
					{
						var sof = 'SUCCESS_WITH_ERRORS';
					}//#


		
		
					var R = JSON.stringify({
			
						'sof'		: sof,
						'msg'		: msg,
						'result'	: result
					});

					res.send(R);
		
					//res.redirect("/result/?r="+R);
					//res.end(report);
					//res.redirect(end_url);
		
				}
			
			
			);
	

		}//RUNIT
		//======


	});//post
	//========



}//==				

