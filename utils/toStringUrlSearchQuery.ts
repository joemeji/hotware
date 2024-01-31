export function toStringUrlSearchQuery(url: any) {
  let _url = null;

  if (isValidUrl(url)) {
    _url = url;
  } else {
    _url = process.env.API_ENDPOINT + url
  }

  return new URL(_url).search;
}

const isValidUrl = (urlString: any) => {
  try {
    new URL(urlString);
    return true;
  }
  catch(err) {
    return false;
  }
}