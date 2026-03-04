import {createRouter, createWebHistory} from "vue-router";
import postListView from "@/views/postListView.vue";
import postDetailView from "@/views/postDetailView.vue";

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
        }
    ],
});

export default router;