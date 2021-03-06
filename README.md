# JustStreamIt

JustSteamIt is a simple web-page used to display some informations extracted from [OCMovies-API-EN-FR](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR) in order to practice interactions with APIs.

## Usage

This website can be used on any regular hosting service or locally

## Remote hosting
In order to run this project on a regular hosting service, you will need follow the 'Local hosting' instructions bellow (on the remote server obviously), or simply upload the html/js/css files if you plan to run the API locally.

In either cases, you will need to edit the js/script.js file to change the base API url const.

## Local hosting

### Install OCMovies-API
let's install OCMovies-API-EN-FR API using the instructions provided on the [github page](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR) (below is one of the two provided install methods).

1. Clone the API repository using
```bash
>>> git clone https://github.com/pythonmentor/ocmovies-api.git
```
2. Move to the ocmovies-api root folder with
```bash
>>> cd ocmovies-api-en
```
3. Create a virtual environment for the project with
```bash
>>> python3 -m venv env (on macos or linux)
or
>>> py -m venv env (on windows)
```
4. Activate the virtual environment with 
```bash
>>> source env/bin/activate (on macos or linux)
or
>>> env\Scripts\activate (on windows)
```
5. Install project dependencies with
```bash
>>> pip install -r requirements.txt
```
6. Create and populate the project database with
```bash
>>> python manage.py create_db
```


### Install Python HTTP Server
this website use async requests to fetch the API data, so in order to avoid CORS policy errors, let's run a simple local HTTP server using Python (but you can also use another HTTP server).

If you are using Linux or macOS, it should be available on your system already. If you are a Windows user, you can get an installer from the Python homepage.


## Start local services
let's run the API and HTTP servers

### API server
open a terminal and move to the ocmovies-api-en folder, then activate the virtual environment with

```bash
>>> source env/bin/activate (on macos or linux)
or
>>> env\Scripts\activate (on windows)
```

and start the server using the following command
```bash
>>> python manage.py runserver
or
>>> py manage.py runserver
```

### HTTP server
open ANOTHER terminal, navigate to the directory in which you installed/cloned this website and run the following command 
```bash
>>> python3 -m http.server 7800 --bind 127.0.0.1
or
>>> python -m http.server 7800 --bind 127.0.0.1
or
>>> py -m http.server 7800 --bind 127.0.0.1
```
This will run the contents of the directory on port 7800 of the local web server.


## Use the website
once both services running, you can consult the webpage using the following address: http://127.0.0.1:7800

## Edit content / style / requests
in order to modify the website, you can directly edit the html, css and js files.

However, the Sass pre-processor was used to handle the CSS nesting. So if you really intend to change anything, you should use Sass too.

The scss file can be found in the css folder and in order to generate a new css whenever you modify the file, you need to install [Sass](https://sass-lang.com/install) and then run it using this command
```bash
>>> sass --watch css/style.scss css/style.css
or
>>> PATH_TO_SASS/sass --watch css/style.scss css/style.css
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
