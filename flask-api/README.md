# Flask Server

This is a simple Flask server that provides a basic API for handling HTTP requests. It can be used as a starting point for building web applications or RESTful APIs using Flask.

## Requirements

- Python 3.6 or higher
- Flask 2.0.1 or higher (installed automatically via `requirements.txt`)

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/arya2004/pulseGuard
   ```

2. Change into the project directory:

   ```bash
   cd FlaskAPI
   ```

3. (Optional) Create and activate a virtual environment:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

4. Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. Start the Flask server:

   ```bash
   python app.py
   ```

   The server will start running on `http://localhost:5000`.

2. Use your preferred API testing tool (e.g., cURL, Postman) to send HTTP requests to the server endpoints.

## API Endpoints

The server provides the following API endpoints:


- `POST /lul` - Returns the probability of occurence of Stroke



## Configuration

The Flask server can be configured by modifying the `config.py` file. It currently supports the following configurations:

- `DEBUG` - Controls whether debug mode is enabled (`True`) or disabled (`False`).
- `HOST` - The host address on which the server will listen.
- `PORT` - The port number on which the server will listen.

## Deployment

To deploy this Flask server to a production environment, you can use various deployment methods, such as:

- Deploying to a cloud hosting provider (e.g., Heroku, AWS, Google Cloud Platform)
- Using a containerization platform (e.g., Docker, Kubernetes)
- Configuring a web server (e.g., Nginx, Apache) as a reverse proxy for the Flask application

Make sure to consider security, performance, and scalability requirements when deploying to a production environment.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.

## License

This Flask server is open-source and is licensed under the [MIT License](LICENSE).

## Acknowledgements

This Flask server is based on the Flask microframework. Thanks to the Flask community for their excellent work.

## Contact

If you have any questions or need further assistance, feel free to contact [arya2004](mailto:arya.pathak2004@gmail.com).