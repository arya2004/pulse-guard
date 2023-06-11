# IoT based Novel Approach for Remote Patient Pulse Rate Monitoring System with Stroke Prediction using Logistic Regression

This repository contains code for pulseGuard project, which includes three main components: ESP32 Code, Express MVC, and Flask API. This project combines IoT sensor data from a pulse sensor connected to an ESP32 microcontroller, a web application built using the Express MVC framework, and a Flask API for stroke prediction.

## ESP32 Code

The `ESP32` folder contains the code for programming the ESP32 microcontroller. It interfaces with a pulse sensor to capture pulse data from the user. The code reads the pulse sensor data and sends it to the web application for further processing. Follow the instructions in the ESP32 Code README for installation, usage, and configuration.

## Express MVC

The `Express` folder contains the code for the Express MVC web application. It receives the pulse data from the ESP32 microcontroller and performs necessary computations and analysis to predict the likelihood of a stroke. The application provides a user-friendly interface to visualize the pulse data and stroke prediction results. Refer to the Express MVC README for installation, usage, and configuration instructions.

## Flask API

The `FlaskAPI` folder contains the code for the Flask API responsible for stroke prediction. It receives the processed pulse data from the Express MVC web application and applies machine learning algorithms to predict the likelihood of a stroke. The Flask API exposes endpoints for the web application to send the data and receive the prediction results. Consult the Flask API README for installation, usage, and configuration details.

## Requirements

To use this project, ensure that you have the following:

- ESP32 microcontroller
- Pulse sensor connected to the ESP32
- Node.js 12.0.0 or higher
- Python 3.6 or higher
- Arduino IDE or platform-specific IDE (e.g., ESP-IDF) installed
- Dependencies specified in the ESP32 Code, Express MVC, and Flask API README files

## Deployment

To deploy the IoT Pulse Sensing and Stroke Prediction project in a production environment, consider the following:

1. Set up the ESP32 microcontroller with the pulse sensor and configure it to send data to the web application.

2. Deploy the Express MVC web application on a server or hosting platform. Ensure that you configure the necessary settings, such as database connections and API endpoints.

3. Deploy the Flask API on a server or hosting platform. Configure the API endpoints and connect it to any required machine learning models or data sources.

4. Ensure that the web application and Flask API communicate with each other correctly by configuring the appropriate URLs and data formats.

5. Test the deployment thoroughly to ensure all components are functioning as expected.

It is recommended to consider security, performance, and scalability requirements when deploying the project to a production environment.

## Contributing

Contributions to this IoT Pulse Sensing and Stroke Prediction project are welcome! If you find any issues, have suggestions for improvements, or want to add new features, please open an issue or submit a pull request.

## License

This IoT Pulse Sensing and Stroke Prediction project is open-source and is licensed under the [MIT License](LICENSE).

## Acknowledgements

This project builds upon the work of various open-source communities, including ESP32, Express, and Flask. We would like to express our gratitude for their valuable contributions.

## Contact

If you have any questions or need further assistance, feel free to contact [arya2004](mailto:arya.pathak2004@gmail.com).
