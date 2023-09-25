import { readdirSync } from 'fs';
import path from 'path';
import { __dirname } from '../constants/dirname.js';

export function handleEvents() {
  searchEvents();
}

function searchEvents() {
  const eventFolders: string[] = readdirSync(
    path.join(__dirname, '../events/')
  );
  for (const eventFolder of eventFolders) {
    const eventFiles: string[] = readdirSync(
      path.join(__dirname, `../events/${eventFolder}`)
    );
    for (const eventFile of eventFiles) {
      loadEvent(eventFolder, eventFile);
    }
  }
}

function loadEvent(eventFolder: string, eventFile: string) {
  import(`../events/${eventFolder}/${eventFile}`);
  console.log('Loaded new event: ' + eventFile);
}
