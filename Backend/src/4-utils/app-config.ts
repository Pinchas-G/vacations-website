class AppConfig {
    // Server
    public SERVER_PORT: number;
    public CLIENT_PORT: number;
    public serverUrl: string;
    
    // DB
    public host: string;
    public database: string;
    public user: string;
    public password: string;
    
    // App
    public isProduction: boolean;
    
    // Urls
    public vacationsUrl: string;
    public vacationsImagesUrl: string;
  
    constructor() {
      // Server
      this.SERVER_PORT = 4000;
      this.CLIENT_PORT = 3000;
      this.serverUrl = `http://localhost:${this.SERVER_PORT}`;
  
      // DB
      this.host = 'localhost';
      this.database = 'vacations';
      this.user = process.env.NODE_ENV === 'production' ? 'pinchas' : 'root';
      this.password = process.env.NODE_ENV === 'production' ? '$Rt&#klmn^!GH' : '';
  
      // App
      this.isProduction = process.env.NODE_ENV === 'production';
  
      // Urls
      this.vacationsUrl = `${this.serverUrl}/api/vacations/`;
      this.vacationsImagesUrl = `${this.serverUrl}/api/vacations/images/`;
    }
  }
  
  const appConfig = new AppConfig();
  export default appConfig;
  