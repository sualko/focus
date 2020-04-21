import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { DocumentDocument } from '/imports/api/documents';
import { Link as RouterLink } from "react-router-dom";
import colorGeneration from 'consistent-color-generation';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: 345,
            padding: 0,
            boxShadow: '0 0 5px rgba(0,0,0,0.1)',
            margin: theme.spacing(3),
            display: 'inline-block',
        },
        media: {
            height: 140,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '6em',
            color: 'rgba(255,255,255,0.3)',
        },
    }),
)

type Props = {
    document: DocumentDocument,
};

const DocumentCard: React.FC<Props> = ({ document }) => {
    const classes = useStyles();

    const color = colorGeneration(document._id);

    return (
        <Card variant="outlined" className={classes.root}>
            <CardActionArea component={RouterLink} to={`/document/${document._id}`}>
                <CardMedia
                    className={classes.media}
                    title={document.title}
                    style={{ backgroundColor: color.toString() }}
                    image="/static/images/cards/contemplative-reptile.jpg"
                ><DescriptionOutlinedIcon fontSize="inherit" /></CardMedia>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {document.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {document.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default DocumentCard;