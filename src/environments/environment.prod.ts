// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production:true,
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJhZWI0MjdkYS00NjNkLTQxNWItODFmOS00NmZlNjQ1YTEwZmYiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwMzkzMzEzMCwiZXhwIjoxNzA2NTI1MTMwfQ.9KAN7zh8vxwCKowd3ea5A6ZwrMr-9k6wXd5PXzIui8Y',
  // server: 'http://ec2-18-140-60-72.ap-southeast-1.compute.amazonaws.com',
  // api: 'http://ec2-18-140-60-72.ap-southeast-1.compute.amazonaws.com:85/api.php',
  // socket: 'ws://ec2-18-140-60-72.ap-southeast-1.compute.amazonaws.com:3000',
  // nodeserver: 'http://ec2-18-140-60-72.ap-southeast-1.compute.amazonaws.com:3000', 
  server: 'http://34.80.245.142',
  socket: 'ws://34.80.245.142:3000',
  nodeserver: 'http://34.80.245.142:3000', 
  api: 'http://34.80.245.142:85/api.php',
  // nodeserver: 'http://localhost:1000',
// api: 'http://localhost:8080/api/api.php', 
  apiKey: '$2y$10$jDyFxPlQt0iz/JmEwFZGSOrCEwlu.GQRdTXT0gIbRlJHD6w2etZbi',
  socketKey:'$2y$10$jDyFxPlQt0iz/JmEwFZGSOrCEwlu.GQRd1XT0gIbRlJHD6w2etZbi',
  lexicalakey:'c29ff39618mshcedc0e4b8d12b69p18ec51jsnd5550cdbf497',
  lexicalahost: 'lexicala1.p.rapidapi.com',
  ttshost: 'ai-powered-text-to-speech1.p.rapidapi.com',  
  altttshost: 'text-to-speech-for-28-languages.p.rapidapi.com',
  altttsKey: 'f7f4819047mshf8429aae754294dp1c12cbjsn190fff556a62',
  ttskey: 'f7f4819047mshf8429aae754294dp1c12cbjsn190fff556a62',
  assemblyAIToken: '38f74f980c52404da81a28ce2ef82783',
  assemblyAI: 'https://api.assemblyai.com/v2',
  srHost : 'speech-recognition14.p.rapidapi.com',
  srKey: 'c29ff39618mshcedc0e4b8d12b69p18ec51jsnd5550cdbf497',
  deepgramKey:'8902a4cfafaeea168cfc1e10ad14219837e749c9'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
