export const questions = [
    {q: "What are your top three hobbies or activities?", example: "Tennis, Reading, Programming"},
	{q: "What kind of food or cuisine do you enjoy?", example: "Ramen"},
	{q: "What is your favorite type of music/artist?", example: "Rap"},
    {q: "What is your favorite show/book genre?", example: "Thriller"},
    {q: "What are three words you would use to describe your ideal hangout?", example: "Crowds, Loud, Games"},
    {q: "Do you have any deal breakers when it comes to choosing a friend?", example: "Dishonesty"},
    {q: "How do you usually spend your weekends?", example: "Parties"},
    {q: "What kind of personality do you prefer in a friend?", example: "Chill"}
];

export type QuestionWithExamples = {
	q: string;
	example: string;
}

export const API_URL = "http://139.144.57.146:8000";
