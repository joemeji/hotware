import algoliasearch from 'algoliasearch/lite';

export const ALGOLIA_APP_ID = 'F23BA11X9Z';
export const ALGOLIA_ADMIN_KEY = '49df8ac6a1c6ea297d2c3ef944021e2b';
export const PER_PAGE = 15;

export const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);