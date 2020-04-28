import { PRE } from './utils/pre';
import { Alice } from './roles/alice';
import { Bob } from './roles/bob';
import { ProxyNode } from './roles/proxy';

(async () => {
    const pre = new PRE();
    await pre.init();
    const proxy = new ProxyNode(pre);
    const { g, h } = proxy.getGH();
    const alice = new Alice(pre, g, h);
    const bob = new Bob(pre, g, h);
    const { cipher, key, iv } = alice.encrypt('Lorem ipsum');
    const rk = alice.reKey(bob.pk);
    const reEncryptedKey = proxy.reEncrypt(key, rk);
    const decrypted = bob.reDecrypt(cipher, reEncryptedKey, iv);
    console.log(decrypted);
})();