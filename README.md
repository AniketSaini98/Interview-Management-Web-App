# Interview Management Web Application

This web application is designed to manage student interviews and data for Team Career Camp.

## Features

- Sign Up and Sign In for employees
- Student management (Add new students, list students)
- Interview management (Add interviews, allocate students, mark results)
- Bonus: External Jobs List (fetching real available jobs)

## Installation

1. Clone the repository: `git clone <https://github.com/AniketSaini98/Placement-Cell-NodeJS-Web-App>`
2. Navigate to the project directory: `cd <project_directory>`
3. Install dependencies: `npm install`

## Configuration

1. Create a `.env` file in the project root and configure the following environment variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost/interview_app
SECRET_KEY=your_secret_key
```

## Database

1. Set up MongoDB and create a database named "interview_app".
2. Design your database schema based on the provided requirements.

## Running the Application

1. Run the development server: `npm start`
2. Access the application in your browser: `http://localhost:3000`

## Folder Structure

- `config/`: Configuration files
- `controllers/`: Route handlers and logic
- `models/`: MongoDB schema models
- `public/`: Static files (styles, scripts)
- `routes/`: Express route definitions
- `views/`: EJS templates
- `app.js`: Application entry point

## Technologies Used

<img src="https://img.icons8.com/?size=512&id=54087&format=png" alt="NodeJS" width="100px" height="100px"/>
`Node: Runtime environment for server-side JavaScript`
<img src="https://img.icons8.com/?size=512&id=PZQVBAxaueDJ&format=png" alt="NodeJS" width="100px" height="100px"/>
`Express: Web application framework for Node.js.`
<img src="https://img.icons8.com/?size=512&id=8rKdRqZFLurS&format=png" alt="NodeJS" width="100px" height="100px"/>
`MongoDB: NoSQL database for storing interview data.`
<img src="https://img.icons8.com/?size=512&id=Pxe6MGswB8pX&format=png" alt="NodeJS" width="100px" height="100px"/>
`EJS: Embedded JavaScript templates for rendering dynamic content.`
<img src="https://www.passportjs.org/images/PassportJS.svg" alt="NodeJS" width="100px" height="100px"/>
`Passport.js**: Authentication middleware for Node.js.`
<img src="https://axios-http.com/assets/logo.svg" alt="NodeJS" width="100px" height="100px"/>
`Axios: Promise-based HTTP client for making API requests.`
<img src="https://raw.githubusercontent.com/motdotla/dotenv/master/dotenv.svg" alt="NodeJS" width="100px" height="100px"/>
`dotenv: Environment variable management.`
<img src="https://img.icons8.com/?size=512&id=ZMc42tPbG32H&format=png" alt="NodeJS" width="100px" height="100px"/>
`Bootstrap: CSS framework for responsive design.`

## Screenshots

### Login Page
![Alt text](/assets/1.1.Employee_Login.png)

### SignUp Page
![Alt text](/assets/Employee_SignUp_Page.png)

### Career Camp Landing Page
![Alt text](/assets/Career_Camp.png)

### Career Camp With Student & Interview Details Page
![Alt text](/assets/Career_Camp_Student_&_Interview_Details.png)

### Jobs Details Page
![Alt text](/assets/Job_Portal.png)

### Employee Profile Details Page
![Alt text](/assets/Profile.png)

## Contributing

Feel free to contribute by submitting pull requests. Please follow the coding and commit message conventions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

