<template>
    <div style="width:100%;">
        <v-overlay :value="loading" color="#FFF">
            <v-progress-circular indeterminate color="primary" width="3" size="32"></v-progress-circular>
        </v-overlay>
        <v-form v-model="valid">
            <div class="secondary-header" style="width:100%;border-bottom:1px solid #ddd;">
                <v-toolbar dense flat class="grey lighten-4">
                    <v-toolbar-title>Create Job a Post</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn small text class="primary--text" @click="draft()">Save as Draft</v-btn>
                    <v-btn small class="ml-2" :href="postURL" target="_blank">Preview</v-btn>
                    <v-btn small color="primary" class="ml-2" :disabled="!valid" @click="publish()">Publish</v-btn>
                </v-toolbar>
            </div>     
            <div class="col page-content" style="width:100%;overflow-y:scroll;">
                <div class="d-flex">
                    <div class="col-md-8 col-12">
                        <v-card class="py-1">
                            <v-card-text>
                                <v-text-field
                                    single-line
                                    outlined
                                    dense
                                    v-model="position"
                                    label="position"
                                    required
                                    :rules="positionRules"
                                    :error="positionError"
                                    :error-messages="positionErrMsg"
                                    @change="clearAlert"
                                ></v-text-field>                          
                                <v-text-field
                                    single-line
                                    outlined
                                    dense
                                    v-model="slug"
                                    label="slug"
                                    required
                                    @mousedown="generateSlug"
                                    @focus="generateSlug"
                                    
                                    :rules="slugRules"
                                    :error="slugError"
                                    :error-messages="slugErrMsg"
                                    @change="clearAlert"
                                ></v-text-field>
                                <v-textarea
                                    v-model="content"
                                    single-line
                                    outlined
                                    dense
                                    name="input-7-4"
                                    label="content"
                                ></v-textarea>
                            </v-card-text>
                        </v-card>
                    </div>
                    <div class="col-md-4 col-12">
                        <v-card>
                            <v-card-text>
                                <v-text-field
                                    label="First name"
                                    required
                                ></v-text-field>
                            </v-card-text>
                        </v-card>
                    </div>
                </div>
            </div><!-- .page-content -->
        </v-form>
        <snack-bar :snackbar-type="sbType" :snackbar-text="sbText" :snackbar-status="sbStatus"></snack-bar>
    </div>
</template>

<script>
import SnackBar from '../../SnackBar.vue';
import ErrorBag from "../../../helpers/errorBag.js";

export default {
    components: {
      SnackBar
    },
    data() {
        return {
            baseURL : window.location.origin,

            // v-models
            postURL: '',
            position: '',
            slug: '',
            content: '',

            // Error Handling
            errors : new ErrorBag,
            positionError: false,
            positionErrMsg: '',
            slugError: false,
            slugErrMsg: '',

            // ui
            loading: false,
            valid: true,

            // SnackBar
            sbType : '',
            sbText : '',
            sbStatus : false,

            // Rules
            positionRules : [
                value => !!value || 'Required',
                value => (value && value.length < 50)  || 'Max 50 characters',
                value => (value && value.length > 1)  || 'Min 1 characters',
            ],
            slugRules : [
                value => !!value || 'Required',
                value => (value && value.length < 50)  || 'Max 50 characters',
                value => (value && value.length > 1)  || 'Min 1 characters',
            ],

            csrf: document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
        }
    },
    mounted(){
        const height = document.querySelector('header.v-app-bar').offsetHeight + document.querySelector('.secondary-header').offsetHeight;
        document.querySelector('.page-content').style.height = "calc(100vh - "+height+"px - 24px)";
    },
    methods:{
        clearAlert(){
            this.sbStatus = false; // SnackBar
            this.positionError = false;
            this.positionErrMsg = '';
            this.slugError = false;
            this.slugErrMsg = '';
            this.errors.clearAll();
        },
        successUI(msg){
            this.loading = false;
            setTimeout(() => {
                this.sbStatus = true;
                this.sbType = 'success';
                this.sbText = msg;
            }, 100);
        },
        generateSlug(){
            this.slug = this.position && slugify(this.position);
        },
        publish(){
            this.loading = true;
            let position = this.position && this.position.trim();
            let postData = [];
            postData = {
                slug : this.slug,
                position : position,
                content : this.content,
            }
            console.log(postData)
            axios.post('/admin/post/store', postData)
            .then(response => {
                this.successUI(response.data.message);
                console.log(response.data);
            })
            .catch(error => {
                this.loading = false;
                if(error.response.status == 403){
                // SnackBar
                this.sbStatus = true;
                this.sbType = 'error';
                this.sbText = error;
                console.log(error);
                }
                if (error.response && error.response.status == 422) {
                    this.errors.setErrors( error.response.data.errors );
                    // SnackBar
                    this.sbStatus = true;
                    this.sbType = 'error';
                    this.sbText = 'Error adding product category';
                    // Input error messages
                    if(this.errors.hasError('slug') ){
                        this.slugError = true;
                        this.slugErrMsg = this.errors.first('slug');
                    }
                    if(this.errors.hasError('position') ){
                        this.positionError = true;
                        this.positionErrMsg = this.errors.first('position');
                    }
                }
            });
        },
    }
};
</script>

<style>
</style>