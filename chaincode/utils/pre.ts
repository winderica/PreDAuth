import * as mcl from 'mcl-wasm';
import { Common, Fr, G1, G2, GT } from 'mcl-wasm';

export { Fr, G1, G2, GT };

export class PRE {
    static async init(curve = mcl.BLS12_381) {
        await mcl.init(curve);
    }

    static generatorGen(g: string, h: string, fromHex = false) {
        const toG1 = fromHex ? mcl.deserializeHexStrToG1 : mcl.hashAndMapToG1;
        const toG2 = fromHex ? mcl.deserializeHexStrToG2 : mcl.hashAndMapToG2;
        return { g: toG1(g), h: toG2(h) };
    }

    static keyGenInG1(g: G1) {
        const sk = this.randomInFr(); // SKa = a is randomly selected from Fr
        const pk = mcl.mul(g, sk); // PKa = g^SKa = g^a
        return { sk, pk };
    }

    static keyGenInG2(h: G2) {
        const sk = this.randomInFr(); // SKb = b is randomly selected from Fr
        const pk = mcl.mul(h, sk); // PKb = h^SKb = h^b
        return { sk, pk };
    }

    static encrypt(plain: string, pk: G1, g: G1, h: G2) {
        const r = this.randomInFr(); // r is randomly selected from Fr

        const m = mcl.deserializeHexStrToFr(plain);
        const z = mcl.pairing(g, h); // Z = e(g, h)
        const ca0 = mcl.add(m, mcl.hashToFr(mcl.pow(z, r).serialize())); // Ca0 = m*Z^r

        const ca1 = mcl.mul(pk, r); // Ca1 = PKa^r = g^(ra)
        return { ca0, ca1 }; // Ca = (Ca0, Ca1)
    }

    static decrypt({ ca0, ca1 }: { ca0: Fr; ca1: G1 }, sk: Fr, h: G2) {
        const e = mcl.pairing(ca1, h); // e(Ca1, h) = e(g^(ra), h)
        const eInv = mcl.pow(e, mcl.inv(sk)); // e(g^(ra), h)^(1/SKa) = e(g^(ra), h)^(1/a) = e(g, h)^r = Z^r
        const decrypted = mcl.sub(ca0, mcl.hashToFr(eInv.serialize())); // Ca0/Z^r = m*Z^r/Z^r = m
        return this.serialize(decrypted)
    }

    static reKeyGen(ska: Fr, pkb: G2) {
        return mcl.mul(pkb, mcl.inv(ska)) // RK = PKb^(1/SKa) = h^(b/a)
    }

    static reEncrypt({ ca0, ca1 }: { ca0: Fr; ca1: G1 }, reKey: G2) {
        const cb1 = mcl.pairing(ca1, reKey); // Cb1 = e(g^(ra), h^(b/a)) = e(g, h)^(rb) = Z^(rb)
        return { cb0: ca0, cb1 }; // Cb0 = Ca0
    }

    static reDecrypt({ cb0, cb1 }: { cb0: Fr; cb1: GT }, sk: Fr) {
        const divisor = mcl.pow(cb1, mcl.inv(sk)); // (Z^(rb))^(1/Skb) = (Z^(rb))^(1/b) = Z^r
        const reDecrypted = mcl.sub(cb0, mcl.hashToFr(divisor.serialize())); // Cb0/Z^r = m*Z^r/Z^r = m
        return this.serialize(reDecrypted);
    }

    static sign(msgHash: string, sk: Fr) {
        const msgPoint = mcl.hashAndMapToG2(msgHash);
        const sig = mcl.mul(msgPoint, sk);
        return this.serialize(sig);
    }

    static verify(msgHash: string, signature: string, pk: G1, g: G1) {
        const msgPoint = mcl.hashAndMapToG2(msgHash);
        const sig = mcl.deserializeHexStrToG2(signature);
        const lhs = mcl.pairing(g, sig);
        const rhs = mcl.pairing(pk, msgPoint);
        return lhs.isEqual(rhs);
    }

    static randomGen() {
        return this.serialize(this.randomInFr());
    }

    static randomInFr() {
        const p = new mcl.Fr();
        p.setByCSPRNG();
        return p;
    }

    static serialize(obj: Common) {
        return obj.serializeToHexStr();
    }

    static deserialize(str: string, group: 'G1'): G1;
    static deserialize(str: string, group: 'G2'): G2;
    static deserialize(str: string, group: 'GT'): GT;
    static deserialize(str: string, group: 'Fr'): Fr;
    static deserialize(str: string, group: 'G1' | 'G2' | 'GT' | 'Fr') {
        switch (group) {
            case 'Fr':
                return mcl.deserializeHexStrToFr(str);
            case 'G1':
                return mcl.deserializeHexStrToG1(str);
            case 'G2':
                return mcl.deserializeHexStrToG2(str);
            case 'GT':
                return mcl.deserializeHexStrToGT(str);
        }
    }
}
