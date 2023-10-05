FORTIS || OPEN PROJECT

Summary of work done:

SETUP (Mainly Jessica)

- Set-up a running localhost and hosted version of our web app (on Vercel)
    - We ran into a lot of problems with importing flask, so we updated our stack and set-up accounting for that.
      Now we are using next-js directly linked to postgre via POST.
- Created a main dashboard navigating between next.js pages.
    - This includes our main 5 pages alongside a dynamic log-in/log-out button.
- We also wrote the queries connected to a future front-end component that populates our database.
    - For now, this meant populating our database with dummy data:
        - We added to user and user_data synchronously so that they are linked together for each user/
        - We added excercises with different muscle groups, names, popularity etc.

APIs Implemented

- Auth0 - Jessica
    - First, we used an Auth0 api to facilitate the user authentication process, allowing for google integration.
    - We made a log-in/log-out button that interacts with that API to provide a user's name and email.
    - We then set-up an insert query into the database that adds/updates that information for the user.
    - The website's homepage finally changes state to a "logged-in version" displaying the name/email 

- Search Excercise by Name - Austin, Swarajh
    - We added a searchbar and a displayed list such that anything written to the searchbar is recorded and results are displayed.
    - We set-up a search query from the database so that each change in input to the searchbar prompts a new query
      that selects all relevant excercises based on name and returns them.
    - This returned output is then parsed and added to the displayed list so that it is dynamic as the user types/deletes stuff.
    - Finally, we made a default sort by "popularity" of each excercise.

- Filter Excercise by Muscle Group - Anirudh, Swarajh
    - For now, we added a few buttons to our Discover tab corresponding to different muscle groups.
    - Clicking on one of them toggles it to change colour (only one button can be toggled at one time) and queries the database.
    - The query returns and lists to the discover tab, the set of excercises corresponding to the muscle group.
    - The muscle groups output all subsets of them (for example: Push would also show chest and trciep excercises etc.)
    - Again, this is sorted by "popularity".

- Search Users by Name - Swarajh, Austin
    - Similarly to the Excercise search, we implemented a searchbar in the social tab.
    - A search query is called each change in input that returns all users with the searched substring in their name.
    - This returned output is then parsed and added to the displayed list.

- Search Users by Email - Benjamin, Austin
    - ...

Team Members: 
- 
Jessica Chen (jc939)
-- 
Anirudh Jain (aj383)
-- 
Swarajh Mehta (sm961) 
-- 
Austin Huang (ash110)
--
Benjamin Chauhan (bsc32) 
-- 

GitHub:
https://github.com/jess-che/fortis