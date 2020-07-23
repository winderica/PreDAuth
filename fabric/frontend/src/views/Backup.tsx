import { Button, Card, CardActions, CardContent, CardHeader, Chip, Divider, IconButton, TextField, Tooltip, Typography } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import { Redirect, RouteComponentProps } from '@reach/router';
import { observer } from 'mobx-react';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { BeforeCapture, DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import { api } from '../api';
import { useAlice } from '../hooks/useAlice';
import { useStores } from '../hooks/useStores';
import { useUserData } from '../hooks/useUserData';
import { useStyles } from '../styles/backup';
import { apiWrapper } from '../utils/apiWrapper';
import { classNames } from '../utils/classnames';

const TagsGroup: FC<{ tags: string[] }> = ({ tags }) => {
    const classes = useStyles();
    return (
        <Droppable droppableId='tags' isDropDisabled direction='horizontal'>
            {({ innerRef, placeholder }) => (
                <div ref={innerRef} className={classes.chipsContainer}>
                    {tags.map((tag, index) => (
                        <Draggable key={tag} draggableId={tag} index={index}>
                            {({ innerRef, draggableProps, dragHandleProps }, snapshot) => (
                                <>
                                    <Chip
                                        label={tag}
                                        color='secondary'
                                        variant='outlined'
                                        innerRef={innerRef}
                                        className={classes.chip}
                                        {...draggableProps}
                                        {...dragHandleProps}
                                    />
                                    {snapshot.isDragging && (
                                        <Chip
                                            label={tag}
                                            color='secondary'
                                            variant='outlined'
                                            className={classNames(classes.draggingChip, classes.chip)}
                                        />
                                    )}
                                </>
                            )}
                        </Draggable>
                    ))}
                    <div className={classes.hidden}>{placeholder}</div>
                </div>
            )}
        </Droppable>
    );
};

const TagsCard: FC<{ pk: string; index: number; }> = ({ children, pk, index }) => {
    const classes = useStyles();
    return (
        <Card className={classes.card} key={pk}>
            <CardHeader
                classes={{ content: classes.cardHeader }}
                title={`节点${index + 1}`}
                subheader={
                    <Tooltip title={pk} interactive>
                        <Typography
                            variant='body2'
                            color='textSecondary'
                            className={classes.cardSubheader}
                        >
                            {`公钥：${pk}`}
                        </Typography>
                    </Tooltip>
                }
            />
            <Divider variant='middle' />
            <Droppable key={pk} droppableId={pk} direction='horizontal'>
                {({ innerRef, placeholder }) => (
                    <CardContent innerRef={innerRef} className={classes.cardContent}>
                        {children}
                        <div className={classes.placeholderChip}>{placeholder}</div>
                    </CardContent>
                )}
            </Droppable>
        </Card>
    );
};

export const Backup = observer<FC<RouteComponentProps>>(() => {
    const { identityStore, userDataStore, keyStore } = useStores();
    if (!identityStore.id) {
        return <Redirect to='/' noThrow />;
    }
    const classes = useStyles();
    useUserData();
    const [tagsMap, setTagsMap] = useState<Record<string, string[]>>({});
    const [pks, setPKs] = useState<string[]>([]);
    const [email, setEmail] = useState('');
    const [trashOn, setTrashOn] = useState(false);
    const alice = useAlice();
    useEffect(() => {
        void apiWrapper(async () => {
            const { pks } = await api.getPKs();
            setTagsMap(Object.fromEntries(pks.map((pk) => [pk, []])));
            setPKs(pks);
        }, '正在获取节点公钥', '成功获取节点公钥');
    }, []);
    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setEmail(value);
    };
    const handleBackup = async () => {
        const data = Object.fromEntries(Object.entries(tagsMap).filter(([, tags]) => tags.length).map(([pk, tags]) => [
            pk,
            {
                rk: Object.fromEntries(tags.map((tag) => [tag, alice.reKey(pk, keyStore.dataKey[tag].sk)])),
                email
            }
        ]));
        await apiWrapper(
            async () => api.backup(identityStore.id, identityStore.key, data),
            '正在备份重加密密钥',
            '成功提交重加密密钥'
        );
    };
    const handleDragEnd = ({ source, destination, draggableId }: DropResult) => {
        setTrashOn(false);
        if (!destination || source.droppableId === destination.droppableId) {
            return;
        }
        draggableId = draggableId.slice(draggableId.indexOf('-') + 1);
        if (destination.droppableId === 'trash') {
            setTagsMap((prevTagsMap) => {
                return {
                    ...prevTagsMap,
                    [source.droppableId]: prevTagsMap[source.droppableId].filter((tag) => tag !== draggableId),
                };
            });
            return;
        }
        if (source.droppableId === 'tags') {
            setTagsMap((prevTagsMap) => {
                return {
                    ...prevTagsMap,
                    [destination.droppableId]: [...new Set(prevTagsMap[destination.droppableId].concat(draggableId))],
                };
            });
            return;
        }
        setTagsMap((prevTagsMap) => {
            return {
                ...prevTagsMap,
                [source.droppableId]: prevTagsMap[source.droppableId].filter((tag) => tag !== draggableId),
                [destination.droppableId]: [...new Set(prevTagsMap[destination.droppableId].concat(draggableId))],
            };
        });
    };
    const handleCapture = ({ draggableId }: BeforeCapture) => {
        if (draggableId[0] === '!') {
            setTrashOn(true);
        }
    };
    return (
        <DragDropContext onBeforeCapture={handleCapture} onDragEnd={handleDragEnd}>
            <Card>
                <CardHeader title='备份数据' />
                <CardContent>
                    <Typography>您可以输入恢复手段（邮箱或手机号），并指定允许PreDAuth获取的数据，为PreDAuth生成重加密密钥，以便于私钥丢失后仍能找回相应数据。</Typography>
                    <Typography>对于敏感数据，您可以选择不信任PreDAuth，而是选择自己记忆，并承担私钥丢失的后果。</Typography>
                    <TextField
                        autoFocus
                        margin='dense'
                        label='恢复手段'
                        fullWidth
                        value={email}
                        onChange={handleInput}
                    />
                    <TagsGroup tags={userDataStore.tags} />
                    <div className={classes.cardsContainer}>
                        {!!pks.length && pks.map((pk, index) => (
                            <TagsCard pk={pk} index={index} key={pk}>
                                {tagsMap[pk].length ? tagsMap[pk].map((tag, index) => (
                                    <Draggable key={tag} draggableId={`!${pk}-${tag}`} index={index}>
                                        {({ innerRef, dragHandleProps, draggableProps }) => (
                                            <Chip
                                                key={tag}
                                                label={tag}
                                                color='secondary'
                                                variant='outlined'
                                                className={classes.chip}
                                                innerRef={innerRef}
                                                {...draggableProps}
                                                {...dragHandleProps}
                                            />
                                        )}
                                    </Draggable>
                                )) : <Chip label='拖拽标签至此' variant='outlined' className={classNames(classes.chip, classes.defaultChip)} />}
                            </TagsCard>
                        ))}
                    </div>
                </CardContent>
                <CardActions>
                    <Button className={classes.button} variant='contained' size='large' color='primary' onClick={handleBackup}>备份</Button>
                    {trashOn && <Droppable droppableId='trash'>
                        {({ innerRef, placeholder }) => (
                            <IconButton ref={innerRef}>
                                <DeleteForever fontSize='large' color='primary' />
                                <div className={classes.hidden}>{placeholder}</div>
                            </IconButton>
                        )}
                    </Droppable>}
                </CardActions>
            </Card>
        </DragDropContext>
    );
});
