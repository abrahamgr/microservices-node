/* eslint-disable class-methods-use-this */
const fs = require('fs');
const util = require('util');
const axios = require("axios");

// const readFile = util.promisify(fs.readFile);

const serviceName = "speakers-service";

class SpeakersService {
  constructor(datafile) {
    this.datafile = datafile;
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
    const response = await axios.get(`http://localhost:3000/find/${name}/1`);
    return response.data;
  }
}

module.exports = SpeakersService;
