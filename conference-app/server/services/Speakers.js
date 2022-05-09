/* eslint-disable class-methods-use-this */
const axios = require("axios");
const url = require('url');
const crypto = require('crypto');
const fs = require('fs');
const util = require('util');

const fsexists = util.promisify(fs.exists);

const CircuitBreaker = require("../lib/CircuitBreaker");

const circuitBreaker = new CircuitBreaker();

const serviceName = "speakers-service";

class SpeakersService {
  constructor({ serviceRegistryURL, serviceVersion }) {
    this.serviceRegistryURL = serviceRegistryURL;
    this.serviceVersion = serviceVersion
    this.cache = {};
  }

  async getImage(path) {
    const { ip, port } = await this.getService(serviceName);
    return this.callService({
      method: "get",
      responseType: "stream",
      url: `http://${ip}:${port}/images/${path}`,
    });
  }

  async getNames() {
    const { ip, port } = await this.getService(serviceName);
    return this.callService({
      method: "get",
      url: `http://${ip}:${port}/names`,
    });
  }

  async getListShort() {
    const { ip, port } = await this.getService(serviceName);
    return this.callService({
      method: "get",
      url: `http://${ip}:${port}/list-short`,
    });
  }

  async getList() {
    const { ip, port } = await this.getService(serviceName);
    return this.callService({
      method: "get",
      url: `http://${ip}:${port}/list`,
    });
  }

  async getAllArtwork() {
    const { ip, port } = await this.getService(serviceName);
    return this.callService({
      method: "get",
      url: `http://${ip}:${port}/artwork`,
    });
  }

  async getSpeaker(shortname) {
    const { ip, port } = await this.getService(serviceName);
    return this.callService({
      method: "get",
      url: `http://${ip}:${port}/speaker/${shortname}`,
    });
  }

  async getArtworkForSpeaker(shortname) {
    const { ip, port } = await this.getService(serviceName);
    return this.callService({
      method: "get",
      url: `http://${ip}:${port}/artwork/${shortname}`,
    });
  }

  async callService(requestOptions) {
    const servicePath = url.parse(requestOptions.url).path;
    const cacheKey = crypto.createHash('md5').update(requestOptions.method + servicePath).digest('hex');
    const result = await circuitBreaker.callService(requestOptions);

    let cacheFile = null;
    if (requestOptions.responseType && requestOptions.responseType === 'stream') {
      cacheFile = `${__dirname}/../../_imagecache/${cacheKey}`;
    }

    if (!result) {
      if (this.cache[cacheKey]) {
        return this.cache[cacheKey];
      }
      if (cacheFile) {
        const exists = await fsexists(cacheFile);
        if (exists) {
          return fs.createReadStream(cacheFile);
        }
      }
      return false;
    }
    this.cache[cacheKey] = result;

    if (!cacheFile) {
      this.cache[cacheKey] = result;
    } else {
      const ws = fs.createWriteStream(cacheFile);
      result.pipe(ws);
    }

    return result;
  }

  async getService(name) {
    const response = await axios.get(`${this.serviceRegistryURL}/find/${name}/${this.serviceVersion}`);
    return response.data;
  }
}

module.exports = SpeakersService;
