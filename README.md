[![License][License-shield]][License-url]
# assessment-backend

An assessment evaluation backed using Express MongoDB

## Getting Started
Edit `.env` file before starting.
### On your host machine

```sh
git clone https://github.com/rafiibrahim8/assessment-backend.git
cd assessment-backend
npm install
npm run create-admin -- --username <username> --password <password>
npm start
```
### Using docker
Edit ports on `Dockerfile` and `docker-compose.yml`. Then run:

```sh
docker-compose up
```

[License-shield]: https://img.shields.io/github/license/rafiibrahim8/assessment-backend
[License-url]: https://github.com/rafiibrahim8/assessment-backend/blob/master/LICENSE
