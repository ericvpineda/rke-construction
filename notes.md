To-Do:
- update projects page to allow for image close up view
- add admin login to allow for image CRUD 
    - add tabs/buttons for image data filtering
        - ex: most recent, etc.
- images page
    - add redis for image caching
- add edit image functionality
    - create server route for edit particular image
- add delete image functionality
- add useinifinite query for admin image scroll
- impplement error responses with toast messgaes

Problems:
- navbar shutters on link press
- some images resize to different sizes
- fetch route to login shows username and password in navigation url
- get all images route asc/desc does not work


Completed 
- route/UI for navigation
- routes/pages:
    - home
    - about
    - projects
    - image
        - search bar
        - implement infinte scrolling of images 
        - store images in upstack
- create logout functionality 
- add edit image functionality
    - create edit image popup ui
    - add default value placeholders

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
- jwt does not run on edge runtime
    - https://github.com/vercel/next.js/issues/43115
- next13 middleware 
    - Get cookies from nextJS middleware
        - https://maxschmitt.me/posts/next-js-cookies
    - where to place middleware.js
        - solution: at top of root directory
        - link: https://stackoverflow.com/questions/76350773/next-js-middleware-not-functioning-correctly-in-typescript-what-am-i-doing-wro
- prisma.schema file does not allow conditional logic
    - link: https://github.com/prisma/prisma/discussions/20661

Issues:
- images that did not upload properly:
    - ERROR: IMG_1981.JPG upload to cloudinary failure.
    - ERROR: IMG_0561.JPG upload to cloudinary failure.
    - ERROR: IMG_1878.JPG upload to cloudinary failure.
    - ERROR: IMG_1449.JPG upload to cloudinary failure.
    - ERROR: IMG_1711.JPG upload to cloudinary failure.
    - ERROR: IMG_1216.JPG upload to cloudinary failure.
    - ERROR: IMG_1755.JPG upload to cloudinary failure.


Fixed:
- post request to login with middleware does infinite pending request
    - solution: remove method="POST" attribute on form tag
- infinite scroll too much causes page to freeze with loading icon everywhere
    - possible issues:
        - images load too slow (since being rescaled)
        - useinfinitequery may be slow to load images
            - counterarg: images box outline displayed already 
    - solution:
        - make next Image component priority set to true
- axios post/get request sends back html junk  
    - solution: 
        - set headers to application/json
        - remove trycatch redirect from middleware 
- how to connect jwt verification with login header on navbar
    - attempts:
        - use nextjs server action inside of nav component
    - solution:
        - create server route to verify jwt
- nextjs client side redirect does not redirect after post request
    - solution: window.location.replace('/')
    - link: https://stackoverflow.com/questions/76875888/nextjs-redirect-not-working-after-running-post-request
- prisma findMany does not show all fields in return data
    - solution:
        - update seed file with new fields
        - update prisma schema with new fields
        - migrate and generate prisma
        - restart next server
- dropping table 
    - psql -U postgress 
        - password is password
    - \d rke-construction 
    - drop table "Project";
- editing image at scrolled down image causes window to scroll up by default 
    - reason: edit button was link component with href="#"
    - solution: change edit button to button element
- project path contains category
    - problem: if update category, need to move image from one folder to another
    - solution: remove folders and make it one flat folder
        - the database will store the category of the image
- admin image edit cannot quickly update without page having to be reloaded
    - solution: create ImageEdit component that contains fetch update logic
        - update state after image successfully updated

Questions:
- how to best error handle in middleware 
    - ex: https://www.youtube.com/watch?v=CfkiO8wTSOY
- how to best add rate limiter in middleware   
    - ex: https://www.youtube.com/watch?v=h4-2K7nFf7s