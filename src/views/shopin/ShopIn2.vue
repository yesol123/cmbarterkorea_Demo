<template>
   
        <header>
        <RouterLink to="/shopin"><img src="@/assets/icon_arrow_left.svg" alt=""></RouterLink>
            <h3>가맹점 신청</h3>
        </header>

        <section>
            <div class="index">
                <div>1</div><span></span><div>2</div><span></span><div>3</div>
            </div>
            <p class="p">지금 바로 씨엠바더를 시작해 보세요!</p>
            <p class="p_samll">모두 동의해주셔야 다음 페이지로 이동 가능합니다.</p>

            <div style="margin-top: 50px;">
                <Checkbox v-model="AllCheck" :binary="true" inputId="all_agreed" @click="checkAll()"></Checkbox>
                <label for="all_agreed"> 모든 약관 동의 </label>
                <p class="p_samll">
                    전체동의는 필수 및 선택정보에 대한 동의도 포함되어 있으며, 개별적으로도 동의를 선택하실 수 있습니다. 선택항목에 대한 동의를 거부하시는 경우에도 서비스는 이용이 가능합니다.
                </p>

                <div class="underline"></div>
            </div>            

            <div class="check">
                <Checkbox v-model="service" :binary="true" inputId="service_agreed"></Checkbox>
                <label for="service_agreed" style="font-size: 0.9rem;"> [필수] CMBarter 가맹점 이용약관 동의</label>
                <button type="button" @click="ServiceAgreement()"><img src="@/assets/go_for_btn.png"></button>
            </div>
            <div class="check">
                <Checkbox v-model="privacy" :binary="true" inputId="privacy_agreed"></Checkbox>
                <label for="privacy_agreed" style="font-size: 0.9rem;"> [필수] 개인정보 수집 및 이용 동의</label>
                <button type="button" @click="PrivacyAgreement()"><img src="@/assets/go_for_btn.png"></button>
            </div>
            <div class="check">
                <Checkbox v-model="marketing" :binary="true" inputId="marketing_agreed"></Checkbox>
                <label for="marketing_agreed" style="font-size: 0.9rem;"> [선택] 마케팅 정보 수집 및 이용 동의</label>
                <button type="button" @click="MarketingAgreement()"><img src="@/assets/go_for_btn.png"></button>
            </div>
            <div class="check">
                <Checkbox v-model="advertise" :binary="true" inputId="advertise_agreed"></Checkbox>
                <label for="advertise_agreed" style="font-size: 0.9rem;"> [선택] 광고성 정보 수신 동의</label>
                <button type="button" @click="AdvertiseAgreement()"><img src="@/assets/go_for_btn.png"></button>
            </div>
            <div class="check">
                <Checkbox v-model="location" :binary="true" inputId="location_agreed"></Checkbox>
                <label for="location_agreed" style="font-size: 0.9rem;"> [필수] 위치기반서비스 이용약관 동의</label>
                <button type="button" @click="LocationAgreement()"><img src="@/assets/go_for_btn.png"></button>
            </div>

            <button type="button" class="confirm_btn" @click="confirmCheck()" :style="{ backgroundColor : buttonColor, color : fontColor}">확인</button>
        </section>
   
</template>

<script>
import { useResponseStore } from '@/store/response.js'
import router from '@/router/index.js';

export default {
    data() {
        return {
            AllCheck : false,
            service : false,
            privacy : false,
            marketing : false,
            advertise : false,
            location : false
        }
    },
    mounted() {

    },
    methods : {
        checkAll() {
            const allChecked = !this.AllCheck;
            this.service = allChecked;
            this.privacy = allChecked;
            this.marketing = allChecked;
            this.advertise = allChecked;
            this.location = allChecked;
        },
        confirmCheck() {
            if(this.service === false || this.privacy === false || this.location === false) {
                alert('필수항목을 체크해주세요.');
                return false;
            } else {

                // 기존 가입 여부 체크
                let store = useResponseStore();
                const formData = new FormData();
                formData.append('type', 'fran_join_check');
                formData.append('user_index', store.user_index);

                const url = process.env.VUE_APP_API_URL;

                fetch(url + 'api/join/joinform.php', {
                method : 'POST',
                body : formData
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    
                    if(data.msg.length == 1) {
                        alert('이미 가입된 가맹점입니다.');
                        return false;
                    }
                    if(data.msg.length == 0) {
                        router.push({ path : '/shopin3' });
                    }

                })
            }
        },
        ServiceAgreement() {
            this.$router.push({ path : '/service' });
        },
        PrivacyAgreement() {
            this.$router.push({ path : '/privacy' });
        },
        MarketingAgreement() {
            this.$router.push({ path : '/marketing' });
        },
        AdvertiseAgreement() {
            this.$router.push({ path : '/advertise' });
        },
        LocationAgreement() {
            this.$router.push({ path : '/locate' });
        }
    },
    computed: {
        buttonColor() {
            return this.AllCheck || (this.service && this.privacy && this.location) ? '#1bce0b' : '#ccc';
        },
        fontColor() {
            return this.AllCheck || (this.service && this.privacy && this.location) ? '#fff' : '#000';
        }
    },
}

</script>

<style scoped>
.p{
    font-weight: bold; 
}
.p_samll{
    font-size: 0.8rem; 
    margin-top: 10px; 
}

section {
    width: 100%;
    margin-top: 50px;
    padding: 10px;
    /* border: 1px solid red; */
}
section > div {
    position: relative;
    width: 100%;
    margin: 30px 0;
    padding: 0 10px;
    /* border: 1px solid blue; */
}
section button {
    position: absolute;
    right: 15px;
}
section button, .check img{
    width: 20px; height: 20px;
    border: none;
    background-color: #fff;
}
.underline {
    width: 100%; height: 1px;
    background-color: #ccc;
    margin-top: 20px
}
.confirm_btn {
    position: fixed;
    bottom: 70px;
    width: 95%; height: 35px;
    border-radius: 15px;
    color: #ccc;
    border: 1px solid #ccc;
}
.index {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 10px 0 50px 0;
    padding: 0 150px;
    /* border: 1px solid blue; */
}
.index > div {
    width: 25px; height: 25px;
    margin: 0 auto;
    border-radius: 50px;
    text-align: center; line-height: 25px;
    color: #ccc;
    border: 1px solid #ccc;
}
.index > div:nth-of-type(1) {
    background-color: #1bce0b;
    color: #fff;
    border: none;
}
.index > span {
    width: 20px; height: 1px;
    border: 1px solid #ccc;
}
label {
    color: #000;
}



@media (prefers-color-scheme: dark) {
 
    p,span,label{
      color: rgba(255, 255, 255, 0.87);
    }

    .check img , section button{
      background-color:  rgba(40, 38, 44, 1);
        
    }

}

</style>