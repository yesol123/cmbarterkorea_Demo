<template>
  <header class="customer_gift_title">
    <RouterLink :to="`/main`"><img src="@/assets/icon_arrow_left.svg" alt=""></RouterLink>
    <h3> 선물</h3>
  </header>
  <section class="gift_area">
    <article>
      <p class="title">현재 CM</p>
      <div class="show_present_CM">
        <p class="gray">보유 자산</p>
        <p>{{ this.user_cm }}<span>CM</span></p>
      </div>

      <p class="title">회원 정보 입력</p>

      <div class="gift_userbox">
        <input id="user_search" name="user_search" v-model="userName" type="text" class="input_design useri m_T10"
          placeholder="아이디를 입력하세요.">
        <div id="search_img" class="searimgd" @click="seacrhUser()">
          <img src="@/assets/icon_search.svg" alt="">
        </div>
      </div>
      <p class="red">* 아이디 입력 후 검색 버튼을 클릭해주세요.</p>

      <p class="title">선물할 CM</p>
      <div class="gift_userbox_CM">
        <input id="user_search" name="user_search" v-model="send_cm" @input="calculate" value="" type="number"
          class="send input_design" placeholder="금액을 입력하세요.">
      </div>
      <p class="red">* 최소 선물 금액은 10,000 CM 입니다.</p>

      <!-- 검색시 나오는 폼-->
      <ul class="search_done" v-if="user_id">
        <li class="search_data">
          <p>아이디</p>
          <p>{{ this.user_id }}</p>
        </li>
        <li class="search_data">
          <p>이름</p>
          <p>{{ this.user_name }}</p>
        </li>
        <li class="search_data">
          <p>휴대폰번호</p>
          <p>{{ this.user_phone }}</p>
        </li>
      </ul>
      <!-- //검색시 나오는 폼-->

      <p class="title">선물 후 CM</p>
      <div class="show_present_CM">
        <p class="gray">보유 자산</p>
        <p>{{ this.rest_cm }}<span>CM</span></p>
      </div>

      <div class="giftBtn">
        <button @click="showConfirmPin">선물하기</button>
      </div>
    </article>
  </section>


  <!-- confirmPin 컴포넌트 모달 -->
  <ConfirmPin v-if="isOpen" ref="confirmPin" @pinSuccess="handlePinSuccess" :sendType="'cm'" />

  <div v-if="showModal" class="modal">
    <p class="caution">알림</p>
    <p>{{ this.error_massage }}</p>
    <button @click="confirm()">확인</button>
  </div>


  <div v-if="showModal2" class="modal">
    <p class="caution">알림</p>
    <p>보유한 CM이 부족합니다. <br>
      확인 후 다시 입력해주세요.
    </p>
    <button @click="confirm()">확인</button>
  </div>

  
  <div v-if="showModal3" class="modal">
    <p class="caution">알림</p>
    <p>최소 선물 금액은 10,000 CM 입니다.
    </p>
    <button @click="confirm()">확인</button>
  </div>

  <div v-if="showModal4" class="modal">
    <p class="caution">알림</p>
    <p>회원정보를 조회해주세요.
    </p>
    <button @click="confirm()">확인</button>
  </div>

</template>

<script>
import ConfirmPin from '@/components/ConfirmPin.vue';

import { useResponseStore } from '@/store/response.js'
//import router from '@/router/index.js';

export default {
  name: "giftPage",
  components: {
    ConfirmPin
  },
  data() {
    return {
      sendType: 'CM',
      user_cm: '', // 보유 CM
      userName: '', //
      user_id: '', // user_id
      user_name: '',// user_name
      user_phone: '',
      send_cm: '',//선물할 CM
      rest_cm: '',//남은 CM
      error_massage: '',
      give_user_index: '', //보내는 사람 index
      take_user_index: '', //받는 사람 index
      showModal: false,
      showModal2: false,
      showModal3:false,
      showModal4:false,
      isOpen: false, // confirmPin 모달 상태
      minGiftAmount: 10000, // 최소 선물 금액

    }
  },
  mounted() {

    let store = useResponseStore();
    const formData = new FormData();

    formData.append('type', 'authentication');
    formData.append('user_id', store.user_id);

    const url = process.env.VUE_APP_API_URL;
    fetch(url + 'api/common/main.php', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log('jsondata???');
        console.log(data.msg);
        let toJson = JSON.parse(data.msg)
        console.log(toJson);
        this.user_cm = toJson.user_cm.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      })

  },

  methods: {
    // showConfrimPin() {
    //   // 남은 CM이 음수일 경우
    //   const remainingCm = parseInt(this.rest_cm.replace(/,/g, ''), 10); // 잔여 CM 값에서 쉼표 제거 후 숫자로 변환

    //   if (remainingCm < 0) {
    //     this.showModal2 = true; // 모달2를 띄움
    //   } else {
    //     this.isOpen = true; // ConfirmPin 컴포넌트를 보이게 함 (핀 번호 입력 모달)
    //   }
    // },

    handlePinSuccess() {
      console.log('핀번호 성공, 선물하기 호출');
      this.sendGift(); // PIN 검증 성공 시 sendGift 함수 호출

      this.isOpen = false; // ConfirmPin 컴포넌트 닫기
    },
    seacrhUser() {
      let store = useResponseStore();
      const formData = new FormData();
      formData.append('type', 'search_user');
      formData.append('user_index', store.user_index);
      formData.append('find_user_id', this.userName);

      const url = process.env.VUE_APP_API_URL;
      fetch(url + 'api/gift/gift.php', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          this.user_id = data.take_user_id;
          this.user_name = data.take_user_name;
          this.user_phone = data.take_user_phone;
          this.error_massage = data.msg;
          this.take_user_index = data.take_user_index;

          // Pinia에 데이터 저장
          store.setGiftData({
            user_name: this.user_name,
            user_phone: this.user_phone,
            take_user_index: this.take_user_index,
          });

           // user_id가 없으면 모달을 표시
        if (!this.user_id) {
          this.showModal = true;
          this.error_massage = "회원 정보를 찾을 수 없습니다.";
        } else if (data.code == 500) {
          this.showModal = true;
        }
        });
    },
    calculate() {
      const userCM = parseInt(this.user_cm.replace(/,/g, ''));
      const sendCM = parseInt(this.send_cm || 0); // send_cm이 비어있을 때 0으로 처리

      this.rest_cm = (userCM - this.send_cm).toLocaleString();

      // 최소 금액 확인
    if (sendCM < this.minGiftAmount) {
      this.showMinAmountWarning = true;
    } else {
      this.showMinAmountWarning = false;
    }

    // 남은 CM 계산
    this.rest_cm = (userCM - sendCM).toLocaleString();
    },

    showConfirmPin() {
      if (!this.user_id) {
      this.showModal4 = true; // 회원정보를 조회하라는 모달을 띄움
      return;
    }
    const sendCM = parseInt(this.send_cm);
    
    // 최소 금액을 만족하지 않으면 모달을 띄우지 않음
    if (sendCM < this.minGiftAmount) {
      this.showModal3 = true;
      return;
    }

    const remainingCm = parseInt(this.rest_cm.replace(/,/g, ''), 10);
    if (remainingCm < 0) {
      this.showModal2 = true;
    } else {
      this.isOpen = true;
    }
  },


    sendGift() {

      const remainingCm = parseInt(this.rest_cm.replace(/,/g, ''));

      if (remainingCm < 0) {
        this.showModal2 = true;
      } else {

        let store = useResponseStore();
        const formData = new FormData();
        formData.append('type', 'gift');
        formData.append('give_user_index', store.user_index);
        formData.append('take_user_index', this.take_user_index);
        formData.append('cm', this.send_cm);

        const url = process.env.VUE_APP_API_URL;
        fetch(url + 'api/gift/gift.php', {
          method: 'POST',
          body: formData
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);

          })

      }
    },
    confirm() {
      this.showModal = false;
      this.showModal2 = false;
      this.showModal3 = false;
      this.showModal4 = false;
    }
  }

}

</script>


<style scoped>
*p {
  margin: 5px;
}

.show_present_CM {
  padding: 15px;
  border: 1px solid #4BAE4F;
  border-radius: 5px;
}

.show_present_CM .gray {
  color: #b1b1b1;
}

.show_present_CM p:nth-of-type(2) {
  text-align: end;
}

.title {
  font-weight: 500;
}

.gift_userbox {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input_design {
  width: 100%;
  padding: 10px;
  /* 이미지 공간을 확보하기 위해 padding 추가 */
  border: 1px solid #b1b1b1;
  border-radius: 5px;
}

#search_img {
  position: absolute;
  right: 10px;
  /* 이미지의 오른쪽 위치 조정 */
  top: 50%;
  transform: translateY(-45%);
  cursor: pointer;
}

#search_img img {
  width: 20px;
  height: 20px;
}

.red {
  color: red;
  text-align: end;
  font-size: small;
}

.search_done {
  border: 1px solid #b1b1b1;
  border-radius: 5px;
  padding: 5px 5px 5px 0px;
}

.search_data {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.giftBtn {
  margin-top: 15px;
}

.giftBtn button {
  width: 100%;
  border: 1px solid #b1b1b1;
  border-radius: 20px;
  background-color: transparent;
  padding: 10px;
  color: #b1b1b1;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  position: fixed;
  /* 고정 위치 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -70%);
  /* 화면의 중앙에 위치 */
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 400px;
  max-width: 90%;
  padding: 30px 20px;
  text-align: center;
  box-sizing: border-box;
}

.caution {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.caution img {
  width: 15%;
}

.modal button {
  margin: 10px;
  padding: 10px 20px;
  background-color: #4BAE4F;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.send {
  text-align: right;
  /* 기본은 오른쪽 정렬 */
}

.send:focus {
  text-align: left;
}
</style>