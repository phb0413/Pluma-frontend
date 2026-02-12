import {createRouter, createWebHistory} from "vue-router";
import postListView from "@/views/postListView.vue";

const router = createRouter({
    history : createWebHistory(),
    routes: [
        {
            path:"/",
            component: postListView,
        },
    ],
});

export default router;