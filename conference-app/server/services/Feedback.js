/* eslint-disable class-methods-use-this */
const url = require('url');
const axios = require('axios');
const crypto = require('crypto');
const amqplib = require('amqplib');

const CircuitBreaker = require('../lib/CircuitBreaker');

const circuitBreaker = new CircuitBreaker();

const serviceName = "feedback-service";

class FeedbackService {
  constructor({ serviceRegistryURL, serviceVersion }) {
    this.serviceVersion = serviceVersion;
    this.serviceRegistryURL = serviceRegistryURL;
    this.cache = {};
  }

  async getList() {
    const { ip, port } = await this.getService(serviceName);
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/list`,
    });
  }

  async addEntry(name, title, message) {
    const q = 'feedback';
    const conn = await amqplib.connect('amqp://localhost');
    const ch = await conn.createChannel();
    await ch.assertQueue(q);
    const qm = JSON.stringify({ name, title, message });
    return ch.sendToQueue(q, Buffer.from(qm, 'utf8'));
  }

  async callService(requestOptions) {
    const parsedUrl = url.parse(requestOptions.url);
    const cacheKey = crypto.createHash('md5').update(requestOptions.method + parsedUrl.path).digest('hex');

    const result = await circuitBreaker.callService(requestOptions);

    if (!result) {
      if (this.cache[cacheKey]) {
        return this.cache[cacheKey];
      }
      return null;
    }

    this.cache[cacheKey] = result;
    return result;
  }

  async getService(servicename) {
    const response = await axios.get(`${this.serviceRegistryURL}/find/${servicename}/${this.serviceVersion}`);
    return response.data;
  }
}

module.exports = FeedbackService;
