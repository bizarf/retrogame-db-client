# RetroGame-DB - FastAPI - Client

This is the frontend client which makes use of the REST API I made for a retro video game themed database using FastAPI with PyMySQL. The goal of this client is to further improve my understanding of React, and authentication with JWTs.

-   [View the live site here](https://bizarf.github.io/retrogame-db-client/)
-   [View the RetroGame DB Python API repo](https://github.com/bizarf/retrogame-db-python-api)

#### Install:

To run this project on your local server, first install the dependencies with the command:

```
npm install
```

Now create a file called ".env.development" and ".env.production" at the root of the project and inside each file add:

```
VITE_API_HOST="(backend_host_location)"
```

The VITE_API_HOST variable in ".env.development" is for development purposes, while the variable in ".env.production" is used when Vite builds the site.

Finally, you can start the server with:

```
npm run dev
```

<hr>

#### Features

-   [x] Admin CRUD features
-   [x] Favourite system
-   [x] Light and dark mode toggle
-   [x] Registration and login system
-   [x] JWT access and refresh tokens
-   [x] Mobile support
-   [ ] User game rating system

##### Tools and technologies used:

-   React
-   Vite
-   Typescript
-   Zustand
-   Tailwind CSS
-   Preline CSS
-   Universal-Cookie
