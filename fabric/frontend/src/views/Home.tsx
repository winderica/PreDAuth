import React, { FC } from 'react';
import { Button } from '@material-ui/core';

import { Dialog } from '../components/Dialog';
import { useStores } from '../hooks/useStores';
import { RouteComponentProps } from '@reach/router';
import { observer } from 'mobx-react';
import { Anchor } from '../components/Anchor';

export const Home = observer<FC<RouteComponentProps>>(() => {
    const { identityStore } = useStores();

    return identityStore.id ? <></> : (
        <Dialog
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
        />
    );
});
