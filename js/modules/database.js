/* global indexedDB */

// Module for interacting with IndexedDB without Backbone IndexedDB adapter
// and using promises. Revisit use of `idb` dependency as it might cover
// this functionality.

exports.open = (name, version) => {
  const request = indexedDB.open(name, version);
  return new Promise((resolve, reject) => {
    request.onblocked = () =>
      reject(new Error('Database blocked'));

    request.onupgradeneeded = event =>
      reject(new Error('Unexpected database upgrade required:' +
        `oldVersion: ${event.oldVersion}, newVersion: ${event.newVersion}`));

    request.onerror = event =>
      reject(event.target.error);

    request.onsuccess = (event) => {
      const connection = event.target.result;
      resolve(connection);
    };
  });
};

exports.completeTransaction = transaction =>
  new Promise((resolve, reject) => {
    transaction.addEventListener('abort', event => reject(event.target.error));
    transaction.addEventListener('error', event => reject(event.target.error));
    transaction.addEventListener('complete', () => resolve());
  });

