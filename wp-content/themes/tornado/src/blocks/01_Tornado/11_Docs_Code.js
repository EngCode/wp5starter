//======> Docementation <======//
registerBlockType( 'tornado/docs-code', {
    title: __('Docs Code', 'tornado'),
    description: __('Docs Code Block With', 'tornado'),
    icon:'feedback',
    category: 'tornado',
    keywords: [ 'tornado', 'docs', 'code' ],
    supports: {
        align: ['full','wide']
    },
    attributes: {
        content : {
            type: 'array',
            default: '',
            source: 'children',
            selector: 'p',
            multiline: 'br',
        },

        hint : {
            type: 'string',
            default: '',
        },

        codeLanguage : {
            type: 'string',
            default: 'markup',
        },
    },
    //==== Editing Mode ====//
    edit: props => {
        //==== Block Data ====//
        const { attributes, setAttributes, clientId } = props;
        props.setAttributes( { align: 'full' } );
        //==== on Change Content Func ====//
        const onChangeContent = content => { setAttributes({content}) };

        //==== Block Structure ====//
        return (
            <Panel>
                <PanelBody>
                {/* <!-- Code Viewer --> */}
                <pre class="code-viewer">
                    <button class="copy-btn" data-clipboard-target={'code-' + clientId}>{__('Copy Code','tornado')}</button>
                    <RichText ClassName={attributes.codeLanguage} tagName="code" multiline="" id={'code-' + clientId} onChange={ onChangeContent } value={ attributes.content } placeholder={ __( 'Code Goes Right Here in this Spot of the Block', 'tornado' ) } />
                    <p>{attributes.hint}</p>
                </pre>
                </PanelBody>
            </Panel>
        );
    },

    //==== Puplish Mode ====//
    save: props => {
        //==== Block Data ====//
        const { attributes, clientId } = props;

        //==== Block Structure ====//
        return (
            // <!-- Code Viewer -->
            <pre class="code-viewer">
                <button class="copy-btn" data-clipboard-target={'code-' + clientId}>{__('Copy Code','tornado')}</button>
                <code class={attributes.codeLanguage} id={'code-' + clientId}>{attributes.content}</code>
                <p>{attributes.hint}</p>
            </pre>
        );
    },
} );