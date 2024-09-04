import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(""),  
    routes: [    
        {      
            path: "/",      
            name: "LogInPage",      
            component: () => import("@/views/LogInPage.vue"),    
        },
        {      
            path: "/join",      
            name: "JoinPage",      
            component: () => import("@/views/join/JoinPage.vue"),    
        },
        {      
            path: "/auth",      
            name: "AuthPage",      
            component: () => import("@/views/join/AuthPage.vue"),    
        },
        {      
            path: "/joinform",      
            name: "JoinForm",      
            component: () => import("@/views/join/JoinForm.vue"),    
        },
        {      
            path: "/joinend",      
            name: "JoinEnd",      
            component: () => import("@/views/join/JoinEnd.vue"),    
        },            
        {      
            path: "/findid",      
            name: "FindID",      
            component: () => import("@/views/find/FindID.vue"),    
        },   
        {      
            path: "/yourid",      
            name: "YourID",      
            component: () => import("@/views/find/YourID.vue"),    
        },    
        {      
            path: "/findpw",      
            name: "FindPW",      
            component: () => import("@/views/find/FindPW.vue"),    
        },   
        {      
            path: "/main",      
            name: "MainPage",      
            component: () => import("@/views/MainPage.vue"),    
        },      
        // {      
        //     path: "/",      
        //     name: "HelloWorld",      
        //     component: () => import("../components/HelloWorld.vue"),    
        // },  
        {      
            path: "/test",      
            name: "TestingPinia",      
            component: () => import("@/views/TestingPinia.vue"),    
        },      
        {      
            path: "/testing",      
            name: "PractuceExe",      
            component: () => import("@/views/PracticIng.vue"),    
        }, 
        {      
            path: "/popup",      
            name: "Popup",      
            component: () => import("@/components/PopCoupon.vue"),    
        },     
        {      
            path: "/qrscan",      
            name: "QRScan",      
            component: () => import("@/components/QrScan.vue"),    
        },      
        {      
            path: "/footer",      
            name: "Footer",      
            component: () => import("@/components/FooterPage.vue"),    
        },       
    ],
}); 

export default router;