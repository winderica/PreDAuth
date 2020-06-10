import { performance, PerformanceObserver } from 'perf_hooks';
import crypto, { generateKeyPairSync, privateDecrypt, publicEncrypt, sign, verify } from 'crypto';
import { PRE } from '../src/utils/pre';
import chalk from 'chalk';

const pre = new PRE();

const obs = new PerformanceObserver((items) => {
    console.log(`${items.getEntries()[0].name}: ${items.getEntries()[0].duration / 50}`);
    performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });
(async () => {
    performance.mark('PRE init start');
    for (let i = 0; i < 50; i++) {
        await pre.init(5);
    }
    performance.mark('PRE init end');
    performance.measure('PRE init', 'PRE init start', 'PRE init end');

    performance.mark('PRE generatorGen start');
    for (let i = 0; i < 50; i++) {
        pre.generatorGen('test1', 'test2');
    }
    performance.mark('PRE generatorGen end');
    performance.measure('PRE generatorGen', 'PRE generatorGen start', 'PRE generatorGen end');

    const { g, h } = pre.generatorGen('test1', 'test2');
    console.log(chalk.green(`g: ${pre.serialize(g)}`));
    console.log(chalk.green(`h: ${pre.serialize(h)}`));
    performance.mark('PRE keyGenInG1 start');
    for (let i = 0; i < 50; i++) {
        pre.keyGenInG1(g);
    }
    performance.mark('PRE keyGenInG1 end');
    performance.measure('PRE keyGenInG1', 'PRE keyGenInG1 start', 'PRE keyGenInG1 end');

    performance.mark('PRE keyGenInG2 start');
    for (let i = 0; i < 50; i++) {
        pre.keyGenInG2(h);
    }
    performance.mark('PRE keyGenInG2 end');
    performance.measure('PRE keyGenInG2', 'PRE keyGenInG2 start', 'PRE keyGenInG2 end');

    performance.mark('RSA 1024 generateKeyPairSync start');
    for (let i = 0; i < 50; i++) {
        generateKeyPairSync('rsa', {
            modulusLength: 1024,
        });
    }
    performance.mark('RSA 1024 generateKeyPairSync end');
    performance.measure('RSA 1024 generateKeyPairSync', 'RSA 1024 generateKeyPairSync start', 'RSA 1024 generateKeyPairSync end');

    const { pk: pka, sk: ska } = pre.keyGenInG1(g);
    const { pk: pkb, sk: skb } = pre.keyGenInG2(h);
    console.log(chalk.red(`Alice PK: ${pre.serialize(pka)}`));
    console.log(chalk.red(`Alice SK: ${pre.serialize(ska)}`));
    console.log(chalk.cyan(`Bob PK: ${pre.serialize(pkb)}`));
    console.log(chalk.cyan(`Bob SK: ${pre.serialize(skb)}`));
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
        modulusLength: 1024,
    });

    const aesKey = pre.randomGen();
    console.log(chalk.yellow(`plain(AES Key): ${aesKey}`));
    const aesKeyBuffer = Buffer.from(aesKey);
    const z = pre.pairing(g, h);
    performance.mark('PRE encrypt start');
    for (let i = 0; i < 50; i++) {
        pre.encrypt(aesKey, pka, z);
    }
    performance.mark('PRE encrypt end');
    performance.measure('PRE encrypt', 'PRE encrypt start', 'PRE encrypt end');

    performance.mark('RSA 1024 publicEncrypt start');
    for (let i = 0; i < 50; i++) {
        publicEncrypt(publicKey, aesKeyBuffer);
    }
    performance.mark('RSA 1024 publicEncrypt end');
    performance.measure('RSA 1024 publicEncrypt', 'RSA 1024 publicEncrypt start', 'RSA 1024 publicEncrypt end');

    const { ca0, ca1 } = pre.encrypt(aesKey, pka, z);
    console.log(chalk.magenta(`Alice Encrypt: ${pre.serialize(ca0)} ${pre.serialize(ca1)}`));
    performance.mark('PRE decrypt start');
    for (let i = 0; i < 50; i++) {
        pre.decrypt({ ca0, ca1 }, ska, h);
    }
    performance.mark('PRE decrypt end');
    performance.measure('PRE decrypt', 'PRE decrypt start', 'PRE decrypt end');
    console.log(chalk.yellow(`Alice Decrypt: ${pre.decrypt({ ca0, ca1 }, ska, h)}`));
    const cipher = publicEncrypt(publicKey, aesKeyBuffer);

    performance.mark('RSA 1024 privateDecrypt start');
    for (let i = 0; i < 50; i++) {
        privateDecrypt(privateKey, cipher);
    }
    performance.mark('RSA 1024 privateDecrypt end');
    performance.measure('RSA 1024 privateDecrypt', 'RSA 1024 privateDecrypt start', 'RSA 1024 privateDecrypt end');

    performance.mark('PRE reKeyGen start');
    for (let i = 0; i < 50; i++) {
        pre.reKeyGen(ska, pkb);
    }
    performance.mark('PRE reKeyGen end');
    performance.measure('PRE reKeyGen', 'PRE reKeyGen start', 'PRE reKeyGen end');

    const rk = pre.reKeyGen(ska, pkb);
    console.log(chalk.blue(`RK: ${pre.serialize(rk)}`));
    performance.mark('PRE reEncrypt start');
    for (let i = 0; i < 50; i++) {
        pre.reEncrypt({ ca0, ca1 }, rk);
    }
    performance.mark('PRE reEncrypt end');
    performance.measure('PRE reEncrypt', 'PRE reEncrypt start', 'PRE reEncrypt end');

    const { cb0, cb1 } = pre.reEncrypt({ ca0, ca1 }, rk);
    console.log(chalk.magenta(`Proxy ReEncrypt: ${pre.serialize(cb0)} ${pre.serialize(cb1)}`));
    performance.mark('PRE reDecrypt start');
    for (let i = 0; i < 50; i++) {
        pre.reDecrypt({ cb0, cb1 }, skb);
    }
    console.log(chalk.yellow(`Bob Decrypt: ${pre.reDecrypt({ cb0, cb1 }, skb)}`));
    performance.mark('PRE reDecrypt end');
    performance.measure('PRE reDecrypt', 'PRE reDecrypt start', 'PRE reDecrypt end');

    performance.mark('PRE sign start');
    for (let i = 0; i < 50; i++) {
        pre.sign(aesKey, ska);
    }
    performance.mark('PRE sign end');
    performance.measure('PRE sign', 'PRE sign start', 'PRE sign end');

    const sig = pre.sign(aesKey, ska);

    performance.mark('PRE verify start');
    for (let i = 0; i < 50; i++) {
        pre.verify(aesKey, sig, pka, g);
    }
    performance.mark('PRE verify end');
    performance.measure('PRE verify', 'PRE verify start', 'PRE verify end');
    console.log(pre.verify(aesKey, sig, pka, g));

    performance.mark('ECDSA generateKeyPairSync start');
    for (let i = 0; i < 50; i++) {
        crypto.generateKeyPairSync('ec', { namedCurve: 'P-521' });
    }
    performance.mark('ECDSA generateKeyPairSync end');
    performance.measure('ECDSA generateKeyPairSync', 'ECDSA generateKeyPairSync start', 'ECDSA generateKeyPairSync end');
    const key = crypto.generateKeyPairSync('ec', { namedCurve: 'P-521' });

    performance.mark('ECDSA sign start');
    for (let i = 0; i < 50; i++) {
        sign('SHA512', aesKeyBuffer, key.privateKey);
    }
    performance.mark('ECDSA sign end');
    performance.measure('ECDSA sign', 'ECDSA sign start', 'ECDSA sign end');

    const sig2 = sign('SHA256', aesKeyBuffer, key.privateKey);

    performance.mark('ECDSA verify start');
    for (let i = 0; i < 50; i++) {
        verify('SHA512', aesKeyBuffer, key.publicKey, sig2);
    }
    performance.mark('ECDSA verify end');
    performance.measure('ECDSA verify', 'ECDSA verify start', 'ECDSA verify end');
    console.log(verify('SHA256', aesKeyBuffer, key.publicKey, sig2));
})();
