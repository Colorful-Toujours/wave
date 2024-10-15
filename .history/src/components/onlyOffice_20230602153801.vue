<template>
    <DocumentEditor 
        id="docEditor" 
        documentServerUrl="http://192.168.1.176:9988/"
        :config="config"
        :events_onDocumentReady="onDocumentReady"
    /> 
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { DocumentEditor } from "@onlyoffice/document-editor-vue";

export default defineComponent({
    name: 'ExampleComponent',
    components: {
        DocumentEditor
    },
    data() {
        return {
            config: {
                document: {
                    fileType: "docx",
                    key: "Khirz6zTPdfd7",
                    title: "Example Document Title.docx",
                    // url: "https://example.com/url-to-example-document.docx"
                    url: "http://192.168.1.77:18889/法国韩国官方_1684390937450.doc"
                },
                documentType: "word",
                editorConfig: {
                    callbackUrl: "https://example.com/url-to-callback.ashx"
                }
            }
        }
    },
    methods: {
        onDocumentReady() {
            console.log("Document is loaded");
        }
    },
});
</script>