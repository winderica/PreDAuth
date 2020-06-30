import React from 'react';
import { Button } from '@material-ui/core';

import { Dialog } from '../components/Dialog';
import { useStores } from '../hooks/useStores';
import { Link } from '@reach/router';
import { observer } from 'mobx-react';

export const Home = observer(() => {
    const { identityStore } = useStores();

    return identityStore.id ? <></> : (
        <Dialog
            open={true}
            setOpen={() => undefined}
            title='提示'
            content='私钥不存在，请选择：'
            actions={<>
                <Link to='/register'>
                    <Button color='primary'>初次使用</Button>
                </Link>
                <Link to='relative'>
                    <Button color='primary'>找回数据</Button>
                </Link>
            </>}
        />
    );
});
