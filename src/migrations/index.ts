import * as migration_20261002_200404_init from './20261002_200404_init';
import * as migration_20261002_210029_add_cms_collections from './20261002_210029_add_cms_collections';
import * as migration_20261003_005217_add_media_uploads_and_tour_details from './20261003_005217_add_media_uploads_and_tour_details';

export const migrations = [
  {
    up: migration_20261002_200404_init.up,
    down: migration_20261002_200404_init.down,
    name: '20261002_200404_init',
  },
  {
    up: migration_20261002_210029_add_cms_collections.up,
    down: migration_20261002_210029_add_cms_collections.down,
    name: '20261002_210029_add_cms_collections',
  },
  {
    up: migration_20261003_005217_add_media_uploads_and_tour_details.up,
    down: migration_20261003_005217_add_media_uploads_and_tour_details.down,
    name: '20261003_005217_add_media_uploads_and_tour_details'
  },
];
