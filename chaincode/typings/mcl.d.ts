// incomplete typing for mcl-wasm

declare module 'mcl-wasm' {
    namespace mcl {
        export function init(curve: number): Promise<{}>;

        export function deserializeHexStrToG1(str: string): G1;

        export function deserializeHexStrToG2(str: string): G2;

        export function deserializeHexStrToFr(str: string): Fr;

        export function deserializeHexStrToGT(str: string): GT;

        export function hashAndMapToG1(str: string): G1;

        export function hashAndMapToG2(str: string): G2;

        export function hashToFr(str: string): Fr;

        export function pairing(g: G1, h: G2): GT;

        export function add<T = Fr | GT | G1 | G2>(a: T, b: T): T;

        export function sub<T = Fr | GT | G1 | G2>(a: T, b: T): T;

        export function mul<T = Fr | GT | G1 | G2>(a: T, b: Common): T;

        export function div<T = Fr | GT>(a: T, b: T): T;

        export function inv<T = Fr | GT>(a: T): T;

        export function pow(a: GT, b: Fr): GT;

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

        export class Common {
            constructor();

            serializeToHexStr(): string;
        }

        export class G1 extends Common {
            serialize(): string;
        }

        export class G2 extends Common {
            serialize(): string;
        }

        export class Fr extends Common {
            serialize(): string;

            setByCSPRNG(): void;
        }

        export class GT extends Common {
            serialize(): string;

            isEqual(g: Common): boolean;
        }
    }

    export = mcl;
}
