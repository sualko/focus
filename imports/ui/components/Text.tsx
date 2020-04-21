import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { TextCollection, TextDocument } from '/imports/api/texts';
import { Format } from '/imports/api/paragraphs';
import Diff from './Diff';

type Variant = 'body1' | 'h1' | 'h2' | 'h3';

type Props = {
    _id: string
    text: TextDocument | undefined
    format: Format
    oldContent: string | undefined
}

const Text: React.FC<Props> = ({ text, _id, format = Format.Text, oldContent = '' }) => {
    console.log('text', text, _id);

    if (!text) {
        return <div>Loading text...</div>;
    }

    console.log('format', format)

    let variant: Variant = format === Format.Text || (format as string) === 'normal' ? 'body1' : format;

    return <Diff variant={variant} old={oldContent} current={text.content} />;
};

export default withTracker((props: {_id: string, format: Format, oldContent: string | undefined}) => {
    return {
        text: TextCollection.findOne(props._id),
    };
})(Text);
