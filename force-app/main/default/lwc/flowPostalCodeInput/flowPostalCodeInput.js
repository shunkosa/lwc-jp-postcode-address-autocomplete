import { LightningElement, api } from "lwc";
import getAddressByPostalCode from "c/postalCode";

export default class FlowPostalCodeInput extends LightningElement {
  @api hasHyphen = false;
  @api useMultipleAddressFields = false;
  @api postalCode;

  @api address;

  @api prefecture;
  @api city;
  @api street;

  get maxLength() {
    return this.hasHyphen ? 8 : 7;
  }

  get pattern() {
    return this.hasHyphen ? "[0-9]{3}-[0-9]{4}" : "[0-9]{7}";
  }

  get invalidPatternMessage() {
    return this.hasHyphen
      ? "郵便番号は 123-4567 のように ハイフンを含めた半角数値で入力してください。"
      : "郵便番号は半角数値(ハイフンなし)で入力してください。";
  }

  handleValueChange(event) {
    const name = event.target.name;
    switch (name) {
      case "address":
        this.address = event.target.value;
        break;
      case "prefecture":
        this.prefecture = event.target.value;
        break;
      case "city":
        this.city = event.target.value;
        break;
      case "street":
        this.street = event.target.value;
        break;
      default:
    }
  }

  async handlePostalCodeChange(event) {
    this.postalCode = event.target.value;
    if (!this.postalCode || !event.target.checkValidity()) {
      return;
    }
    const address = await getAddressByPostalCode(this.postalCode);
    if (address) {
      if (this.useMultipleAddressFields) {
        this.prefecture = address.state;
        this.city = address.city;
        this.street = address.extended
          ? address.street + address.extended
          : address.street;
      } else {
        this.address = Object.values(address)
          .filter(v => v !== undefined)
          .join("");
      }
    }
  }
}
