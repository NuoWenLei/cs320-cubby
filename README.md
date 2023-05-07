### Project name: Cubby
## Team members (include cs logins) and division of labor;
- Nuo Wen Lei (nlei), React frontend, backend, testing
- Ava Wang (zwang200) frontend design, testing
- Seung-Heon Dave Song(ssong43), Frontend design, backend, testing 
- Muhiim Ali (mali37): backend, testing
### Include the total estimated time it took to complete the project:
3 weeks
## Project purpose:
Our project is a friend group finder that allows people (main audience being college students) to branch out of their immediate friend groups and join new friend groups with similar interests. Users can set up their profile with some questions about their interests, etc and then we can use clustering algorithms to create new friend groups based on their interests.
During college, there are very few times or places for people to branch out and meet new people. Because of this, students usually stick with one friend group for most of their time in college. Therefore, we want to offer a platform for those who want to meet new friends outside of their friend group to do just that! 
### Design choices -- high-level design of your program
## Frontend Pages:

- `Signup.tsx`: This file contains the React component that renders the sign-up page, where users can enter their name, answer a set of questions and sign up using their Google account
- `profile.txt`: This is the profile page of the user. It is responsible for rendering and updating the user's profile information, including their name and answers to a set of predefined questions.
- `groups.txt`: displays a user's groups and the members of each group using Firebase functions. The component uses the following sub-components:
  - `GroupInterface`: Displays the selected group and its members
  - `Sidebar`: Displays a list of groups for the user to choose from.
- `create_community.txt`: This component renders a form that allows users to create an application to start a community. It uses the Firebase Authentication and Cloud Firestore to write data to the backend. 
- `communities.txt`: responsible for displaying interest groups that the user can join. It contains a searchbar component, which allows users to search for interest groups by typing keywords.
- `matches.txt`: displays a list of group invitations and allows the user to join or reject these invitations.



## Backend
- `main.py`: 
- `cron.py`: clusters user data using KMeans clustering, creates friend groups based on the clustering, and matches users to their respective groups.
- `preprocess.py`: loads pre-trained word embeddings from "glove.6B.50d.txt" and saves them to two files: "word_embed.npy" and "word_index.json". The embeddings are stored in a numpy array, and each word in the array is associated with an index. The "word_index.json" file stores a list of [index, word] pairs, and the "word_embed.npy" file stores the word embeddings.
- `populate_mock.py`: 
- 

### Running the API
To run the API, use the following command:
uvicorn main:app --reload

### Endpoints
Endpoints
The following endpoints are available:

- `/`: This endpoint returns a simple message indicating that the API is running.

- `/interestSearch`: 
This endpoint takes a query string as input and returns a list of interest groups that are most relevant to the query.

- `/friendMatches`:
This endpoint takes a user ID as input and returns a list of suggested groups for that user based on their interests and personality.

- `/randomMockUsers`: 
This endpoint generates a number of mock users with random interests and personality traits.






### Known Bugs



### Setup
- npm install to install the necessary packages.
- Activate the cubby environment by running those two commands:
  - python3 -m venv cubby
  - source cubby/bin/activate


### How to run..
#### Tests
- To run the tests on the back end, activate the cubby environment any type pytest.
- To run frontend tests, do npm test
#### Frontend:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
Backend:






