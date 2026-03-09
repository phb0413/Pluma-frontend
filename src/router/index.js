import {createRouter, createWebHistory} from "vue-router";
import postListView from "@/views/postListView.vue";
import postDetailView from "@/views/postDetailView.vue";
import loginView from "@/views/loginView.vue";

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
        }
    ],
});

export default router;