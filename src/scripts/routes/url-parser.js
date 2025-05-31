/**
 * Fungsi untuk memecah path URL menjadi segmen-segmen.
 * @param {string} path - Path URL yang ingin diparsing
 * @returns {Object} - Objek yang berisi `resource` dan `id` dari path
 */
function extractPathnameSegments(path) {
  const splitUrl = path.split('/');

  return {
    resource: splitUrl[1] || null,
    id: splitUrl[2] || null,
  };
}

/**
 * Fungsi untuk membangun kembali route URL dari segmen-segmen path.
 * @param {Object} pathSegments - Objek yang berisi `resource` dan `id`
 * @returns {string} - URL route yang dibangun
 */
function constructRouteFromSegments(pathSegments) {
  let pathname = '';

  if (pathSegments.resource) {
    pathname = pathname.concat(`/${pathSegments.resource}`);
  }

  if (pathSegments.id) {
    pathname = pathname.concat('/:id');
  }

  return pathname || '/';
}

/**
 * Fungsi untuk mendapatkan path aktif dari hash URL (menghapus tanda '#').
 * @returns {string} - Path aktif (misalnya '/story/123')
 */
export function getActivePathname() {
  return location.hash.replace('#', '') || '/';
}

/**
 * Fungsi untuk mendapatkan route aktif yang dibangun berdasarkan path aktif.
 * @returns {string} - Route aktif (misalnya '/story/:id')
 */
export function getActiveRoute() {
  const pathname = getActivePathname();
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

/**
 * Fungsi untuk memparsing pathname aktif menjadi segmen-segmen path.
 * @returns {Object} - Segmen-segmen path yang berisi `resource` dan `id`
 */
export function parseActivePathname() {
  const pathname = getActivePathname();
  return extractPathnameSegments(pathname);
}

/**
 * Fungsi untuk mendapatkan route berdasarkan pathname yang diberikan.
 * @param {string} pathname - Pathname yang ingin diproses
 * @returns {string} - Route yang dibangun berdasarkan pathname
 */
export function getRoute(pathname) {
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

/**
 * Fungsi untuk memparsing pathname yang diberikan menjadi segmen-segmen path.
 * @param {string} pathname - Pathname yang ingin diparsing
 * @returns {Object} - Segmen-segmen path yang berisi `resource` dan `id`
 */
export function parsePathname(pathname) {
  return extractPathnameSegments(pathname);
}
