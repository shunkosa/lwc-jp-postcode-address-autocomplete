import { LightningElement } from 'lwc';
import Prefectures from 'c/prefecture';

export default class ExampleForm extends LightningElement {
    postalCode;
    address;

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
                const addressData = addressMap[this.postalCode];
                if(addressData) {
                    const prefecture = Prefectures()[addressData[0] - 1];
                    this.address = prefecture + addressData.slice(1).join('');
                }
            })
            .catch(error => {});
    }
}