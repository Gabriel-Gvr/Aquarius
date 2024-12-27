const config = {
    apiBaseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://aquarius-f2dfa6dc39b0.herokuapp.com/'  // URL do servidor de produção
      : 'http://localhost:3000'        // URL do ambiente de desenvolvimento
  };
  
  export default config;
  