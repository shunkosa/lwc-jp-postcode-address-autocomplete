import { LightningElement } from "lwc";
import getAddressByPostalCode from "c/postalCode";

export default class PostalCodeExampleForm extends LightningElement {
  postalCode;
  address;

  async handlePostalCodeChange(event) {
    this.postalCode = event.target.value;
    if (!this.postalCode || !event.target.checkValidity()) {
      return;
    }
    const address = await getAddressByPostalCode(this.postalCode);
    if (address) {
      this.address = Object.values(address)
        .filter(v => v !== undefined)
        .join("");
    }
  }
}
