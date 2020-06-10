import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { App } from './views/App';
import { PRE } from './utils/pre';

render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.querySelector('#root')
);

// import * as pkijs from 'pkijs';
// import * as asn1js from 'asn1js';
//
// (async function make_any() {
//     const pkcs10_simpl = new pkijs.Certificate({
//         version: 0
//     });
//     const hash_algorithm = 'sha-512';
//
//     pkcs10_simpl.version = 0;
//
//     pkcs10_simpl.subject.typesAndValues.push(new pkijs.AttributeTypeAndValue({
//         type: '2.5.4.3',
//         value: new asn1js.BmpString({ value: 'Test' })
//     }));
//
//     const keyPair = await crypto.subtle.generateKey(
//         {
//             name: "ECDSA",
//             namedCurve: "P-521",
//         },
//         true,
//         ['sign', 'verify'],
//     );
//     const publicKey = keyPair.publicKey;
//     const privateKey = keyPair.privateKey;
//
//     await pkcs10_simpl.subjectPublicKeyInfo.importKey(publicKey);
//     const result = await crypto.subtle.digest({
//         name: 'SHA-1'
//     }, pkcs10_simpl.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHex);
//     pkcs10_simpl.attributes = []
//     pkcs10_simpl.attributes.push(new pkijs.AttributeTypeAndValue({
//         type: '1.2.840.113549.1.9.14', // pkcs-9-at-extensionRequest
//         values: [(new pkijs.Extensions({
//             extensions_array: [
//                 new pkijs.Extension({
//                     extnID: '2.5.29.14',
//                     critical: false,
//                     extnValue: (new asn1js.OctetString({
//                         value_hex: result
//                     })).toBER(false)
//                 })
//             ]
//         })).toSchema()]
//     }));
//     await pkcs10_simpl.sign(privateKey, hash_algorithm);
//
//
//     var pkcs10_schema = pkcs10_simpl.toSchema();
//     var pkcs10_encoded = pkcs10_schema.toBER(false);
//
//     console.log('-----BEGIN CERTIFICATE REQUEST-----\r\n' + formatPEM(btoa(arrayBufferToString(pkcs10_encoded))) + '\r\n-----END CERTIFICATE REQUEST-----\r\n');
//
//     var private_key_string = String.fromCharCode.apply(null, new Uint8Array(await crypto.subtle.exportKey('pkcs8', privateKey)));
//     var result_string = '\r\n-----BEGIN PRIVATE KEY-----\r\n';
//     result_string = result_string + formatPEM(btoa(private_key_string));
//     result_string = result_string + '\r\n-----END PRIVATE KEY-----';
//     console.log(result_string)
// })();
//
// function formatPEM(pem_string) {
//     var string_length = pem_string.length;
//     var result_string = '';
//
//     for (var i = 0, count = 0; i < string_length; i++, count++) {
//         if (count > 63) {
//             result_string = result_string + '\r\n';
//             count = 0;
//         }
//
//         result_string = result_string + pem_string[i];
//     }
//
//     return result_string;
// }
//
// function arrayBufferToString(buffer) {
//     /// <summary>Create a string from ArrayBuffer</summary>
//     /// <param name="buffer" type="ArrayBuffer">ArrayBuffer to create a string from</param>
//
//     var result_string = '';
//     var view = new Uint8Array(buffer);
//
//     for (var i = 0; i < view.length; i++) {
//         result_string = result_string + String.fromCharCode(view[i]);
//     }
//
//     return result_string;
// }
