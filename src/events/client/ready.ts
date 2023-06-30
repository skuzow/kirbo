import { client } from '../../index.js';

client.once('ready', () => {
  console.log('Logged in as: ' + client.user?.tag);
});
