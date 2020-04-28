declare module 'mcl' {

    namespace mcl {

        export interface Common {
            new(size: number): Common;

            serializeToHexStr(): string;

            deserializeHexStr(s: string): void;

            dump(msg?: string): void;

            clear(): void;
        }

        export interface Fr extends Common {
            new(): Fr;

            setInt(x: number): void;

            deserialize(s: string): void;

            serialize(): string;

            setStr(s: string, base?: number): void;

            getStr(base ?: number): string;

            isZero(): boolean;

            isOne(): boolean;

            isEqual(rhs: Common): boolean;

            setLittleEndian(s: string): void;

            setLittleEndianMod(s: string): void;

            setByCSPRNG(): void;

            setHashOf(s: string): void;
        }

        export interface Fp extends Common {
            new(): Fp;

            deserialize(s: string): void;

            serialize(): string;

            setStr(s: string, base?: number): void;

            getStr(base ?: number): string;

            isEqual(rhs: Common): boolean;

            setLittleEndian(s: string): void;

            setLittleEndianMod(s: string): void;

            setHashOf(s: string): void;

            mapToG1(): G1;
        }

        export interface Fp2 extends Common {
            new(): Fp2;

            deserialize(s: string): void;

            serialize(): string;

            isEqual(rhs: Common): boolean;

            set_a(x: Fp): void;

            set_b(x: Fp): void;

            mapToG2(): G2;
        }

        export interface G1 extends Common {
            new(): G1;

            deserialize(s: string): void;

            serialize(): string;

            setStr(s: string, base?: number): void;

            getStr(base ?: number): string;

            isZero(): boolean;

            isEqual(rhs: Common): boolean;

            setHashOf(s: string): void;
        }

        export interface G2 extends Common {
            new(): G2;

            deserialize(s: string): void;

            serialize(): string;

            setStr(s: string, base?: number): void;

            getStr(base ?: number): string;

            isZero(): boolean;

            isEqual(rhs: Common): boolean;

            setHashOf(s: string): void;
        }

        export interface GT extends Common {
            new(): GT;

            setInt(x: number): void;

            deserialize(s: string): void;

            serialize(): string;

            setStr(s: string, base?: number): void;

            getStr(base ?: number): string;

            isZero(): boolean;

            isOne(): boolean;

            isEqual(rhs: Common): boolean;
        }

        export interface PrecomputedG2 {
            new(Q: G2): PrecomputedG2;

            destroy(): void;
        }

        export interface Mcl {
            toHexStr(a: Uint8Array): string;

            fromHexStr(s: string): Uint8Array;

            free(x: number): void;

            Fr: Fr;

            deserializeHexStrToFr(s: string): Fr;

            Fp: Fp;

            deserializeHexStrToFp(s: string): Fp;

            Fp2: Fp2;

            deserializeHexStrToFp2(s: string): Fp2;

            G1: G1;

            deserializeHexStrToG1(s: string): G1;

            setETHserialization(ETHserialization: boolean): void;

            verifyOrderG1(doVerify: boolean): void;

            verifyOrderG2(doVerify: boolean): void;

            getBasePointG1(): G1;

            G2: G2;

            deserializeHexStrToG2(s: string): G2;

            GT: GT;

            deserializeHexStrToGT(s: string): GT;

            PrecomputedG2: PrecomputedG2;

            neg<T = Fr | GT | G1 | G2>(x: T): T;

            sqr<T = Fr | GT>(x: T): T;

            inv<T = Fr | GT>(x: T): T;

            normalize<T = G1 | G2>(x: T): T;

            add<T = Fr | GT | G1 | G2>(x: T, y: T): T;

            sub<T = Fr | GT | G1 | G2>(x: T, y: T): T;

            mul<T = Fr | GT | G1 | G2>(x: T, y: T extends GT ? GT : Fr): T;

            div<T = Fr | GT>(x: T, y: T): T;

            dbl<T = G1 | G2>(x: T): T;

            hashToFr(s: string): Fr;

            hashAndMapToG1(s: string): G1;

            hashAndMapToG2(s: string): G2;

            pow(x: GT, y: Fr): GT;

            pairing(P: G1, Q: G2): GT;

            millerLoop(P: G1, Q: G2): GT;

            precomputedMillerLoop(P: G1, Qcoeff: PrecomputedG2): GT;

            precomputedMillerLoop2(P1: G1, Q1coeff: PrecomputedG2, P2: G1, Q2coeff: PrecomputedG2): GT;

            precomputedMillerLoop2mixed(P1: G1, Q1: G2, P2: G1, Q2coeff: PrecomputedG2): GT;

            finalExp(x: GT): GT;
        }

        export function init(curve?: number): Promise<Mcl>;

        export const BN254: 0;
        export const BN381_1: 1;
        export const BN381_2: 2;
        export const BN462: 3;
        export const BN_SNARK1: 4;
        export const BLS12_381: 5;
        export const SECP224K1: 101;
        export const SECP256K1: 102;
        export const SECP384R1: 103;
        export const NIST_P192: 105;
        export const NIST_P224: 106;
        export const NIST_P256: 107;

    }

    export = mcl;
}
