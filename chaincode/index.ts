import { Alice } from './src/alice';
import { Bob } from './src/bob';
import { ProxyNode } from './src/proxy';

(async () => {
    const proxy = new ProxyNode();
    await proxy.init();
    const { g, h } = proxy.getGH();
    const alice = new Alice(g, h);
    const bob = new Bob(g, h);
    const { cipher, key, iv } = alice.encrypt("Lorem ipsum");
    const rk = alice.reKey(bob.pk);
    const reEncryptedKey = proxy.reEncrypt(key, rk);
    const decrypted = bob.reDecrypt(cipher, reEncryptedKey, iv);
    console.log(decrypted);
})();
