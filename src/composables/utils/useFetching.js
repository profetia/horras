import axios from 'axios';

export default (address, callback, errorCatch, method = 'get') =>
  async () =>
    await axios[method](import.meta.env.VITE_API_BASE + address)
      .then(callback)
      .catch(errorCatch);
