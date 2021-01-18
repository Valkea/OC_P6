/**
 * FUNCTIONS SIGNATURES
 *
 * --- CAT PROCESS ---
 *
 * get_best_cat(num, cat)
 * 	# shortcut to fetch the 'num' first films from given category 
 * save_data(num, cat, fetches, callback)
 * 	# save the fetched data to the global 'data' map
 *
 * --- MAIN DISPLAY ---
 *
 * fill_category(cat)
 * 	# set the categories thumbnails' images & titles
 * fill_category_tops()
 * 	# set the 'top films' category's image & title
 * fill_top_film(json)
 * 	# set the 'top film' image & title
 *
 * --- CAT BUTTONS ---
 *
 * open_vignette(ref) 
 * 	# parse the given ID to know which thumbnail was clicked
 *
 * --- FETCH --- 
 *
 * fetchOne(url, callback)
 * 	# fetch only one url
 * fetchMulti(urls, callback, cat, num)
 * 	# fetch several urls
 *
 * --- MODAL ---
 *
 * get_modal_film(id)
 * 	# shortcut to fetch one film
 * collect_display_modal(json)
 * 	# collect and display the modal content
 * setModalField(json, field_name, id=null, format=null)
 * 	# actually set the modal content with some controls
 * 
 * --- FORMAT DATA ---
 *
 * currencyFormat(num) 
 * 	# format the provided string to a $xxx.xxx.xxx,xxx format
 * timeFormat(num) 
 * 	# format the provided string to a xx:xx format
 *
 * --- INITIALIZE ---
 *
 * window.onload
 *
 * ========================= 
 *
 * SCENARIOS
 *
 * --- TOP FILM & 7 OTHER BEST FILMS ---
 *
 * window.onload
 *     => get_best_cat(8, 'cat_0')
 *         => fetchMulti
 *             => save_data
 *                 => fill_category_tops
 *                     => fetchOne
 *                         => fill_top_film
 *                     => fill_category
 *
 * --- CATEGORIES ---
 *
 * window.onload
 *     => get_best_cat(7, 'cat_1')
 *         => fetchMulti
 *             => save_data
 *                 => fill_category(cat)
 *
 * --- MODAL TOP ---
 *
 * window.onload
 *     => onclick
 *         => get_modal_film(data['first']['id'])
 *             => fetchOne
 *                 => collect_display_modal
 *                     => setModalField
 *
 * --- MODAL CAT THUMB ---
 *
 * window.onload
 *     => onclick
 *         => open_vignette(elems[i].id)
 *             => get_modal_film(data['first']['id'])
 *                 => fetchOne
 *                     => collect_display_modal
 *                         => setModalField
 */


// --- GLOBAL VARIABLES ---

var modal =  null;
const api_url = "http://localhost:8000/api/v1/"
const data = {'cat_0':[], 'cat_1':[], 'cat_2':[], 'cat_3':[]}

// --- CATEGORIES ---

/**
 * Shortut to fetch the 'num' first films from the given 'cat' 
 * @param  {Number} num [The number of entries to collect]
 * @param  {String} cat [The local category name (cat_0 to cat_3)]
 */
function get_best_cat(num, cat){
	let results_per_page = 5;
	let num_pages = Math.ceil(num/results_per_page);

	let cat_names = new Map([
		['cat_0',''],
		['cat_1','Sci-Fi'],
		['cat_2','Mystery'],
		['cat_3','Animation'],
	]);

	const urls = [];
	for(let i = 1; i <= num_pages; i++){
		urls.push(api_url+"titles/?sort_by=-imdb_score,-votes%2C-votes&genre="+cat_names.get(cat)+"&page="+i);
	}

	fetchMulti(urls, save_data, cat, num)
}

/**
 * Save the fetched data to the global 'data' map
 * @param  {Number} num [The number of entries to collect]
 * @param  {String} cat [The local category name (cat_0 to cat_3)]
 * @param  {JSON Object} fetches [The JSON data to save for the provided 'cat']
 */
function save_data(num, cat, fetches){

	console.log(typeof fetches);

	data[cat] = [];
	let count = 0;
	for (const fetch of fetches){
		results = fetch['results']
		for (const r of results){
			if(count >= num) break;
			count ++;
			data[cat].push(r);
		}
	}

	if(cat == 'cat_0'){
		fill_category_tops()	
	} else {
		fill_category(cat)
	}
}

// --- MAIN DISPLAY ---

/**
 * Set the categories thumbnails' images & titles
 * @param  {String} cat [The local category name (cat_0 to cat_3)]
 */
function fill_category(cat){
	
	let index = 0;
	for(result of data[cat]){
		document.getElementById(cat+"_"+index).style.backgroundImage="url("+result['image_url']+")";
		//document.getElementById(cat+"_"+index).innerHTML = result['title'];
		document.querySelector("#"+cat+"_"+index+" div").innerHTML = result['title'];
		index ++;
	}
}

/**
 * Set the 'top films' category's image & title
 */
function fill_category_tops(){

	data['first'] = data['cat_0'].shift()
	fill_category( 'cat_0' )

	first_id = data['first']['id']
	fetchOne(api_url+"titles/"+first_id, fill_top_film);
}

/**
 * Set the 'top film' image & title
 * @param  {JSON Object} json [A JSON containing the data required to fill the fields]
 */
function fill_top_film(json){
	
	document.getElementsByClassName("poster")[0].style.backgroundImage="url("+json['image_url']+")";
	document.getElementsByClassName("poster__image")[0].src= json['image_url'];

	document.getElementsByClassName("poster__title")[0].innerHTML=json['title'];
	document.getElementsByClassName("poster__desc")[0].innerHTML=json['description'];
}

// --- CAT BUTTONS ---

/**
 * Parse the given ID to know which thumbnail was clicked
 * @param  {String} ref [The #id of the clicked button with a cat_x_x format]
 */
function open_vignette(ref) {
	const regExpr = /(cat_[\d+])_([\d+])*/
	const match = ref.match(regExpr);

	get_modal_film(data[match[1]][match[2]]['id'])
}

// --- FETCH ---

/**
 * Fetch only one url
 * @param  {String} url [The API url to fetch]
 * @param  {Function} callback [The function to call once the fetch is done]
 */
function fetchOne(url, callback){

	var myHeaders = new Headers();

	var myInit = { method: 'GET',
	               headers: myHeaders,
	               // mode: 'cors',
	               cache: 'default' };

	return fetch( url, myInit)
	.then( response => response.json() )
  	.then( json => callback(json) )
  	.catch( error => console.error('error:', error) );
}

/**
 * Fetch several urls
 * @param  {Array} urls [The urls to fetch]
 * @param  {Function} callback [The function to call once the fetch is done]
 * @param  {String} cat [cat parameter for the callback function]
 * @param  {Number} num [num parameter for the callback function]
 */
function fetchMulti(urls, callback, cat, num){

	var myHeaders = new Headers();
	var myInit = { method: 'GET',
	               headers: myHeaders,
	               // mode: 'cors',
	               cache: 'default' };

	fetches = []
	for (const url of urls)
		fetches.push(fetch(url, myInit))

	Promise.all(fetches)
	.then( responses => Promise.all(responses.map(response => response.json())) )
  	.then( json => callback(num, cat, json) )
  	.catch( error => console.error('error:', error) );
}

// --- MODAL ---

/**
 * Shortcut to fetch one film
 * @param  {String} id [The id of the targetted film in the API database]
 */
function get_modal_film(id){

	fetchOne(api_url+"titles/"+id, collect_display_modal);
}

/**
 * Collect and display the modal content
 * @param  {JSON Object} json [A JSON containing the data required to fill the fields]
 */
function collect_display_modal(json){
	
	document.getElementById("modal-image").src = json['image_url'];

	setModalField(json, 'title');
	setModalField(json, 'genres');
	setModalField(json, 'date_published');
	setModalField(json, 'directors');
	setModalField(json, 'actors');
	setModalField(json, 'duration', null, timeFormat);
	setModalField(json, 'countries');
	setModalField(json, 'worldwide_gross_income', null, currencyFormat);
	setModalField(json, 'long_description');
	setModalField(json, 'rated');
	setModalField(json, 'imdb_score');
	setModalField(json, 'imdb_score', 'imdb_score--mobile');
	   
	modal.style.display = "block";
}

/**
 * Set a modal field to the matching value content with some controls
 * @param  {JSON Object} json [A JSON containing the data required to fill the fields]
 * @param  {String} field_name [The name of the field in the JSON and the #id of the HTML element]
 * @param  {String} id [The real #id of the HTML element if different from the field_name]
 * @param  {function} format [A function that must be used to format the value before setting it to the HTML element]
 */
function setModalField(json, field_name, id=null, format=null){

	try {
		let retv = "NOT FOUND";
		id = id!=null ? id : field_name;
		document.getElementById("modal-"+id).innerHTML = "";

		if( field_name in json )
		{
			let value = json[field_name] // Get value

			if(Array.isArray(value)) 
				value = value.join(", "); // Array to str

			if(format != null && value != null)
				value = format(value); // Optional formatting

			retv = value;
		}

		if(retv == null )
			retv = " -- ";

		document.getElementById("modal-"+id).innerHTML = retv;

	} catch (error) {
  		console.error(error);
	}
}

// --- FORMAT DATA ---

/**
 * Format the provided string to a $xxx.xxx.xxx,xxx format
 * @param  {Number} num [The value that must be formated]
 * @return {String}     [A $xxx.xxx,xxx formated string]
 */
function currencyFormat(num) {
	return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

/**
 * Format the provided string to a xx:xx format
 * @param  {Number} num [The value that must be formated]
 * @return {String}     [A xx:xx formated string]
 */
function timeFormat(num) {
	hours = Math.floor(num/60).toString().padStart(2,0);
	minutes = (num%60).toString().padStart(2,0);
	return hours + ":" + minutes;
}

// --- INIT ---

window.onload = function() {

	// --- Get the modal ---
	modal = document.getElementById("modal-film");
	
	// --- Get the <span> element closeing the modal ---
	let close_btn = document.getElementsByClassName("modal__close")[0];

	// --- Set onclick actions to open the modals ---
	let elems = document.getElementsByTagName("div");
	for (let i=0, m=elems.length; i<m; i++) {
    		if (elems[i].id && elems[i].id.startsWith("cat_")) {
			elems[i].onclick = function(){
				open_vignette(elems[i].id);
			}
    		}
	}
	
	// --- Set Best film btn ---
	// document.getElementById("modal__open").onclick = function() {
	//	get_modal_film(data['first']['id'])
	// }

	document.getElementsByClassName("poster")[0].onclick = function() {
		get_modal_film(data['first']['id'])
	}

	// --- Close the modal when clicking (x) ---
	close_btn.onclick = function() {
		modal.style.display = "none";
	}

	// --- Close the modal when the user clicks anywhere outside of it ---
	window.onclick = function(event) {
		if (event.target == modal) {
	    		modal.style.display = "none";
		}
	}

	// --- scroll buttons ---
	for(let i = 0; i <= 3; i++){
	
		document.getElementById('right_cat_'+i).onclick = function(){
			size = document.getElementsByClassName("carrousel__vignette")[0].offsetWidth;
			document.getElementById('scroll_cat_'+i).scrollLeft += size+2;
		}

		document.getElementById('left_cat_'+i).onclick = function(){
			size = document.getElementsByClassName("carrousel__vignette")[0].offsetWidth;
			document.getElementById('scroll_cat_'+i).scrollLeft -= size+2;
		}
	}

	// --- Load content ---
	
	get_best_cat(8, 'cat_0');
	get_best_cat(7, 'cat_1');
	get_best_cat(7, 'cat_2');
	get_best_cat(7, 'cat_3');
}
