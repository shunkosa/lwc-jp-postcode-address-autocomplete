import { LightningElement } from 'lwc';
import Prefectures from 'c/prefecture';

export default class ExampleForm extends LightningElement {
    postalCode;
    address;

    handlePostalCodeChange(event) {
        this.postalCode = event.target.value;
        if (!this.postalCode || this.postalCode.length !== 7) {
            return;
        }
        fetch(`https://yubinbango.github.io/yubinbango-data/data/${this.postalCode.substring(0,3)}.js`)
            .then(response => {
                return response.text();
            })
            .then(result => {
                const addressMap = JSON.parse(result.replace('$yubin(','').replace(');',''));
                const addressData = addressMap[this.postalCode];
                if(addressData) {
                    const prefecture = Prefectures()[addressData[0] - 1];
                    this.address = prefecture + addressData.slice(1).join('');
                }
            })
    }
}