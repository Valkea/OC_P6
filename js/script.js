var api_url = "http://localhost:8000/api/v1/"
var modal =  null;

// --- CATEGORIES ---

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

	fetchMulti(urls, save_data, cat, num, fill_category)
}

const data = {'cat_0':[], 'cat_1':[], 'cat_2':[], 'cat_3':[]}

function save_data(num, cat, fetches, callback){

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
		fill_tops()	
	} else {
		fill_category(cat)
	}
}

function fill_category(cat){
	
	let index = 0;
	for(result of data[cat]){
		document.getElementById(cat+"_"+index).style.backgroundImage="url("+result['image_url']+")";
		document.getElementById(cat+"_"+index).innerHTML= result['title'];
		index ++;
	}
}

function fill_tops(){

	data['first'] = data['cat_0'].shift()
	fill_category( 'cat_0' )

	first_id = data['first']['id']
	fetchOne(api_url+"titles/"+first_id, collect_display_first);
}

// --- FIRST / TOP ---

function collect_display_first(json){
	
	document.getElementsByClassName("poster")[0].style.backgroundImage="url("+json['image_url']+")";
	document.getElementsByClassName("poster__image")[0].src= json['image_url'];

	document.getElementsByClassName("poster__title")[0].innerHTML=json['title'];
	document.getElementsByClassName("poster__desc")[0].innerHTML=json['description'];
}

// --- VIGNETTES ---

function open_vignette(ref) {

	const regExpr = /(cat_[\d+])_([\d+])*/
	const match = ref.match(regExpr);

	get_modal_film(data[match[1]][match[2]]['id'])
}

// --- FETCH & DISPLAY MODAL ---

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

function get_modal_film(id){

	fetchOne(api_url+"titles/"+id, collect_display_modal);
}

function collect_display_modal(json){
	console.log(json);
	
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

		document.getElementById("modal-"+id).innerHTML = retv;

	} catch (error) {
  		console.error(error);
	}
}

// --- UTILS ---

function currencyFormat(num) {
	return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

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
	let elems = document.getElementsByTagName("*");
	// let vignettes_btns = [];
	for (let i=0, m=elems.length; i<m; i++) {
    		if (elems[i].id && elems[i].id.indexOf("cat_") != -1) {
			// vignettes_btns.push(elems[i]);
			elems[i].onclick = function(){
				open_vignette(elems[i].id);
			}
    		}
	}
	// console.log(vignettes_btns);
	
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

	// --- Load content ---
	
	get_best_cat(8, 'cat_0');
	get_best_cat(7, 'cat_1');
	get_best_cat(7, 'cat_2');
	get_best_cat(7, 'cat_3');
}
