<template>
    
        <header>
            <button type="button" class="goback_btn" @click="toQRPin()"><img src="@/assets/icon_arrow_left.svg"></button>
            <h3>결제 취소</h3>
        </header>

        <section>
            <div class="qr_wrap">
            <p>가맹점에 해당 QR코드를 보여주세요.</p>
            <p>{{ id }}</p>
            <img :src="`https://quickchart.io/chart?chs=200x200&cht=qr&chl=${qrdigit}`" alt="QR코드">
            <div class="qrinput" style="margin: 20px 0;">
                <!-- <input type="number" placeholder="QR 6자리를 입력해주세요."> -->
                 <p style="font-weight: bold;">{{ qrdigit }}</p>
            </div>
            <p>결제 취소 금액</p>
            <p>{{ price }}</p>
            <button type="button" @click="toCMList()">확인</button>
        </div>
        </section>
     
   
</template>

<script>
import { useResponseStore } from '@/store/response.js'

export default {
    data() {
        return {
            id : '',
            qrdigit : '',
            price : ''
        }
    },
    mounted() {
        this.ShowQR();

        let store = useResponseStore();
        this.id = store.user_id;
        this.price = store.cancel_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    methods : {
        ShowQR() {

            let store = useResponseStore();

            const cancelprice = store.cancel_price.replace(',', '');

            let formData = new FormData();
            formData.append('type', 'qr_code');
            formData.append('user_index', store.user_index);
            formData.append('amount', cancelprice);
            formData.append('index', store.user_cm_log_index);

            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const url = process.env.VUE_APP_API_URL;

            fetch(url + 'api/common/cm.php', {
            method : 'POST',
            body : formData
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.qrdigit = data.msg;
                // console.log(this.qrdigit);
                // this.commaprice = this.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            })
        },
        toQRPin() {
            this.$router.push({ path : '/cmpin' });
        },
        toCMList() {
            this.$router.push({ path : '/cmlist' });
        },
    }
}

</script>

<style scoped>

.goback_btn {
    width: 30px; height: 30px;
    background-color: #fff;
    border: 1px solid #fff;
}
.goback_btn img {
    width: 100%; height: 100%;
}
.qr_wrap {
    width: 100%;
    margin-top: 100px;
    text-align: center;
    /* border: 1px solid red; */
}
.qr_wrap > p {
    width: 100%;
}
.qr_wrap > img {
    margin: 0 auto;
    /* border: 1px solid red; */
}
.qr_wrap > p:nth-of-type(1) {
    font-weight: bold;
    margin-bottom: 10%;
}
/* .qr_wrap > p:nth-of-type(2) {

}
.qrinput {
} */
/*input {
    width: 220px; height: 30px;
    border-radius: 7px;
    border: 1px solid #000;
    padding-left: 10px;
    font-size: 0.9rem;
    color: #000;
    margin-bottom: 10%;
}*/
.qr_wrap > p:nth-of-type(3) {
    font-size: 0.9rem;
    margin-bottom: 3%;
}
.qr_wrap > p:nth-of-type(4) {
    font-weight: bold;
    font-size: 1.1rem
}
.qr_wrap > button {
    position: fixed;
    bottom: 60px; left: 50%;
    transform: translateX(-50%);
    width: 95%; height: 40px;
    border-radius: 7px;
    color: #fff;
    background-color: #1bce0b;
    border: none;
}
</style>