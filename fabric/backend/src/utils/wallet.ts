import path from 'path';
import { Gateway, Wallets, X509Identity } from 'fabric-network';
import ccp1 from '@assets/connection-org1.json';
import ccp2 from '@assets/connection-org2.json';
import FabricCAServices, { IKeyValueAttribute } from 'fabric-ca-client';

const checkOrg = (org: number) => {
    if (![1, 2].includes(org)) {
        throw new Error(`Org${org} doesn't exist`);
    }
};

const getWallet = async () => {
    const walletPath = path.join(process.cwd(), 'wallet');
    return await Wallets.newFileSystemWallet(walletPath);
};

export const getContract = async (id: string, org = 1) => {
    checkOrg(org);
    const wallet = await getWallet();
    const user = await wallet.get(id);
    if (!user) {
        throw new Error(`User ${id} doesn't exist.`);
    }

    const gateway = new Gateway();
    await gateway.connect([ccp1, ccp2][org - 1], {
        wallet,
        identity: id,
        discovery: {
            enabled: true,
            asLocalhost: true
        }
    });

    const network = await gateway.getNetwork('channel');

    return network.getContract('PreDAuth');
};

export const addAdmin = async (org = 1) => {
    checkOrg(org);
    const caInfo = [
        ccp1.certificateAuthorities['ca.org1.example.com'],
        ccp2.certificateAuthorities['ca.org2.example.com']
    ][org - 1];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: [caTLSCACerts], verify: false }, caInfo.caName);

    const wallet = await getWallet();

    if (await wallet.get(`admin${org}`)) {
        return;
    }

    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    const x509Identity: X509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: `Org${org}MSP`,
        type: 'X.509',
    };

    await wallet.put(`admin${org}`, x509Identity);
};

export const addUser = async (id: string, attrs?: IKeyValueAttribute[], org = 1) => {
    checkOrg(org);
    const caURL = [
        ccp1.certificateAuthorities['ca.org1.example.com'],
        ccp2.certificateAuthorities['ca.org2.example.com']
    ][org - 1].url;
    const ca = new FabricCAServices(caURL);

    const wallet = await getWallet();
    const user = await wallet.get(id);
    if (user) {
        throw new Error(`User ${id} already exists.`);
    }

    const admin = await wallet.get(`admin${org}`);
    if (!admin) {
        throw new Error('Admin does not exist.');
    }

    const provider = wallet.getProviderRegistry().getProvider(admin.type);
    const adminUser = await provider.getUserContext(admin, 'admin');

    const secret = await ca.register({
        affiliation: `org${org}.department1`,
        enrollmentID: id,
        role: 'client',
        attrs
    }, adminUser);
    const enrollment = await ca.enroll({ enrollmentID: id, enrollmentSecret: secret });
    const x509Identity: X509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: `Org${org}MSP`,
        type: 'X.509',
    };
    await wallet.put(id, x509Identity);
};
