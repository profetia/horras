# Horras: Haikou Online Ride-hailing and Records Analysis System

Horras is a system for analyzing the data of online ride-hailing services in Haikou, China. It is designed to be used in classroom settings, mainly for teaching data analysis and visualization. The backend of Horras can be seen in [Horras-Backend](https://github.com/yanglinshu/horras-backend).

![](/media/preview.png)

## Installation

Horras is a web application built with [Vue.js](https://vuejs.org/).

### Development

To install Horras in a development environment, you need to have [Node.js](https://nodejs.org/) installed. Then, clone this repository and run the following commands in the root directory of the project:

```bash
npm install
npm run dev
```

The application will be running at [http://localhost:3000](http://localhost:3000).

### Production

Horras is recommended to be deployed with [Docker](https://www.docker.com/). To build the Docker image, run the following command in the root directory of the project:

```bash
docker-compose up -d
```

The application will be running at [http://localhost:6699](http://localhost:6699).

## Documentation

Documentation for Horras can be found in the [docs](/docs) directory.

## Misc

Posters and slides for Horras can be found in the [media](/media) directory.

## References

Horras preprocesses its data from the [SARROH](https://github.com/xsjk/ARTS1422-Project).

## License

This repository is licensed under the [MIT License](/LICENSE).
