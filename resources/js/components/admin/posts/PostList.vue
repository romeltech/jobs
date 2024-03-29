<template>
   <div class="col">
      <div class="col-12">
         <v-data-table
            :headers="headers"
            :items="posts"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            class="elevation-1">
            <template v-slot:top>
               <v-toolbar flat color="transparent">
                  <v-toolbar-title>Job Posts</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn class="primary" to="/admin/post/create">New</v-btn>
               </v-toolbar>
            </template>
            <template v-slot:item.position="{ item }">
               <a @click="editItem(item)">{{ item.position }}</a>
            </template>
            <template v-slot:item.action="{ item }">
               <v-icon small @click="editItem(item)">mdi-pencil</v-icon>
               <v-icon small @click="deleteItem(item)">mdi-trash-can</v-icon>
            </template>
         </v-data-table>
         <v-pagination
            v-if="pageCount > 1"
            class="mt-3"
            v-model="page"
            :length="pageCount"
            @input="onPageChange"
         ></v-pagination>
      </div>
      <v-dialog v-model="dialog" max-width="500px">
         <v-card :loading="loading">
            <v-form
               ref="form"
               @submit.prevent="confirmDelete(dialogId)">
               <v-card-title>
                  <span class="headline">Delete {{ deleteTitle }}</span>
               </v-card-title>
               <v-card-text>
                  Are you sure you want to delete <strong>{{deleteTitle}}</strong>?
               </v-card-text>
               <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
                  <v-btn
                     color="primary"
                     text
                     type="submit"
                  >Delete</v-btn>
               </v-card-actions>
            </v-form>
         </v-card>
      </v-dialog>
      <snack-bar :snackbar-type="sbType" :snackbar-text="sbText" :snackbar-status="sbStatus"></snack-bar>
   </div>
</template>
<script>
import SnackBar from '../../SnackBar.vue';
import ErrorBag from "../../../helpers/errorBag.js";
export default {
   name: 'PostList',
   data() {
      return {
         // Delete
         dialogId: '',
         deleteTitle: '',
         dialog: false,
         loading: false,

         // SnackBar
         sbType : '',
         sbText : '',
         sbStatus : false,
         errors : new ErrorBag,

         // Base URL to be changed in vuex
         baseURL : window.location.origin,
         posts : [],
         page: 1,
         pageCount: 1,
         // Data Table
         itemsPerPage: 10,
         page: 1,
         pageCount: 0,
         headers: [
            {
               text: "ID",
               value: "id",
               width: "1%",
               align: "left"
            },
            {
               text: "Position",
               value: "position",
               width: "10%",
               align: "left"
            },
            {
               text: "Slug",
               value: "slug",
               width: "10%",
               align: "left"
            },
            {
               text: "Actions",
               value: "action",
               sortable: false,
               width: "20%",
               align: "right"
            }
         ]
      }
   },
   methods: {
      onPageChange(){
         this.getProducts(this.page);
      },
      getProducts(p) {
        axios.get("/api/posts/?page=" + p)
        .then(response => {
            this.posts = response.data.data;
            this.page = response.data.current_page;
            this.pageCount = response.data.last_page;
        })
        .catch(error => {
            console.log("Error: " + error);
        });
      },
      snackBarUI(status, type, msg){
         this.sbStatus = status;
         this.sbType = type;
         this.sbText = msg;
      },
      editItem(i) {
         this.$router.push({name:'EditPost',params:{id:i.id}})
      },
      deleteItem(i){
         this.dialogId = i.id;
         this.deleteTitle = i.position;
         this.dialog = true;
      },
      confirmDelete(){
         this.loading = true;
         axios.delete('/admin/post/destroy/'+this.dialogId)
         .then(response => {
            this.dialog = false;
            this.loading = false;
            this.snackBarUI(true, 'success', response.data.message);
            this.getProducts(this.page);
         })
         .catch(error => {
            if(error.response.status == 403){
               this.snackBarUI(true, 'error', error);
            }
            if (error.response && error.response.status == 422) {
               this.errors.setErrors( error.response.data.errors );
               this.snackBarUI(true, 'error', 'Unprocessable Entity');
            }
            this.snackBarUI(true, 'error', 'Error deleting product category');
            this.loading = false;  
            this.dialog = false;
         });
      }
   },
   mounted(){
      this.getProducts(this.page);
   }
}
</script>
<style scoped>
   table td:hover{
      border-bottom: 1px dotted;
      transition: .1s ease-out;
   }
</style>