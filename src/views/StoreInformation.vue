<template>
  <header class="store_infomation_title">
    <RouterLink :to="`/ChangeFranchise`"><img src="@/assets/icon_arrow_left.svg" alt=""></RouterLink>
    <h3>매장 관리</h3>
    <RouterLink to="">
      <img src="@/assets/icon_close.svg" alt="Close" />
    </RouterLink>
  </header>

  <section class="store_info_area">
    <ul>
      <li>
        <RouterLink to='/ChangeFranchise'> 기본 정보</RouterLink>
      </li>
      <li>
        <RouterLink to='/storeInformation'> 운영 정보</RouterLink>
      </li>
    </ul>

    <div>
      <p class="title">영업정보</p>
    </div>

    <article v-for="(workHours, index) in workHoursList" :key="index">
      <div class="business_hours">
        <div class="flex_between">
          <p class="title holiday_txt m_B20">영업 시간</p>
        </div>

        <div class="flex_between">
          <div class="hours_box">
            <a-config-provider :locale="locale">
              <a-time-picker class="timepicker hours_time" v-model:value="workHours.openTime" :format="format"
                dropdown-class-name="custom-time-picker-dropdown" />
            </a-config-provider>
            <!-- 
            <img src="@/assets/icon_shevron_down.svg" alt="화살표" @click="toggleDropdown"> -->
          </div>
          <div class="hours_box">

            <a-config-provider :locale="locale">
              <a-time-picker class="timepicker hours_time" v-model:value="workHours.closeTime" :format="format"
                dropdown-class-name="custom-time-picker-dropdown" />
            </a-config-provider>
          </div>
        </div>

        <div class="flex_between">
          <p class="title holiday_txt m_B20">휴게 시간</p>
        </div>
        <div class="flex_between time_rest d_none">
          <div class="hours_box">
            <a-config-provider :locale="locale">
              <a-time-picker class="timepicker hours_time" v-model:value="workHours.restStartTime" :format="format"
                dropdown-class-name="custom-time-picker-dropdown" />
            </a-config-provider>
          </div>
          <div class="hours_box">

            <a-config-provider :locale="locale">
              <a-time-picker class="timepicker hours_time" v-model:value="workHours.restEndTime" :format="format"
                dropdown-class-name="custom-time-picker-dropdown" />
            </a-config-provider>
          </div>
        </div>
        <b class="info_note" id="timeError1">* 휴게시간은 운영시간 안으로만 설정가능합니다.</b>

        <b class="info_note" v-if="workHours.hasDuplicate" style="color: red;">* 중복된 요일이 선택되었습니다.</b>
        <ul class="join_state" id="day1">
          <li v-for="day in days" :key="day.value">
            <label class="join_obj">
              <input type="checkbox" v-model="workHours.selectedDays" :value="day.value" @change="checkDuplicateDays">
              <span>{{ day.label }}</span>
            </label>
          </li>
        </ul>
      </div>
    </article>

    <div class="flex_between">
      <p class="title">공휴일 / 국경일 휴무</p>
      <div class="checkbox-wrapper-2">
        <input class="sc-gJwTLC ikxBAC" type="checkbox" v-model="businessInfo.holiday" name="saturday">
      </div>
    </div>

    <div>
      <p class="title">정기휴무</p>
      <div class="regular_holiday">
        <label class="for_select" for="selectWeek">
          <select v-model="businessInfo.regularHoliday.frequency" name="" id="selectWeek" class="select">
            <option value="주기" selected>주기</option>
            <option value="매주">매주</option>
            <option value="격주">격주</option>
          </select>
        </label>
        <label class="for_select" for="selectDay">
          <select v-model="businessInfo.regularHoliday.day" name="" id="selectDay" class="select">
            <option value="요일" selected>요일</option>
            <option value="일">일요일</option>
            <option value="월">월요일</option>
            <option value="화">화요일</option>
            <option value="수">수요일</option>
            <option value="목">목요일</option>
            <option value="금">금요일</option>
            <option value="토">토요일</option>
          </select>
        </label>
      </div>
    </div>

    <div>
      <p class="title">임시휴무</p>
      <div class="temporary_Closure">
        <a-config-provider :locale="locale">
          <a-space direction="vertical" size="12">
            <a-range-picker :format="'YYYY-MM-DD'"
              :value="[businessInfo.temporaryClosure.startDate, businessInfo.temporaryClosure.endDate]"
              v-model="businessInfo.temporaryClosure.dateRange" :presets="rangePresets" @change="onRangeChange" />
          </a-space>
        </a-config-provider>
        <input class="coments" type="text" name="" id="" v-model="businessInfo.temporaryClosure.comment"
          placeholder="코멘트를 입력하세요">
      </div>
    </div>


    <button class="save_btn" @click="saveData()">저장</button>

  </section>
</template>

<script>
import { message } from 'ant-design-vue'
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import koKR from 'ant-design-vue/es/locale/ko_KR';
import { useResponseStore } from '@/store/response.js'
import router from '@/router/index.js';


export default {
  name: 'storeInformation',

  mounted() {

    let store = useResponseStore();

    const formData1 = new FormData();

    formData1.append('type', 'store_info1');
    formData1.append('user_index', store.user_index);

    const url = process.env.VUE_APP_API_URL;
    fetch(url + 'api/store/store_update.php', {
      method: 'POST',
      body: formData1
    })
      .then(response => response.json())
      .then(data => {
        console.log('저장내역@@@@@@@@!!!!!', data);
        this.workHoursList = data.msg.map(storeData => ({
          openTime: dayjs(storeData.store_start_business_hour, 'HH:mm'),
          closeTime: dayjs(storeData.store_end_business_hour, 'HH:mm'),
          restStartTime: dayjs(storeData.store_rest_start_hour, 'HH:mm'),
          restEndTime: dayjs(storeData.store_rest_end_hour, 'HH:mm'),
          selectedDays: storeData.store_business_date.split(','),
          hasDuplicate: false
        }));

        this.checkDuplicateDays();
      })

    const formData2 = new FormData();


    formData2.append('type', 'store_info2');
    formData2.append('user_index', store.user_index);

    fetch(url + 'api/store/store_update.php', {
      method: 'POST',
      body: formData2
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);

        console.log('공휴일Y/N', data.msg[0].store_holiday_status);
        this.businessInfo.holiday = data.msg[0].store_holiday_status === 'Y'; // 'Y'면 true, 'N'면 false


        console.log('정기휴일주기', data.msg[0].store_regular_closing_interval);
        console.log('정기휴일요일', data.msg[0].store_regular_closing_week);


        // 정기휴일 데이터를 businessInfo.regularHoliday에 바인딩
        this.businessInfo.regularHoliday.frequency = data.msg[0].store_regular_closing_interval; // 주기
        this.businessInfo.regularHoliday.day = data.msg[0].store_regular_closing_week; // 요일



        console.log('임시휴무 코멘트!', data.msg[0].store_temporary_closing_comment);
        console.log('임시휴무 날짜!', data.msg[0].store_temporary_closing_date);

        // 임시휴무 날짜 처리
        const dateRangeStr = data.msg[0].store_temporary_closing_date; // API에서 받은 날짜
        console.log(dateRangeStr);

        if (dateRangeStr) {
          const dates = dateRangeStr.split(' ~ '); // "YYYY-MM-DD ~ YYYY-MM-DD" 형식일 경우
          this.businessInfo.temporaryClosure.startDate = dayjs(dates[0], 'YYYY-MM-DD');
          this.businessInfo.temporaryClosure.endDate = dayjs(dates[1], 'YYYY-MM-DD');
        }

        this.businessInfo.temporaryClosure.comment = data.msg[0].store_temporary_closing_comment;
      })

  },
  watch: {
    workHoursList: {
      handler() {

        this.checkDuplicateDays();

      },
      deep: true,
    },
    restStartTime() {
      this.validateRestTime();
    },
    restEndTime() {
      this.validateRestTime();
    }
  },
  data() {
    return {
      days: [
        { value: '일', label: '일' },
        { value: '월', label: '월' },
        { value: '화', label: '화' },
        { value: '수', label: '수' },
        { value: '목', label: '목' },
        { value: '금', label: '금' },
        { value: '토', label: '토' }
      ],

      workHours1: {
        day: '', // 첫 번째 시간 세트의 요일
        openTime: dayjs('00:00', 'HH:mm'), // 첫 번째 시간 세트 영업 시작 시간
        closeTime: dayjs('00:00', 'HH:mm'), // 첫 번째 시간 세트 영업 종료 시간
        restStartTime: dayjs('00:00', 'HH:mm'), // 첫 번째 시간 세트 휴게 시작 시간
        restEndTime: dayjs('00:00', 'HH:mm'), // 첫 번째 시간 세트 휴게 종료 시간
      },
      workHours2: {
        day: '', // 두 번째 시간 세트의 요일
        openTime: dayjs('00:00', 'HH:mm'), // 두 번째 시간 세트 영업 시작 시간
        closeTime: dayjs('00:00', 'HH:mm'), // 두 번째 시간 세트 영업 종료 시간
        restStartTime: dayjs('00:00', 'HH:mm'), // 두 번째 시간 세트 휴게 시작 시간
        restEndTime: dayjs('00:00', 'HH:mm'), // 두 번째 시간 세트 휴게 종료 시간
      },

      workHours3: {
        day: '', // 세 번째 시간 세트의 요일
        openTime: dayjs('00:00', 'HH:mm'), // 세 번째 시간 세트 영업 시작 시간
        closeTime: dayjs('00:00', 'HH:mm'), // 세 번째 시간 세트 영업 종료 시간
        restStartTime: dayjs('00:00', 'HH:mm'), // 세 번째 시간 세트 휴게 시작 시간
        restEndTime: dayjs('00:00', 'HH:mm'), // 세 번째 시간 세트 휴게 종료 시간
      },

      businessInfo: {
        holiday: false, // 공휴일 유무
        regularHoliday: {   //정기휴무
          frequency: '주기',
          day: '요일',
        },
        temporaryClosure: { //임시휴무
          dateRange: [],
          comment: '',
        }
      },
      format: 'HH:mm',
      locale: koKR,
      showTimeError: false, // 오류 메시지 표시 여부
      workHoursList: [
        { openTime: null, closeTime: null, restStartTime: null, restEndTime: null, selectedDays: [], hasDuplicate: false },
        { openTime: null, closeTime: null, restStartTime: null, restEndTime: null, selectedDays: [], hasDuplicate: false },
        { openTime: null, closeTime: null, restStartTime: null, restEndTime: null, selectedDays: [], hasDuplicate: false }
      ]

    };
  },

  methods: {
    checkDuplicateDays() {
      // 모든 선택된 요일을 합쳐서 중복된 요일을 확인합니다.
      const allSelectedDays = this.workHoursList.reduce((acc, workHours) => {
        return acc.concat(workHours.selectedDays);
      }, []);

      // 각 요일이 몇 번 선택되었는지 확인합니다.
      const dayCount = {};
      allSelectedDays.forEach(day => {
        dayCount[day] = (dayCount[day] || 0) + 1;
      });


      // 중복된 요일 목록을 추출합니다.
      const duplicateDays = Object.keys(dayCount).filter(day => dayCount[day] > 1);

      // 각 workHours의 selectedDays에서 중복된 요일을 검사하고 해제합니다.
      this.workHoursList.forEach(workHours => {
        workHours.hasDuplicate = workHours.selectedDays.some(day => duplicateDays.includes(day));
        if (workHours.hasDuplicate) {
          workHours.selectedDays = workHours.selectedDays.filter(day => !duplicateDays.includes(day))
          message.error('다른 박스에서 이미 선택된 요일은 선택할 수 없습니다.');
        }
      })

    },
    onRangeChange(dates) {
      if (dates && dates.length === 2) {
        this.businessInfo.temporaryClosure.startDate = dates[0];
        this.businessInfo.temporaryClosure.endDate = dates[1];
      }
    },
    validateRestTime() {
      // openTime, closeTime, restStartTime, restEndTime이 제대로 설정되었는지 먼저 확인
      if (!this.openTime || !this.closeTime || !this.restStartTime || !this.restEndTime) {
        return;
      }

      // 휴게 시작 시간이 영업 시작 시간 이전이거나, 휴게 종료 시간이 영업 종료 시간 이후일 때
      if (this.restStartTime.isBefore(this.openTime) || this.restEndTime.isAfter(this.closeTime)) {
        this.showTimeError = true;
        message.error("휴게시간은 운영시간 안으로 설정해야 합니다.");
      } else {
        this.showTimeError = false;
      }
    },
    // 영업 시간에 맞게 휴게 시간의 시작 시간을 제한
    disabledRestStartHours() {
      const startHour = this.openTime.hour();
      const endHour = this.closeTime.hour();
      const disabledHours = [];
      for (let i = 0; i < 24; i++) {
        if (i < startHour || i >= endHour) {
          disabledHours.push(i);
        }
      }
      return disabledHours;
    },
    // 영업 시간에 맞게 휴게 시간의 종료 시간을 제한
    disabledRestEndHours() {
      const startHour = this.restStartTime ? this.restStartTime.hour() : this.openTime.hour();
      const endHour = this.closeTime.hour();
      const disabledHours = [];
      for (let i = 0; i < 24; i++) {
        if (i <= startHour || i > endHour) {
          disabledHours.push(i);
        }
      }
      return disabledHours;
    },
    saveData() {
      let store = useResponseStore();

      const formData = new FormData();
      // 시작일과 종료일을 개별적으로 처리
      let startDate = dayjs(this.businessInfo.temporaryClosure.startDate).format('YYYY-MM-DD');
      let endDate = dayjs(this.businessInfo.temporaryClosure.endDate).format('YYYY-MM-DD');
      let dateRangeStr = `${startDate} ~ ${endDate}`;

      formData.append('type', 'store_update3');
      formData.append('user_index', store.user_index);

      this.workHoursList.forEach((workHours, index) => {
        formData.append(`work_start_time${index + 1}`, workHours.openTime.format(this.format));
        formData.append(`work_end_time${index + 1}`, workHours.closeTime.format(this.format));
        formData.append(`rest_start_time${index + 1}`, workHours.restStartTime.format(this.format));
        formData.append(`rest_end_time${index + 1}`, workHours.restEndTime.format(this.format));
        formData.append(`day${index + 1}`, workHours.selectedDays.join(','));
      });

      formData.append('holi', this.businessInfo.holiday ? 'Y' : 'N'); //공휴일 유무
      formData.append('reg_type', this.businessInfo.regularHoliday.frequency); //정기휴무 주기
      formData.append('reg_day', this.businessInfo.regularHoliday.day); //정기휴무 요일
      formData.append('datetimes', dateRangeStr)// 임시휴무 날짜지정
      formData.append('datetimes', dateRangeStr)// 임시휴무 날짜지정
      formData.append('holiday_txt', this.businessInfo.temporaryClosure.comment)// 임시휴무 코멘트




      // formData.append('type', 'store_update3');
      // formData.append('user_index', store.user_index);
      // formData.append('work_start_time1', this.workHours1.openTime.format(this.format)); //시작시간
      // formData.append('work_end_time1', this.workHours1.closeTime.format(this.format)); //끝나는 시간
      // formData.append('rest_start_time1', this.workHours1.restStartTime.format(this.format)); // 휴게시간 시작
      // formData.append('rest_end_time1', this.workHours1.restEndTime.format(this.format)); //휴게시간 끝
      // formData.append('day1', this.workHoursList[0].selectedDays.join(',')); //날짜 선택 

      // formData.append('work_start_time2', this.workHours2.openTime.format(this.format)); //시작시간
      // formData.append('work_end_time2', this.workHours2.closeTime.format(this.format)); //끝나는 시간
      // formData.append('rest_start_time2', this.workHours2.restStartTime.format(this.format)); // 휴게시간 시작
      // formData.append('rest_end_time2', this.workHours2.restEndTime.format(this.format)); //휴게시간 끝
      // formData.append('day2', this.workHoursList[1].selectedDays.join(',')); //날짜 선택 

      // formData.append('work_start_time3', this.workHours3.openTime.format(this.format)); //시작시간
      // formData.append('work_end_time3', this.workHours3.closeTime.format(this.format)); //끝나는 시간
      // formData.append('rest_start_time3', this.workHours3.restStartTime.format(this.format)); // 휴게시간 시작
      // formData.append('rest_end_time3', this.workHours3.restEndTime.format(this.format)); //휴게시간 끝
      // formData.append('day3', this.workHoursList[2].selectedDays.join(',')); //날짜 선택 

      // formData.append('holi', this.businessInfo.holiday ? 'Y' : 'N'); //공휴일 유무
      // formData.append('reg_type', this.businessInfo.regularHoliday.frequency); //정기휴무 주기
      // formData.append('reg_day', this.businessInfo.regularHoliday.day); //정기휴무 요일
      // formData.append('datetimes', dateRangeStr)// 임시휴무 날짜지정
      // formData.append('holiday_txt', this.businessInfo.temporaryClosure.comment)// 임시휴무 코멘트


      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      const url = process.env.VUE_APP_API_URL;

      fetch(url + 'api/store/store_update.php', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          console.log('data', data);

          router.push({ path: '/ChangeFranchise' });


        })

    }

  }
}
</script>



<style scoped>
ul,
a {
  list-style: none;
  padding: 0;
  font-size: 18px;
  text-decoration: none;
}


.holiday_txt {
  margin: 8px 0;
}

article {
  margin-bottom: 20px;
  /* 각 article 태그 사이에 20px의 마진을 줍니다 */
}

.store_info_area>ul:nth-child(1) {
  display: flex;
  justify-content: center;
  padding: 0;
  text-decoration: none;
  list-style: none;
}

.store_info_area>ul:nth-child(1)>li:nth-child(1) {
  padding: 10px 20px;
  width: 50%;
  text-align: center;
  font-size: 20px;
  border-bottom: 3px solid gray;

}

.store_info_area>ul:nth-child(1)>li:nth-child(2) {
  padding: 10px 20px;
  width: 50%;
  text-align: center;
  font-size: 20px;
  border-bottom: 3px solid #1749c2;
}

.title {
  font-weight: bold;
}

.coments,
.select {
  padding: 8px;
  border: 1px solid #b1b1b1;
  border-radius: 5px;

}

.business_hours {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #b1b1b1;
  border-radius: 5px;
}

.flex_between {
  width: 95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hours_box {
  width: 49%;
  position: relative;
}

.hours_box>img {
  position: absolute;
  right: 0;
  top: 25%;
  transition: 500ms ease;
}

.hours_time {
  border: 1px solid #b1b1b1;
  border-radius: 10px;
  width: 100%;
  padding: 8px;
}

.info_note {
  margin-top: 20px;
}

.timepicker {
  font-family: 'noto_sans';
  font-size: 14px;
  padding: 10.5px 8px 10.5px 22px !important;
}

.join_state {
  display: flex;
}


.custom-time-picker-dropdown .ant-picker-input {
  width: 85% !important;
  /* 원하는 너비로 설정 */
}

.custom-time-picker-dropdown .ant-picker-input input {
  width: 100% !important;
  /* input 필드 너비 조정 */
}

.regular_holiday {
  display: flex;
  justify-content: space-between;
}

.regular_holiday .for_select {
  width: 45%;
}

select {
  width: 100%;
}

.join_state {
  display: flex;
  gap: 10px;
  justify-content: center;
  width: 100%;
}

.join_obj {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #b1b1b1;
  /* 테두리 색상 */
  border-radius: 50%;
  /* 동그란 원 */
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 16px;
  color: #b1b1b1;
  text-align: center;
  user-select: none;
  /* 텍스트 선택 불가능 */
}

.join_obj input[type="checkbox"] {
  display: none;
  /* 라디오 버튼 숨기기 */
}

.join_obj span {
  pointer-events: none;
  /* 텍스트 클릭 비활성화 */
}

/* 선택된 상태에서 스타일 */
.join_obj input[type="checkbox"]:checked+span {
  background-color: #1749c2;
  /* 선택된 상태의 배경색 */
  color: white;
  /* 선택된 상태의 텍스트 색상 */
  border-radius: 50%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}



.temporary_Closure {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ant-picker {
  width: 100%;
}

.save_btn {
  width: 100%;
  margin: 15px 0;
  padding: 8px 0;
  border-radius: 5px;
  border: 0;
  background-color: #1749c2;
  color: white;
}

/* 국경일 checkbox css */
.checkbox-wrapper-2 .ikxBAC {
  appearance: none;
  background-color: #dfe1e4;
  border-radius: 72px;
  border-style: none;
  flex-shrink: 0;
  height: 20px;
  margin: 0;
  position: relative;
  width: 30px;
}

.checkbox-wrapper-2 .ikxBAC::before {
  bottom: -6px;
  content: "";
  left: -6px;
  position: absolute;
  right: -6px;
  top: -6px;
}

.checkbox-wrapper-2 .ikxBAC,
.checkbox-wrapper-2 .ikxBAC::after {
  transition: all 100ms ease-out;
}

.checkbox-wrapper-2 .ikxBAC::after {
  background-color: #fff;
  border-radius: 50%;
  content: "";
  height: 14px;
  left: 3px;
  position: absolute;
  top: 3px;
  width: 14px;
}

.checkbox-wrapper-2 input[type=checkbox] {
  cursor: default;
}

.checkbox-wrapper-2 .ikxBAC:hover {
  background-color: #c9cbcd;
  transition-duration: 0s;
}

.checkbox-wrapper-2 .ikxBAC:checked {
  background-color: #007bff;
  /* background-color: #6e79d6; */
}

.checkbox-wrapper-2 .ikxBAC:checked::after {
  background-color: #fff;
  left: 13px;
}

.checkbox-wrapper-2 :focus:not(.focus-visible) {
  outline: 0;
}

.checkbox-wrapper-2 .ikxBAC:checked:hover {
  background-color: #007bff;

  /* background-color: #535db3; */
}



@media (max-width: 360px) {
  .join_state {
    gap: 5px;
  }

}
</style>