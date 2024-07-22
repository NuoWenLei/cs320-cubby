# Cubby
## Links:
### Github link: https://github.com/NuoWenLei/cs320-cubby.git
### Website link: https://cs320-cubby.vercel.app/
### Web API documentation link (DEPRICATED): https://cubbyapi.com/docs
## Team members (include cs logins) and division of labor;
- Nuo Wen Lei (nlei): React frontend, backend, testing
- Ava Wang (zwang200): frontend design, testing
- Seung-Heon Dave Song(ssong43): Frontend design, backend, testing 
- Muhiim Ali (mali37): backend, testing
## Include the total estimated time it took to complete the project:
3 weeks
## Project purpose:
Our project is a friend group finder that allows people (main audience being college students) to branch out of their immediate friend groups and join new friend groups with similar interests. Users can set up their profile with some questions about their interests, etc and then we can use clustering algorithms to create new friend groups based on their interests.
During college, there are very few times or places for people to branch out and meet new people. Because of this, students usually stick with one friend group for most of their time in college. Therefore, we want to offer a platform for those who want to meet new friends outside of their friend group to do just that! 
## Design choices -- high-level design of your program
### Frontend Pages:

- `index.tsx`: This file contains the landing page.
- `signup.tsx`: This file contains the React component that renders the sign-up page, where users can enter their name, answer a set of questions and sign up using their Google account.
- `profile.tsx`: This is the profile page of the user. It is responsible for rendering and updating the user's profile information, including their name and answers to a set of predefined questions.
- `groups.tsx`: displays a user's groups and the members of each group using Firebase functions. The component uses the following sub-components:
  - `GroupInterface`: Displays the selected group and its members
  - `Sidebar`: Displays a list of groups for the user to choose from.
- `create_community.tsx`: This component renders a form that allows users to create an application to start a community. It uses the Firebase Authentication and Cloud Firestore to write data to the backend. 
- `communities.tsx`: responsible for displaying interest groups that the user can join. It contains a searchbar component, which allows users to search for interest groups by typing keywords.
- `matches.tsx`: displays a list of group invitations and allows the user to join or reject these invitations.

### Backend
- `main.py`: FastAPI script for running the API on the server.
- `cron.py`: clusters user data using KMeans clustering, creates friend groups based on the clustering, and matches users to their respective groups.
- `preprocess.py`: loads pre-trained word embeddings from "glove.6B.50d.txt" and saves them to two files: "word_embed.npy" and "word_index.json". The embeddings are stored in a numpy array, and each word in the array is associated with an index. The "word_index.json" file stores a list of [index, word] pairs, and the "word_embed.npy" file stores the word embeddings.
- `populate_mock.py`: one-time script used for populating the Firebase with randomly generated mock data.

### Backend Endpoints
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
- The python package versions used only support python versions between `3.6` and `3.8`.
- Some mobile users have shown that signing up through mobile devices can cause a blank screen to appear although this bug has __not__ been reproduced in the latest version.

## Setup

### Frontend
- Install necessary packages for frontend.
```bash
npm install
```

### Backend
- Create and activate virtual environment.
- Install necessary python packages.
```bash
python3 -m venv cubby

source cubby/bin/activate

pip3 install -r requirements.txt
```

### How to run..
#### Tests
- To run the tests on the back end, activate the cubby environment and type pytest.
- To run frontend tests, do npm test
#### Frontend:
```bash 
npm run dev
# or
yarn dev
# or
pnpm dev
```
#### Backend (Local):
```bash
cd backend

uvicorn main:app --reload
```
For the hosted API documentation, visit https://cubbyapi.com/docs.







