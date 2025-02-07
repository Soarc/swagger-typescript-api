const https = require("https");
const fetch = require("node-fetch-h2");

class Request {
  /**
   * @type {CodeGenConfig}
   */
  config;
  /**
   * @type {Logger}
   */
  logger;

  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
  }

  /**
   *
   * @param url
   * @param disableStrictSSL
   * @param authToken
   * @param options {Partial<import("node-fetch").RequestInit>}
   * @return {Promise<string>}
   */
  async download({ url, disableStrictSSL, authToken, ...options }) {
    /**
     * @type {Partial<import("node-fetch").RequestInit>}
     */
    const requestOptions = {
      ...(this.config.requestOptions || {}),
    };

    if (disableStrictSSL) {
      requestOptions.agent = new https.Agent({
        rejectUnauthorized: false,
      });
    }
    if (authToken) {
      requestOptions.headers = {
        Authorization: authToken,
      };
    }

    Object.assign(requestOptions, options);

    try {
      const response = await fetch(url, requestOptions);
      return await response.text();
    } catch (error) {
      const message = `error while fetching data from URL "${url}"`;
      this.logger.error(message, "response" in error ? error.response : error);
      return message;
    }
  }
}

module.exports = {
  Request,
};
