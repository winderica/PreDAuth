import path from 'path';
import { Gateway, Wallets, X509Identity } from 'fabric-network';
import ccp from '../../assets/connection-org1.json';
import FabricCAServices, { IKeyValueAttribute } from 'fabric-ca-client';

const getWallet = async () => {
    const walletPath = path.join(process.cwd(), 'wallet');
    return await Wallets.newFileSystemWallet(walletPath);
};

export const getContract = async (id: string) => {
    const wallet = await getWallet();
    const user = await wallet.get(id);
    if (!user) {
        throw new Error(`User ${id} doesn't exist.`);
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
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

export const addAdmin = async () => {
    const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: [caTLSCACerts], verify: false }, caInfo.caName);

    const wallet = await getWallet();

    if (await wallet.get('admin')) {
        return;
    }

    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    const x509Identity: X509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
    };

    await wallet.put('admin', x509Identity);
};

export const addUser = async (id: string, attrs?: IKeyValueAttribute[]) => {
    const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
    const ca = new FabricCAServices(caURL);

    const wallet = await getWallet();
    const user = await wallet.get(id);
    if (user) {
        throw new Error(`User ${id} already exists.`);
    }

    const admin = await wallet.get('admin');
    if (!admin) {
        throw new Error('Admin does not exist.');
    }

    const provider = wallet.getProviderRegistry().getProvider(admin.type);
    const adminUser = await provider.getUserContext(admin, 'admin');

    const secret = await ca.register({
        affiliation: 'org1.department1',
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
        mspId: 'Org1MSP',
        type: 'X.509',
    };
    await wallet.put(id, x509Identity);
};
