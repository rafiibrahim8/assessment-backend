[![License][License-shield]][License-url]
# assesment-backend

An assessment evaluation backed using Express MongoDB

## Getting Started
Edit `.env` file before starting.
### On your host machine

```sh
git clone https://github.com/rafiibrahim8/assesment-backend.git
cd assesment-backend
npm install
npm run create-admin -- --username <username> --password <password>
npm start
```
### Using docker
Edit ports on `Dockerfile` and `docker-compose.yml`. Then run:

```sh
docker-compose up
```

[License-shield]: https://img.shields.io/github/license/rafiibrahim8/assesment-backend
[License-url]: https://github.com/rafiibrahim8/assesment-backend/blob/master/LICENSE
