// incomplete typing for mcl

declare module 'mcl' {

    namespace mcl {

        export interface Common {

            serializeToHexStr(): string;
        }

        export interface G1 extends Common {
            serialize(): string;
        }

        export interface G2 extends Common {
            serialize(): string;
        }

        export interface Fr extends Common {
            // eslint-disable-next-line @typescript-eslint/no-misused-new
            new(): Fr;

            serialize(): string;

            setByCSPRNG(): void;
        }

        export interface GT extends Common {
            serialize(): string;

            isEqual(g: Common): boolean;
        }

        export interface Mcl {

            deserializeHexStrToG1(str: string): G1;

            deserializeHexStrToG2(str: string): G2;

            deserializeHexStrToFr(str: string): Fr;

            deserializeHexStrToGT(str: string): GT;

            hashAndMapToG1(str: string): G1;

            hashAndMapToG2(str: string): G2;

            hashToFr(str: string): Fr;

            pairing(g: G1, h: G2): GT;

            add<T = Fr | GT | G1 | G2>(a: T, b: T): T;

            sub<T = Fr | GT | G1 | G2>(a: T, b: T): T;

            mul<T = Fr | GT | G1 | G2>(a: T, b: Common): T;

            div<T = Fr | GT>(a: T, b: T): T;

            inv<T = Fr | GT>(a: T): T;

            pow(a: GT, b: Fr): GT;

            GT: GT;
            G1: G1;
            G2: G2;
            Fr: Fr;
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
