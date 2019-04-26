//======> Docementation <======//
registerBlockType( 'tornado/docs-paragraph', {
    title: __('Docs Paragraph', 'tornado'),
    description: __('Docs Paragraph Block With Title', 'tornado'),
    icon:'feedback',
    category: 'tornado',
    keywords: [ 'tornado', 'docs', 'paragraph' ],
    supports: {
        align: ['full','wide']
    },
    attributes: {
        title : {
            type: 'string',
            source: 'html',
            selector: 'h4',
            default: '',
        },
        content : {
            type: 'array',
            default: '',
            source: 'children',
            selector: 'p',
            multiline: 'br',
        }
    },
    //==== Editing Mode ====//
    edit: props => {
        //==== Block Data ====//
        const { attributes, setAttributes, className, isSelected } = props;
        props.setAttributes( { align: 'full' } );
        //==== on Change Title Func ====//
        const onChangeTitle = title => { setAttributes({title}) };
        //==== on Change Content Func ====//
        const onChangeContent = content => { setAttributes({content}) };

        //==== Block Structure ====//
        return (
            <Panel>
                <PanelBody>
                    <div className={ 'pargraph-area ' + className }>
                        <RichText tagName="h4" multiline="" placeholder={ __( 'Title Goes Here', 'tornado' ) } onChange={ onChangeTitle } value={ attributes.title } />
                        <RichText tagName="p" multiline="" placeholder={ __( 'Paragraph Text Goes Right Here in this Spot of the Block', 'tornado' ) } onChange={ onChangeContent } value={ attributes.content } />
                    </div>
                </PanelBody>
            </Panel>
        );
    },

    //==== Puplish Mode ====//
    save: props => {
        //==== Block Data ====//
        const { attributes, className } = props;

        //==== Block Structure ====//
        return (
            <div className={ 'pargraph-area ' + className }>
                <h4>{ attributes.title }</h4>
                <p>{ attributes.content }</p>
            </div>
        );
    },
} );