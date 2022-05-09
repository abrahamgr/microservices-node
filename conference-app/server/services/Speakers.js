/* eslint-disable class-methods-use-this */
const axios = require("axios");

const serviceName = "speakers-service";

class SpeakersService {
  constructor({ serviceRegistryURL, serviceVersion }) {
    this.serviceRegistryURL = serviceRegistryURL;
    this.serviceVersion = serviceVersion
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
    const response = await axios(requestOptions);
    return response.data;
  }

  async getService(name) {
    const response = await axios.get(`${this.serviceRegistryURL}/find/${name}/${this.serviceVersion}`);
    return response.data;
  }
}

module.exports = SpeakersService;
