import { BLS12_381, Common, Fr, G1, G2, GT, init, Mcl } from 'mcl';

export { Fr, G1, G2, GT };

export class PRE {
    mcl!: Mcl;
    g!: G1;
    h!: G2;

    async init(curve: number = BLS12_381) {
        this.mcl = await init(curve);
    }

    generatorGen(g: string, h: string, fromHex = false) {
        return {
            g: fromHex ? this.mcl.deserializeHexStrToG1(g) : this.mcl.hashAndMapToG1(g),
            h: fromHex ? this.mcl.deserializeHexStrToG2(h) : this.mcl.hashAndMapToG2(h)
        };
    }

    pairing(g: G1, h: G2) {
        return this.mcl.pairing(g, h);
    }

    keyGenInG1(g: G1) {
        const sk = this.randomInFr(); // SKa = a is randomly selected from Fr
        const pk = this.mcl.mul(g, sk); // PKa = g^SKa = g^a
        return { sk, pk };
    }

    keyGenInG2(h: G2) {
        const sk = this.randomInFr(); // SKb = b is randomly selected from Fr
        const pk = this.mcl.mul(h, sk); // PKb = h^SKb = h^b
        return { sk, pk };
    }

    encrypt(plain: string, pk: G1, g: G1, h: G2) {
        const r = this.randomInFr(); // r is randomly selected from Fr

        const m = this.mcl.deserializeHexStrToFr(plain);
        const z = this.mcl.pairing(g, h); // Z = e(g, h)
        const ca0 = this.mcl.add(m, this.mcl.hashToFr(this.mcl.pow(z, r).serialize())); // Ca0 = m*Z^r

        const ca1 = this.mcl.mul(pk, r); // Ca1 = PKa^r = g^(ra)
        return { ca0, ca1 }; // Ca = (Ca0, Ca1)
    }

    decrypt({ ca0, ca1 }: { ca0: Fr; ca1: G1 }, sk: Fr, h: G2) {
        const e = this.mcl.pairing(ca1, h); // e(Ca1, h) = e(g^(ra), h)
        const eInv = this.mcl.pow(e, this.mcl.inv(sk)); // e(g^(ra), h)^(1/SKa) = e(g^(ra), h)^(1/a) = e(g, h)^r = Z^r
        const decrypted = this.mcl.sub(ca0, this.mcl.hashToFr(eInv.serialize())); // Ca0/Z^r = m*Z^r/Z^r = m
        return this.serialize(decrypted);
    }

    reKeyGen(ska: Fr, pkb: G2) {
        return this.mcl.mul(pkb, this.mcl.inv(ska)); // RK = PKb^(1/SKa) = h^(b/a)
    }

    reEncrypt({ ca0, ca1 }: { ca0: Fr; ca1: G1 }, reKey: G2) {
        const cb1 = this.mcl.pairing(ca1, reKey); // Cb1 = e(g^(ra), h^(b/a)) = e(g, h)^(rb) = Z^(rb)
        return { cb0: ca0, cb1 }; // Cb0 = Ca0
    }

    reDecrypt({ cb0, cb1 }: { cb0: Fr; cb1: GT }, sk: Fr) {
        const divisor = this.mcl.pow(cb1, this.mcl.inv(sk)); // (Z^(rb))^(1/Skb) = (Z^(rb))^(1/b) = Z^r
        const reDecrypted = this.mcl.sub(cb0, this.mcl.hashToFr(divisor.serialize())); // Cb0/Z^r = m*Z^r/Z^r = m
        return this.serialize(reDecrypted);
    }

    sign(msgHash: string, sk: Fr) {
        const msgPoint = this.mcl.hashAndMapToG2(msgHash);
        const sig = this.mcl.mul(msgPoint, sk);
        return this.serialize(sig);
    }

    verify(msgHash: string, signature: string, pk: G1, g: G1) {
        const msgPoint = this.mcl.hashAndMapToG2(msgHash);
        const sig = this.mcl.deserializeHexStrToG2(signature);
        const lhs = this.mcl.pairing(g, sig);
        const rhs = this.mcl.pairing(pk, msgPoint);
        return lhs.isEqual(rhs);
    }

    randomGen() {
        return this.serialize(this.randomInFr());
    }

    randomInFr() {
        const p = new this.mcl.Fr();
        p.setByCSPRNG();
        return p;
    }

    serialize(obj: Common) {
        return obj.serializeToHexStr();
    }

    deserialize(str: string, group: 'G1'): G1;
    deserialize(str: string, group: 'G2'): G2;
    deserialize(str: string, group: 'GT'): GT;
    deserialize(str: string, group: 'Fr'): Fr;
    deserialize(str: string, group: 'G1' | 'G2' | 'GT' | 'Fr') {
        switch (group) {
            case 'Fr':
                return this.mcl.deserializeHexStrToFr(str);
            case 'G1':
                return this.mcl.deserializeHexStrToG1(str);
            case 'G2':
                return this.mcl.deserializeHexStrToG2(str);
            case 'GT':
                return this.mcl.deserializeHexStrToGT(str);
        }
    }
}
