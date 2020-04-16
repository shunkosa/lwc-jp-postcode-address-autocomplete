import { LightningElement, api } from 'lwc';
import Prefectures from './prefecture';

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
        return this.hasHyphen ? '[0-9]{3}-[0-9]{4}' : '[0-9]{7}';
    }

    get invalidPatternMessage() {
        return this.hasHyphen
        ? '郵便番号は 123-4567 のように ハイフンを含めた半角数値で入力してください。'
        : '郵便番号は半角数値(ハイフンなし)で入力してください。';
    }

    handleValueChange(event) {
        const name = event.target.name;
        switch (name) {
            case 'address':
                this.address = event.target.value;
                break;
            case 'prefecture':
                this.prefecture = event.target.value;
                break;
            case 'city':
                this.city = event.target.value;
                break;
            case 'street':
                this.street = event.target.value;
                break;
            default:
        }
    }

    handlePostalCodeChange(event) {
        this.postalCode = event.target.value;
        if (!this.postalCode || !event.target.checkValidity()) {
            return;
        }
        fetch(`https://yubinbango.github.io/yubinbango-data/data/${this.postalCode.substring(0,3)}.js`)
            .then(response => {
                if(response.ok) {
                    return response.text();
                }
                throw new Error();
            })
            .then(result => {
                const addressMap = JSON.parse(result.replace('$yubin(','').replace(');',''));
                const postalCodeWithoutHyphen = this.hasHyphen ? this.postalCode.replace('-','') : this.postalCode;
                const addressData = addressMap[postalCodeWithoutHyphen];
                if(addressData) {
                    const prefecture = Prefectures()[addressData[0] - 1];
                    if (this.useMultipleAddressFields) {
                        this.prefecture = prefecture;
                        this.city = addressData[1];
                        this.street = addressData.slice(2).join('');
                    } else {
                        this.address = prefecture + addressData.slice(1).join('');
                    } 
                }
            })
            .catch(error => {});
    }
}