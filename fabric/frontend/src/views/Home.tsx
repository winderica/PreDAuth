import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { RouteComponentProps } from '@reach/router';
import { Button, Typography } from '@material-ui/core';

import { Anchor } from '../components/Anchor';
import { Dialog } from '../components/Dialog';
import { useStores } from '../hooks/useStores';
import { useStyles } from '../styles/home';
import logo from '../images/logo.png';

export const Home = observer<FC<RouteComponentProps>>(() => {
    const { identityStore } = useStores();
    const classes = useStyles();

    return identityStore.id
        ? <div className={classes.container}>
            <img className={classes.logo} src={logo} alt='PreDAuth logo' />
            <div>
                <Typography variant='h2' className={classes.header}>PreDAuth</Typography>
                <Typography variant='h5'>
                    PreDAuth is a decentralized authorization system based on Hyperledger Fabric and Proxy ReEncryption
                </Typography>
            </div>
        </div>
        : <Dialog
            open={true}
            setOpen={() => undefined}
            title='提示'
            content='私钥不存在，请选择：'
            actions={
                <>
                    <Anchor to='/register'>
                        <Button color='primary'>初次使用</Button>
                    </Anchor>
                    <Anchor to='/recover'>
                        <Button color='primary'>找回数据</Button>
                    </Anchor>
                </>
            }
        />;
});
