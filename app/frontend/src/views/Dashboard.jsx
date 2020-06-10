import React from 'react';
import { Card, CardContent, Chip, Paper, Typography } from '@material-ui/core';
import { CheckCircle, Block } from '@material-ui/icons';
import { useStyles } from '../styles/dashboard';

const data = {
    '昵称': 'Alice',
    '性别': '女',
    '年龄': '20',
    'QQ号': '123456789',
    '微信号': '987654321'
};

export const Dashboard = () => {
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded((expanded) => !expanded);
    };
    const classes = useStyles({ expanded });
    return (
        <div className={classes.root}>
            <Card elevation={10}>
                <CardContent className={classes.content}>
                    <Block color='primary' style={{ fontSize: 80 }} />
                    <Typography>登录失败<br/>请检查是否存在未授权的数据</Typography>
                    {/*<div>*/}
                    {/*    {Object.entries(data).map(([k, v]) =>*/}
                    {/*        <Chip key={k} color='primary' variant='outlined' label={`${k}: ${v}`} style={{margin: 8}} />*/}
                    {/*    )}*/}
                    {/*</div>*/}

                </CardContent>
            </Card>
        </div>
    );
};
