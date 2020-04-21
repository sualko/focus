import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Difference from 'diff';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

    }),
)

type Props = {
    current: string,
    old: string,
    variant?: 'h1'|'h2'|'h3'|'body1',
}

const Diff: React.FC<Props> = (props) => {
    const classes = useStyles();

    const diffs = Difference.diffWordsWithSpace(props.old, props.current);

    return (
        <Typography variant={props.variant}>
            {diffs.map((diff, i) => {
                if (diff.added) {
                    return <span key={i} style={{backgroundColor:'rgba(0,255,0,0.3)'}}>{diff.value}</span>;
                } else if (diff.removed) {
                    return <span key={i} style={{backgroundColor:'rgba(255,0,0,0.3)', textDecoration: 'line-through',}}>{diff.value}</span>;
                }

                return <span key={i}>{diff.value}</span>;
            })}
        </Typography>
    )
}

export default Diff;