import {createRouter, createWebHistory} from "vue-router";
import postListView from "@/views/postListView.vue";
import postDetailView from "@/views/postDetailView.vue";
import loginView from "@/views/loginView.vue";
import signupView from "@/views/signupView.vue";
import PostWriteView from "@/views/postWriteView.vue";
import PostEditView from "@/views/postEditView.vue";

const router = createRouter({
    history : createWebHistory(),
    routes: [
        {
            path:"/",
            component: postListView,
        },
        {
            path:"/posts/:id",
            component: postDetailView,
        },
        {
            path:"/login",
            component: loginView,
        },
        {
            path:"/signup",
            component: signupView
        },
        {
            path:"/write",
            component: PostWriteView
        },
        {
            path:"/posts/edit/:id",
            component: PostEditView
        }
    ],
});

export default router;