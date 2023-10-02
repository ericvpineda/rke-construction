To-Do:
- create route and UI for pages:
    - projects, pricing, projects
- search bar -- infinte scrolling
    - for project examples/pictures
    - add redis for image caching
    - add upstack for image storing

Completed 
- route/UI for navigation
- home page 

Problems:
- navbar shutters on link press

Technologies:
- upstash: serverless redis
    - https://console.upstash.com/
- uploadthing: cloud storage for images
    - https://uploadthing.com/
- orm: prisma
    - database type: postgresql

Notes:
- to use nodemon, place this inside of package.json: 
    - ,"type": "module"
- prisma does not have a @required attribute
    - automatically requires if does not have ? modifier
- rename .js files to .mjs files to run files with es6 statements (ex: import)