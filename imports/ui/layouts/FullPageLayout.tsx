import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    body: {
        backgroundColor: theme.palette.primary.main,
        backgroundImage: 'linear-gradient(150deg, rgba(0,115,157,1) 50%, rgb(0, 95, 130) 50%, rgb(13, 122, 162) 80%)',
    },
}));


type Props = {

}

const FullPageLayout: React.FC<Props> = ( {children} ) => {
    const classes = useStyles();

    useEffect(() => {
        document.getElementsByTagName('body')[0].classList.add(classes.body);

        return () => {
            document.getElementsByTagName('body')[0].classList.remove(classes.body);
        }
    });

    return (
        <>
            {children}
        </>
    )
}

export default FullPageLayout;