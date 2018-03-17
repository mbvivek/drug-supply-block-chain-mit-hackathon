import { Injectable } from '@angular/core';
import { Connect, SimpleSigner } from 'uport-connect';

var BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var base58 = require("base-x")(BASE58);
var hex = require("base-x")("0123456789abcdef");

import { sha3_256 } from "js-sha3";
import { Buffer } from "buffer";

@Injectable()
export class UportService {
  uport: any;
  constructor() {
    this.uport = new Connect('Credit Agreement', {
      clientId: '2of76V3H9JWoW6YdXpaLeTpoaEFGRwcorLa',
      network: 'rinkeby',
      signer: SimpleSigner(
        '947483440f13e79e7149022777cd3be31e2fe01d27fd60ff33bc2e7308e68d9b'
      ),
    });
  }

  getUport() {
    return this.uport;
  }

  checksum(payload) {
    return new Buffer(sha3_256(Buffer.concat(payload)), "hex").slice(0, 4);
  }

  encode({ network, address }) {
    const payload = [
      new Buffer("01", "hex"),
      hex.decode(network.slice(2)),
      new Buffer(address.slice(2), "hex")
    ];
    payload.push(this.checksum(payload));
    return base58.encode(Buffer.concat(payload));
  }

  decode(encoded) {
    const data = Buffer.from(base58.decode(encoded));
    const netLength = data.length - 24;
    const version = data.slice(0, 1);
    const network = data.slice(1, netLength);
    const address = data.slice(netLength, 20 + netLength);
    const check = data.slice(netLength + 20);
    if (check.equals(this.checksum([version, network, address]))) {
      return {
        network: `0x${hex.encode(network)}`,
        address: `0x${address.toString("hex")}`
      };
    } else {
      throw new Error("Invalid address checksum");
    }
  }

  isMNID(encoded) {
    try {
      const data = Buffer.from(base58.decode(encoded));
      return data.length > 24 && data[0] === 1;
    } catch (e) {
      return false;
    }
  }
}
