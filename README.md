# Clone API'S for Medium.com

Application is structured in model, routes and controller. 

## Project Structure
* UserRoutes: User Routes contains all the services specific to the users such as
  * Creating User.
  * User login
  * Updating user profile
  * User deletion
  * User profile pic upload
  * Download user Image
  * Follow User
  * Unfollow User
  * User Following list
* PublicationRoutes: Publication Routes contains all the services specific to publications such as
  * Create the publication.
  * Provides publication by publication id.
  * Get list of all the publication.
  * Update the publication.
  * Delete publication by passing id.
  * Get publication passing user id.
  * Add other members into the publication.
  * Remove members from publication.
  * Add category to publication.
  * Remove category from publication.
  * Allow user to upload photo to publication using uploadPublicationImage.ejs templet
  * Upload photo for publication.
  * Get/Download the image for publication.
* StoriesRoutes: Stories Routes contains all the services specific to stories such as:
  * Get Story by story id
  * Get list of all the stories.
  * Create Stories.
  * Update the stories.
  * Delete the specific story by passing story id.
  * Get all the story by Publication id.
  * Get all the stories specific to user based on user id.
  * Allow user to upload photo to Story using uploadStoryImage.ejs templet
  * Upload photo using this router.
  * Get image for Story.




## Common setup

Clone the repo and install the dependencies.


```bash
git clone https://github.com/Moizrws/MediumDotCom.git
cd MediumDotCom
npm install
```


Start running application using below command

```bash
npm start
```

## API Access

Once application is setup and start running, api can be accessed through:

http://localhost:3050/api-docs/
