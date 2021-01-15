
function setModalField(json, field_name, id=null){

	try {
		if( field_name in json )
		{
			value = json[field_name]
			if( id != null) {
				id = id;	
			} else {
				id = field_name;
			}

			if( Array.isArray(value) )
			{
				value = value.join(", ");
			}

			document.getElementById("modal-"+id).innerHTML = value;

		} else {
			document.getElementById("modal-"+field_name).innerHTML = "NOT FOUND";
		}
	} catch (error) {
  		console.error(error);
	}
}

function collect(json){
	console.log(json);
	
	document.getElementById("modal-image").src = json['image_url'];

	setModalField(json, 'title');
	setModalField(json, 'genres');
	setModalField(json, 'date_published');
	setModalField(json, 'directors');
	setModalField(json, 'actors');
	setModalField(json, 'duration');
	setModalField(json, 'countries');
	setModalField(json, 'worldwide_gross_income');
	setModalField(json, 'description');
	setModalField(json, 'rated');
	setModalField(json, 'imdb_score');
	setModalField(json, 'imdb_score', 'imdb_score--mobile');
}

function callTest(url){

	var myHeaders = new Headers();

	var myInit = { method: 'GET',
	               headers: myHeaders,
	               // mode: 'cors',
	               cache: 'default' };

	fetch( url, myInit)
	.then( response => response.json() )
  	.then( json => collect(json) )
  	.catch( error => console.error('error:', error) );
}

function currencyFormat(num) {
  return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function open_modal(modal, ref) {
	alert("Coucou "+ref);
	modal.style.display = "block";
}


window.onload = function() {

	// --- Get the modal ---
	let modal = document.getElementById("modal-film");
	
	// --- Get the <span> element closeing the modal ---
	let close_btn = document.getElementsByClassName("modal__close")[0];

	// --- Set onclick actions to open the modals ---
	let elems = document.getElementsByTagName("*");
	// let vignettes_btns = [];
	for (let i=0, m=elems.length; i<m; i++) {
    		if (elems[i].id && elems[i].id.indexOf("cat_") != -1) {
			// vignettes_btns.push(elems[i]);
			elems[i].onclick = function(){
				open_modal(modal, elems[i].id);
			}
    		}
	}
	// console.log(vignettes_btns);


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

	//modal.style.display = "block"; // TODO tmp
	//callTest("http://localhost:8000/api/v1/titles/499549");
	callTest("http://localhost:8000/api/v1/titles/9");
	//callTest("http://localhost:8000/api/v1/titles/?format=json");
	//callTest("http://localhost:8000/api/v1/titles/");
}
