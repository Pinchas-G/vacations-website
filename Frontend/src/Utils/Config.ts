class Config {
    public registerUrl = 'http://localhost:4000/api/register/';
    public loginUrl = 'http://localhost:4000/api/login/';
    public usersUrl = 'http://localhost:4000/api/users/';
    public vacationsUrl = 'http://localhost:4000/api/vacations/';
    public followersUrl = 'http://localhost:4000/api/followers/';
}

const appConfig = new Config();
export default appConfig;