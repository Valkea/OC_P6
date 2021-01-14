
window.onload = function() {

	// Get the modal
	let modal = document.getElementById("modal-film");
	
	// Get the button that opens the modal
	let open_btn = document.getElementById("modal__open");
	
	// Get the <span> element that closes the modal
	let close_btn = document.getElementsByClassName("modal__close")[0];

	// When the user clicks on the button, open the modal
	open_btn.onclick = function() {
	  modal.style.display = "block";
	}
	
	// When the user clicks on <span> (x), close the modal
	close_btn.onclick = function() {
	  modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	  if (event.target == modal) {
	    modal.style.display = "none";
	  }
	}
}
