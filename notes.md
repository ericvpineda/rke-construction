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
- host images:

Notes:
- to use nodemon, place this inside of package.json: 
    - ,"type": "module"
- prisma does not have a @required attribute
    - automatically requires if does not have ? modifier
- rename .js files to .mjs files to run files with es6 statements (ex: import)
- tailwindcss + bootstrap conflict in css 

Issues:
- images that did not upload properly:
    - ERROR: IMG_1981.JPG upload to cloudinary failure.
    - ERROR: IMG_0561.JPG upload to cloudinary failure.
    - ERROR: IMG_1878.JPG upload to cloudinary failure.
    - ERROR: IMG_1449.JPG upload to cloudinary failure.
    - ERROR: IMG_1711.JPG upload to cloudinary failure.
    - ERROR: IMG_1216.JPG upload to cloudinary failure.
    - ERROR: IMG_1755.JPG upload to cloudinary failure.
- infinite scroll too much causes page to freeze with loading icon everywhere
    - possible issues:
        - images load too slow (since being rescaled)
        - useinfinitequery may be slow to load images
            - counterarg: images box outline displayed already 
    - solution:
        - make next Image component priority set to true