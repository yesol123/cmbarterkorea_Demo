<template>
    <header class="changePin_header_title">
        <RouterLink :to="`/mypage/${this.member}`"><img src="@/assets/icon_arrow_left.svg" alt=""></RouterLink>
        <h3> PIN 번호 변경</h3>
    </header>

    <section class="changePin_seciotn">

        <div>
            <label for="password_">로그인 비밀번호</label>
            <input v-model="password" id="password_" type="password" placeholder="PIN 번호 변경을 위해 비밀번호를 입력해주세요.">
            <p class="notion" v-if="!emptypassword">*비밀번호를 입력해주세요.</p>
        </div>


        <div>
            <button @click="goNext()">다음</button>
        </div>
    </section>
</template>

<script>
import { useResponseStore } from '@/store/response.js';
import router from '@/router/index.js';


export default {
    name: 'ChangePin1',
    data() {
        return {
            member: '',
            password: ''
        }

    },

    methods: {
        goNext() {

            let store = useResponseStore();

            const formData = new FormData();

            formData.append('type', 'pw_check');
            formData.append('user_index', store.user_index);
            formData.append('user_pw', this.password);

            const url = process.env.VUE_APP_API_URL;
            console.log(url);

            fetch(url + 'api/common/main.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);

                    if (data.code == 500) {
                        alert(data.msg)
                    }

                    if (data.code == 200) {
                        alert(data.msg)
                        router.push({ path: '/ChangePin2' })
                    }


                })
        }

    },
    mounted() {
        // store에서 member 값을 가져와서 data에 할당
        let store = useResponseStore();
        this.member = store.member;
    },


    computed: {


        emptypassword() {
            return this.password !== ''
        }

    }
}

</script>


<style scoped>
*p,
label {
    margin-bottom: 10px;
}

div {
    display: flex;
    flex-direction: column;
    margin: 20px auto;
}

div>input {
    width: 100%;
    padding: 10px;
    border: 1px solid #B1B1B1;
    border-radius: 5px;
}

div>input:focus {
    outline: 1px solid #4A9EFA;
}


button {
    width: 95%;
    align-items: center;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #1749C2;
    ;
    background-color: #1749C2;
    ;
    color: white;
    font-size: 16px;
    position: fixed;
    bottom: 60px;
    cursor: pointer;
    /* 비활성화 시 마우스 커서 */
}

.notion {
    color: red;
    font-size: 13px;
}
</style>